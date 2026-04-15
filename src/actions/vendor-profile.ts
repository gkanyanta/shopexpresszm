"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const vendorProfileSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
});

export async function updateVendorProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "VENDOR") {
    return { error: "Unauthorized" };
  }

  const vendorProfile = await db.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendorProfile) {
    return { error: "Vendor profile not found" };
  }

  const rawData = {
    businessName: formData.get("businessName") as string,
    description: (formData.get("description") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    city: (formData.get("city") as string) || undefined,
  };

  const validated = vendorProfileSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { businessName, description, phone, email, address, city } =
    validated.data;

  await db.vendorProfile.update({
    where: { id: vendorProfile.id },
    data: {
      businessName,
      description: description || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      city: city || null,
    },
  });

  revalidatePath("/vendor/store");
  return { success: true };
}
