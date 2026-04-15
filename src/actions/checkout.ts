"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/format";
import { getPaymentProvider } from "@/lib/payments";
import type { PaymentMethod, DeliveryMethod } from "@prisma/client";

interface CartItemInput {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface CreateOrderInput {
  items: CartItemInput[];
  addressId: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export async function createOrder(data: CreateOrderInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to place an order" };
  }

  const userId = session.user.id;

  if (!data.items || data.items.length === 0) {
    return { error: "Your cart is empty" };
  }

  // Validate address belongs to user
  const address = await db.address.findFirst({
    where: { id: data.addressId, userId },
  });
  if (!address) {
    return { error: "Invalid delivery address" };
  }

  // Validate stock availability for all items
  const productIds = data.items.map((item) => item.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { error: `Product "${item.title}" is no longer available` };
    }
    if (product.stock < item.quantity) {
      return {
        error: `Insufficient stock for "${product.title}". Only ${product.stock} available.`,
      };
    }
  }

  // Calculate subtotal from actual DB prices (not client-sent prices)
  let subtotal = 0;
  const orderItems: { productId: string; quantity: number; price: number; total: number }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId)!;
    const price = Number(product.price);
    const total = price * item.quantity;
    subtotal += total;
    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price,
      total,
    });
  }

  // Calculate delivery fee
  const deliveryFeeResult = await getDeliveryFee(data.addressId, data.deliveryMethod);
  const deliveryFee = deliveryFeeResult.fee ?? 0;

  // Apply coupon if provided
  let discount = 0;
  let couponId: string | null = null;

  if (data.couponCode) {
    const couponResult = await applyCoupon(data.couponCode, subtotal);
    if (couponResult.error) {
      return { error: couponResult.error };
    }
    discount = couponResult.discount ?? 0;
    couponId = couponResult.couponId ?? null;
  }

  const total = subtotal + deliveryFee - discount;

  try {
    // Create order in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId: data.addressId,
          status: "PENDING",
          paymentStatus: "UNPAID",
          paymentMethod: data.paymentMethod,
          subtotal,
          deliveryFee,
          discount,
          total,
          couponId,
          deliveryMethod: data.deliveryMethod,
          notes: data.notes || null,
          items: {
            create: orderItems,
          },
        },
      });

      // Decrement stock for each product
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Increment coupon usage if used
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    // Initiate payment
    const provider = getPaymentProvider(data.paymentMethod);
    const paymentResult = await provider.initiate(total, "ZMW", {
      orderId: order.id,
      orderNumber: order.orderNumber,
    });

    if (paymentResult.success && paymentResult.transactionId) {
      // Create payment record
      await db.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          method: data.paymentMethod,
          status: "PAID",
          transactionId: paymentResult.transactionId,
        },
      });

      // Update order payment status
      await db.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });
    } else {
      // Create pending payment record
      await db.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          method: data.paymentMethod,
          status: "PENDING",
          transactionId: paymentResult.transactionId,
        },
      });

      await db.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PENDING" },
      });
    }

    return { success: true, orderId: order.id, redirectUrl: paymentResult.redirectUrl };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { error: "Failed to create order. Please try again." };
  }
}

export async function applyCoupon(code: string, subtotal?: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  const coupon = await db.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { error: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { error: "This coupon is no longer active" };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { error: "This coupon has expired" };
  }

  if (coupon.startsAt && coupon.startsAt > new Date()) {
    return { error: "This coupon is not yet active" };
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { error: "This coupon has reached its maximum usage limit" };
  }

  const minOrder = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
  if (subtotal !== undefined && minOrder > 0 && subtotal < minOrder) {
    return {
      error: `Minimum order amount of K${minOrder.toFixed(2)} required for this coupon`,
    };
  }

  const discountValue = Number(coupon.discountValue);
  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = subtotal ? (subtotal * discountValue) / 100 : 0;
  } else {
    discount = discountValue;
  }

  // Never discount more than the subtotal
  if (subtotal && discount > subtotal) {
    discount = subtotal;
  }

  return {
    success: true,
    couponId: coupon.id,
    discount,
    discountType: coupon.discountType,
    discountValue,
    description: coupon.description,
  };
}

export async function getDeliveryFee(
  addressId: string,
  method: DeliveryMethod
) {
  if (method === "PICKUP") {
    return { fee: 0, zoneName: "Pickup" };
  }

  const address = await db.address.findUnique({
    where: { id: addressId },
    select: { province: true },
  });

  if (!address) {
    return { error: "Address not found", fee: 0 };
  }

  const zone = await db.deliveryZone.findFirst({
    where: { province: address.province, isActive: true },
  });

  if (!zone) {
    // Default fee if no zone configured
    return { fee: 50, zoneName: "Default" };
  }

  const fee =
    method === "EXPRESS"
      ? Number(zone.expressFee) || Number(zone.baseFee) * 1.5
      : Number(zone.baseFee);

  return { fee, zoneName: zone.name };
}
