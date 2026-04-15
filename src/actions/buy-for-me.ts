"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buyForMeRequestSchema, type BuyForMeRequestInput } from "@/lib/validations/buy-for-me";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitBuyForMeRequest(data: BuyForMeRequestInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to submit a request." };
  }

  const validated = buyForMeRequestSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { productUrl, productName, productDescription, sourceCountry, quantity } = validated.data;

  await db.buyForMeRequest.create({
    data: {
      userId: session.user.id,
      productUrl: productUrl || null,
      productName,
      productDescription: productDescription || null,
      sourceCountry,
      quantity,
    },
  });

  revalidatePath("/dashboard/buy-for-me");
  redirect("/dashboard/buy-for-me");
}

export async function acceptQuote(quoteId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const quote = await db.buyForMeQuote.findUnique({
    where: { id: quoteId },
    include: { request: true },
  });

  if (!quote) {
    return { error: "Quote not found." };
  }

  if (quote.request.userId !== session.user.id) {
    return { error: "Unauthorized." };
  }

  if (quote.isAccepted) {
    return { error: "This quote has already been accepted." };
  }

  await db.$transaction([
    db.buyForMeQuote.update({
      where: { id: quoteId },
      data: { isAccepted: true, acceptedAt: new Date() },
    }),
    db.buyForMeRequest.update({
      where: { id: quote.requestId },
      data: { status: "AWAITING_PAYMENT" },
    }),
  ]);

  revalidatePath("/dashboard/buy-for-me");
  return { success: true };
}

export async function getMyRequests(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return [];
  }

  return db.buyForMeRequest.findMany({
    where: { userId },
    include: {
      quotes: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
