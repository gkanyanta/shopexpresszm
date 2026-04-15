"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/format";
import { productSchema } from "@/lib/validations/product";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getVendorProfile() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "VENDOR") {
    return null;
  }

  const vendorProfile = await db.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  return vendorProfile;
}

async function verifyProductOwnership(productId: string) {
  const vendorProfile = await getVendorProfile();
  if (!vendorProfile) return null;

  const product = await db.product.findFirst({
    where: { id: productId, vendorId: vendorProfile.id },
  });

  if (!product) return null;
  return { product, vendorProfile };
}

export async function createProduct(formData: FormData) {
  const vendorProfile = await getVendorProfile();
  if (!vendorProfile) {
    return { error: "Unauthorized. Vendor profile not found." };
  }

  const rawData = {
    title: formData.get("title") as string,
    sku: (formData.get("sku") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    shortDescription: (formData.get("shortDescription") as string) || undefined,
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    stock: formData.get("stock"),
    brand: (formData.get("brand") as string) || undefined,
    categoryId: formData.get("categoryId") as string,
    isLocal: formData.get("isLocal") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
    weight: formData.get("weight") || undefined,
    width: formData.get("width") || undefined,
    height: formData.get("height") || undefined,
    length: formData.get("length") || undefined,
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { title, sku, description, shortDescription, price, stock, brand, categoryId, isLocal, isFeatured, isActive } = validated.data;

  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  while (await db.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const compareAtPrice = validated.data.compareAtPrice;
  const weight = validated.data.weight;
  const width = validated.data.width;
  const height = validated.data.height;
  const length = validated.data.length;

  await db.product.create({
    data: {
      title,
      slug,
      sku: sku || null,
      description: description || null,
      shortDescription: shortDescription || null,
      price,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      stock,
      brand: brand || null,
      categoryId,
      vendorId: vendorProfile.id,
      isLocal,
      isFeatured,
      isActive,
      weight: weight ? Number(weight) : null,
      width: width ? Number(width) : null,
      height: height  ? Number(height) : null,
      length: length  ? Number(length) : null,
    },
  });

  revalidatePath("/vendor/products");
  redirect("/vendor/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const ownership = await verifyProductOwnership(id);
  if (!ownership) {
    return { error: "Unauthorized or product not found." };
  }

  const rawData = {
    title: formData.get("title") as string,
    sku: (formData.get("sku") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    shortDescription: (formData.get("shortDescription") as string) || undefined,
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    stock: formData.get("stock"),
    brand: (formData.get("brand") as string) || undefined,
    categoryId: formData.get("categoryId") as string,
    isLocal: formData.get("isLocal") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
    weight: formData.get("weight") || undefined,
    width: formData.get("width") || undefined,
    height: formData.get("height") || undefined,
    length: formData.get("length") || undefined,
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { title, sku, description, shortDescription, price, stock, brand, categoryId, isLocal, isFeatured, isActive } = validated.data;

  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  const existingSlug = await db.product.findUnique({ where: { slug } });
  if (existingSlug && existingSlug.id !== id) {
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const compareAtPrice = validated.data.compareAtPrice;
  const weight = validated.data.weight;
  const width = validated.data.width;
  const height = validated.data.height;
  const length = validated.data.length;

  await db.product.update({
    where: { id },
    data: {
      title,
      slug,
      sku: sku || null,
      description: description || null,
      shortDescription: shortDescription || null,
      price,
      compareAtPrice: compareAtPrice  ? Number(compareAtPrice) : null,
      stock,
      brand: brand || null,
      categoryId,
      isLocal,
      isFeatured,
      isActive,
      weight: weight  ? Number(weight) : null,
      width: width  ? Number(width) : null,
      height: height  ? Number(height) : null,
      length: length  ? Number(length) : null,
    },
  });

  revalidatePath("/vendor/products");
  redirect("/vendor/products");
}

export async function deleteProduct(id: string) {
  const ownership = await verifyProductOwnership(id);
  if (!ownership) {
    return { error: "Unauthorized or product not found." };
  }

  await db.product.delete({ where: { id } });

  revalidatePath("/vendor/products");
  return { success: true };
}

export async function toggleProductStatus(id: string) {
  const ownership = await verifyProductOwnership(id);
  if (!ownership) {
    return { error: "Unauthorized or product not found." };
  }

  await db.product.update({
    where: { id },
    data: { isActive: !ownership.product.isActive },
  });

  revalidatePath("/vendor/products");
  return { success: true };
}
