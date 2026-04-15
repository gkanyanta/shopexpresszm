"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  title: z.string().max(200, "Title too long").optional().or(z.literal("")),
  comment: z.string().max(2000, "Comment too long").optional().or(z.literal("")),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export async function createReview(productId: string, data: ReviewInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to leave a review." };
  }

  const validated = reviewSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { rating, title, comment } = validated.data;

  const existing = await db.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  if (existing) {
    return { error: "You have already reviewed this product." };
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { error: "Product not found." };
  }

  await db.review.create({
    data: {
      userId: session.user.id,
      productId,
      rating,
      title: title || null,
      comment: comment || null,
    },
  });

  revalidatePath(`/product/${product.slug}`);
  return { success: true };
}
