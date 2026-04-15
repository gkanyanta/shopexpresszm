export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductForm } from "../../_components/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "VENDOR") {
    redirect("/auth/signin");
  }

  const vendorProfile = await db.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendorProfile) {
    redirect("/auth/signin");
  }

  const product = await db.product.findFirst({
    where: { id, vendorId: vendorProfile.id },
  });

  if (!product) {
    notFound();
  }

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const productData = {
    id: product.id,
    title: product.title,
    sku: product.sku,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() ?? null,
    stock: product.stock,
    brand: product.brand,
    categoryId: product.categoryId,
    isLocal: product.isLocal,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    weight: product.weight?.toString() ?? null,
    width: product.width?.toString() ?? null,
    height: product.height?.toString() ?? null,
    length: product.length?.toString() ?? null,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update your product details
        </p>
      </div>

      <ProductForm categories={categories} product={productData} />
    </div>
  );
}
