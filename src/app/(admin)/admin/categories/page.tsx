import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryForm, CategoryDeleteButton } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Category Management - Admin",
};

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } },
    },
  });

  const parentOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Category Management
        </h1>
        <p className="text-zinc-500 text-sm">
          Create, edit, and organize product categories
        </p>
      </div>

      {/* Create Category Form */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Create New Category
        </h2>
        <CategoryForm parentOptions={parentOptions} />
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-zinc-400"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-zinc-500 font-mono text-xs">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {category.parent?.name || "-"}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {category._count.products}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CategoryDeleteButton
                      categoryId={category.id}
                      productCount={category._count.products}
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
