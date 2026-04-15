import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductForm } from "../_components/product-form";

export default async function NewProductPage() {
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

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create a new product listing for your store
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
