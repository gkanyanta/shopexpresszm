"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type {
  Role,
  VendorStatus,
  OrderStatus,
  PaymentStatus,
  BuyForMeStatus,
} from "@prisma/client";

// ─── HELPERS ────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// ─── USER ACTIONS ───────────────────────────────────────

export async function updateUserRole(userId: string, role: Role) {
  await requireAdmin();
  const schema = z.object({
    userId: z.string().min(1),
    role: z.enum(["GUEST", "CUSTOMER", "VENDOR", "ADMIN"]),
  });
  const parsed = schema.parse({ userId, role });

  await db.user.update({
    where: { id: parsed.userId },
    data: { role: parsed.role },
  });
  revalidatePath("/admin/users");
}

export async function toggleUserStatus(userId: string) {
  await requireAdmin();
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  await db.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });
  revalidatePath("/admin/users");
}

// ─── VENDOR ACTIONS ─────────────────────────────────────

export async function approveVendor(vendorId: string) {
  await requireAdmin();
  await db.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "APPROVED", isVerified: true },
  });
  await db.vendorApplication.updateMany({
    where: { vendorProfileId: vendorId },
    data: { status: "APPROVED", reviewedAt: new Date() },
  });
  revalidatePath("/admin/vendors");
}

export async function suspendVendor(vendorId: string) {
  await requireAdmin();
  await db.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "SUSPENDED" },
  });
  await db.vendorApplication.updateMany({
    where: { vendorProfileId: vendorId },
    data: { status: "SUSPENDED", reviewedAt: new Date() },
  });
  revalidatePath("/admin/vendors");
}

export async function rejectVendor(vendorId: string) {
  await requireAdmin();
  await db.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "REJECTED" },
  });
  await db.vendorApplication.updateMany({
    where: { vendorProfileId: vendorId },
    data: { status: "REJECTED", reviewedAt: new Date() },
  });
  revalidatePath("/admin/vendors");
}

// ─── PRODUCT ACTIONS ────────────────────────────────────

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await db.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
}

export async function toggleProductActive(productId: string) {
  await requireAdmin();
  const product = await db.product.findUniqueOrThrow({
    where: { id: productId },
  });
  await db.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });
  revalidatePath("/admin/products");
}

// ─── ORDER ACTIONS ──────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  await requireAdmin();
  const schema = z.object({
    orderId: z.string().min(1),
    status: z.enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ]),
  });
  const parsed = schema.parse({ orderId, status });

  await db.order.update({
    where: { id: parsed.orderId },
    data: { status: parsed.status },
  });
  revalidatePath("/admin/orders");
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  await requireAdmin();
  const schema = z.object({
    orderId: z.string().min(1),
    paymentStatus: z.enum(["UNPAID", "PENDING", "PAID", "FAILED", "REFUNDED"]),
  });
  const parsed = schema.parse({ orderId, paymentStatus });

  await db.order.update({
    where: { id: parsed.orderId },
    data: { paymentStatus: parsed.paymentStatus },
  });

  // Also update the payment record if it exists
  await db.payment.updateMany({
    where: { orderId: parsed.orderId },
    data: {
      status: parsed.paymentStatus,
      ...(parsed.paymentStatus === "PAID"
        ? { confirmedAt: new Date() }
        : {}),
    },
  });

  revalidatePath("/admin/orders");
}

// ─── CATEGORY ACTIONS ───────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  image: z.string().optional(),
});

export async function createCategory(data: z.infer<typeof categorySchema>) {
  await requireAdmin();
  const parsed = categorySchema.parse(data);
  const slug = parsed.slug || generateSlug(parsed.name);

  await db.category.create({
    data: {
      name: parsed.name,
      slug,
      description: parsed.description || null,
      parentId: parsed.parentId || null,
      image: parsed.image || null,
    },
  });
  revalidatePath("/admin/categories");
}

