import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductActions } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Moderation - Admin",
};

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vendor: { select: { businessName: true } },
      category: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Product Moderation</h1>
        <p className="text-zinc-500 text-sm">
          Manage and moderate all products across vendors
        </p>
      </div>

      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-zinc-400">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {product.title}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {product.vendor.businessName}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {product.category.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(Number(product.price))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock > product.lowStockThreshold ? "default" : "destructive"}
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ProductActions
                      productId={product.id}
                      isActive={product.isActive}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
