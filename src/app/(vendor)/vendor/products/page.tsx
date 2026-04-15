export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { deleteProduct, toggleProductStatus } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default async function VendorProductsPage() {
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

  const products = await db.product.findMany({
    where: { vendorId: vendorProfile.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your product listings
          </p>
        </div>
        <Link href="/vendor/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground mb-4">
            You have not added any products yet.
          </p>
          <Link href="/vendor/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {product.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.category.name}
                  </TableCell>
                  <TableCell>{formatPrice(product.price.toString())}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.stock}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <form
                        action={async () => {
                          "use server";
                          await toggleProductStatus(product.id);
                        }}
                      >
                        <Button variant="ghost" size="icon" type="submit">
                          {product.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </form>
                      <Link href={`/vendor/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