export async function updateCategory(
  id: string,
  data: z.infer<typeof categorySchema>
) {
  await requireAdmin();
  const parsed = categorySchema.parse(data);

  await db.category.update({
    where: { id },
    data: {
      name: parsed.name,
      slug: parsed.slug || generateSlug(parsed.name),
      description: parsed.description || null,
      parentId: parsed.parentId || null,
      image: parsed.image || null,
    },
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// ─── COUPON ACTIONS ─────────────────────────────────────

const couponSchema = z.object({
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().optional().nullable(),
  maxUses: z.coerce.number().int().optional().nullable(),
  startsAt: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export async function createCoupon(data: z.infer<typeof couponSchema>) {
  await requireAdmin();
  const parsed = couponSchema.parse(data);

  await db.coupon.create({
    data: {
      code: parsed.code.toUpperCase(),
      description: parsed.description || null,
      discountType: parsed.discountType,
      discountValue: parsed.discountValue,
      minOrderAmount: parsed.minOrderAmount ?? null,
      maxUses: parsed.maxUses ?? null,
      startsAt: parsed.startsAt ?? null,
      expiresAt: parsed.expiresAt ?? null,
    },
  });
  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(couponId: string) {
  await requireAdmin();
  const coupon = await db.coupon.findUniqueOrThrow({
    where: { id: couponId },
  });
  await db.coupon.update({
    where: { id: couponId },
    data: { isActive: !coupon.isActive },
  });
  revalidatePath("/admin/coupons");
}

// ─── BUY FOR ME ACTIONS ────────────────────────────────

export async function updateBuyForMeStatus(
  requestId: string,
  status: BuyForMeStatus
) {
  await requireAdmin();
  const schema = z.object({
    requestId: z.string().min(1),
    status: z.enum([
      "SUBMITTED",
      "UNDER_REVIEW",
      "QUOTED",
      "AWAITING_PAYMENT",
      "PAID",
      "ORDERED",
      "IN_TRANSIT",
      "ARRIVED",
      "DELIVERED",
      "CANCELLED",
    ]),
  });
  const parsed = schema.parse({ requestId, status });

  await db.buyForMeRequest.update({
    where: { id: parsed.requestId },
    data: { status: parsed.status },
  });
  revalidatePath("/admin/buy-for-me");
}

const quoteSchema = z.object({
  productCost: z.coerce.number().positive(),
  shippingCost: z.coerce.number().min(0),
  serviceFee: z.coerce.number().min(0),
  estimatedDays: z.coerce.number().int().positive(),
  notes: z.string().optional(),
});

export async function createBuyForMeQuote(
  requestId: string,
  data: z.infer<typeof quoteSchema>
) {
  await requireAdmin();
  const parsed = quoteSchema.parse(data);
  const totalCost = parsed.productCost + parsed.shippingCost + parsed.serviceFee;

  await db.buyForMeQuote.create({
    data: {
      requestId,
      productCost: parsed.productCost,
      shippingCost: parsed.shippingCost,
      serviceFee: parsed.serviceFee,
      totalCost,
      estimatedDays: parsed.estimatedDays,
      notes: parsed.notes || null,
    },
  });

  await db.buyForMeRequest.update({
    where: { id: requestId },
    data: { status: "QUOTED" },
  });

  revalidatePath("/admin/buy-for-me");
}

// ─── REVIEW ACTIONS ─────────────────────────────────────

export async function toggleReviewApproval(reviewId: string) {
  await requireAdmin();
  const review = await db.review.findUniqueOrThrow({
    where: { id: reviewId },
  });
  await db.review.update({
    where: { id: reviewId },
    data: { isApproved: !review.isApproved },
  });
  revalidatePath("/admin/reviews");
}

// ─── CMS ACTIONS ────────────────────────────────────────

export async function updateSiteContent(
  key: string,
  data: { title?: string; content: unknown; isActive?: boolean }
) {
  await requireAdmin();
  await db.siteContent.upsert({
    where: { key },
    update: {
      title: data.title,
      content: data.content as object,
      isActive: data.isActive ?? true,
    },
    create: {
      key,
      title: data.title,
      content: data.content as object,
      isActive: data.isActive ?? true,
    },
  });
  revalidatePath("/admin/cms");
}

// Banner actions
const bannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1),
  linkUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function createBanner(data: z.infer<typeof bannerSchema>) {
  await requireAdmin();
  const parsed = bannerSchema.parse(data);
  await db.banner.create({ data: parsed });
  revalidatePath("/admin/cms");
}

export async function updateBanner(
  id: string,
  data: z.infer<typeof bannerSchema>
) {
  await requireAdmin();
  const parsed = bannerSchema.parse(data);
  await db.banner.update({ where: { id }, data: parsed });
  revalidatePath("/admin/cms");
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  await db.banner.delete({ where: { id } });
  revalidatePath("/admin/cms");
}

// FAQ actions
const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function createFAQ(data: z.infer<typeof faqSchema>) {
  await requireAdmin();
  const parsed = faqSchema.parse(data);
  await db.fAQ.create({
    data: {
      question: parsed.question,
      answer: parsed.answer,
      category: parsed.category || null,
      sortOrder: parsed.sortOrder,
      isActive: parsed.isActive,
    },
  });
  revalidatePath("/admin/cms");
}

export async function updateFAQ(id: string, data: z.infer<typeof faqSchema>) {
  await requireAdmin();
  const parsed = faqSchema.parse(data);
  await db.fAQ.update({
    where: { id },
    data: {
      question: parsed.question,
      answer: parsed.answer,
      category: parsed.category || null,
      sortOrder: parsed.sortOrder,
      isActive: parsed.isActive,
    },
  });
  revalidatePath("/admin/cms");
}

export async function deleteFAQ(id: string) {
  await requireAdmin();
  await db.fAQ.delete({ where: { id } });
  revalidatePath("/admin/cms");
}

// ─── DELIVERY ZONE ACTIONS ──────────────────────────────

const deliveryZoneSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  province: z.string().min(1),
  baseFee: z.coerce.number().min(0),
  expressFee: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
});

export async function createDeliveryZone(
  data: z.infer<typeof deliveryZoneSchema>
) {
  await requireAdmin();
  const parsed = deliveryZoneSchema.parse(data);
  await db.deliveryZone.create({
    data: {
      name: parsed.name,
      description: parsed.description || null,
      province: parsed.province,
      baseFee: parsed.baseFee,
      expressFee: parsed.expressFee,
      isActive: parsed.isActive,
    },
  });
  revalidatePath("/admin/delivery");
}

export async function updateDeliveryZone(
  id: string,
  data: z.infer<typeof deliveryZoneSchema>
) {
  await requireAdmin();
  const parsed = deliveryZoneSchema.parse(data);
  await db.deliveryZone.update({
    where: { id },
    data: {
      name: parsed.name,
      description: parsed.description || null,
      province: parsed.province,
      baseFee: parsed.baseFee,
      expressFee: parsed.expressFee,
      isActive: parsed.isActive,
    },
  });
  revalidatePath("/admin/delivery");
}

export async function deleteDeliveryZone(id: string) {
  await requireAdmin();
  await db.deliveryZone.delete({ where: { id } });
  revalidatePath("/admin/delivery");
}
