"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const existing = await db.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard/wishlist");
    return { success: true, action: "removed" as const };
  }

  await db.wishlistItem.create({
    data: {
      userId: session.user.id,
      productId,
    },
  });

  revalidatePath("/dashboard/wishlist");
  return { success: true, action: "added" as const };
}

export async function getWishlistItems(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return [];
  }

  return db.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { name: true } },
          vendor: { select: { businessName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
