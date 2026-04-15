"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getCustomerOrders(userId?: string) {
  const session = await auth();
  const currentUserId = userId || session?.user?.id;

  if (!currentUserId) {
    return { error: "You must be signed in", orders: [] };
  }

  // Ensure the user can only access their own orders
  if (userId && session?.user?.id !== userId) {
    return { error: "Unauthorized", orders: [] };
  }

  const orders = await db.order.findMany({
    where: { userId: currentUserId },
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
      },
      address: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { orders };
}

export async function getOrderDetails(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              slug: true,
              images: { take: 1, select: { url: true } },
              vendor: { select: { businessName: true } },
            },
          },
        },
      },
      address: true,
      payment: true,
      coupon: true,
      tracking: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    return { error: "Order not found" };
  }

  // Verify ownership
  if (order.userId !== session.user.id) {
    return { error: "You do not have permission to view this order" };
  }

  return { order };
}

export async function cancelOrder(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { error: "Order not found" };
  }

  if (order.userId !== session.user.id) {
    return { error: "You do not have permission to cancel this order" };
  }

  if (order.status !== "PENDING") {
    return {
      error: "Only pending orders can be cancelled. Please contact support for further assistance.",
    };
  }

  try {
    await db.$transaction(async (tx) => {
      // Cancel the order
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
          paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : order.paymentStatus,
        },
      });

      // Restore stock for each item
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // If payment was made, update payment record
      if (order.paymentStatus === "PAID") {
        await tx.payment.updateMany({
          where: { orderId },
          data: { status: "REFUNDED" },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Order cancellation failed:", error);
    return { error: "Failed to cancel order. Please try again." };
  }
}

export async function trackOrderByNumber(orderNumber: string) {
  const order = await db.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      deliveryMethod: true,
      createdAt: true,
      updatedAt: true,
      tracking: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    return { error: "No order found with that number" };
  }

  return { order };
}
