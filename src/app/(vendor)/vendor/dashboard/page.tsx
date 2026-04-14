import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendor Dashboard",
};

export default async function VendorDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const vendor = await db.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">
          Vendor Profile Not Found
        </h1>
        <p className="text-zinc-500 mb-6">
          Your vendor profile is still being set up or pending approval.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (vendor.status !== "APPROVED") {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">
          Application {vendor.status.toLowerCase()}
        </h1>
        <p className="text-zinc-500 mb-6">
          {vendor.status === "PENDING"
            ? "Your vendor application is under review. We'll notify you once approved."
            : "Your vendor application has been " +
              vendor.status.toLowerCase() +
              ". Please contact support."}
        </p>
      </div>
    );
  }

  const [productCount, orderItemCount, reviewCount] = await Promise.all([
    db.product.count({ where: { vendorId: vendor.id } }),
    db.orderItem.count({
      where: { product: { vendorId: vendor.id } },
    }),
    db.review.count({
      where: { product: { vendorId: vendor.id }, isApproved: true },
    }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {vendor.businessName}
          </h1>
          <p className="text-zinc-500 text-sm">Vendor Dashboard</p>
        </div>
        <Link href="/vendor/products/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Products", value: productCount, icon: Package },
          { label: "Orders", value: orderItemCount, icon: ShoppingCart },
          { label: "Reviews", value: reviewCount, icon: Star },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Icon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Your Products</h2>
          <Link href="/vendor/products">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <ProductList vendorId={vendor.id} />
      </div>
    </div>
  );
}

async function ProductList({ vendorId }: { vendorId: string }) {
  const products = await db.product.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: { select: { name: true } } },
  });

  if (products.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No products yet</p>
        <Link
          href="/vendor/products/new"
          className="text-amber-600 text-sm hover:underline mt-1 inline-block"
        >
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {products.map((product) => (
        <div key={product.id} className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900">{product.title}</p>
            <p className="text-xs text-zinc-500">
              {product.category?.name} &bull; Stock: {product.stock}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">
              {formatPrice(Number(product.price))}
            </p>
            <span
              className={`text-xs ${product.isActive ? "text-green-600" : "text-red-600"}`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
