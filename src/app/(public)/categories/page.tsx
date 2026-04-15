import type { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import { Grid3X3, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all product categories on SHOP EXPRESS ZM.",
};

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
      children: {
        where: { isActive: true },
        include: {
          _count: { select: { products: { where: { isActive: true } } } },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
          Shop by Category
        </h1>
        <p className="text-zinc-600">
          Browse our wide selection of local and international products across
          all categories.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16">
          <Grid3X3 className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500">No categories available yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category) => {
            const totalProducts =
              category._count.products +
              category.children.reduce((sum, c) => sum + c._count.products, 0);

            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group bg-white rounded-xl border p-6 hover:shadow-lg hover:border-amber-200 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Package className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded-full">
                    {totalProducts} product{totalProducts !== 1 ? "s" : ""}
                  </span>
                </div>

                <h2 className="font-semibold text-zinc-900 group-hover:text-amber-600 transition-colors mb-1">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {category.children.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {category.children.slice(0, 4).map((child) => (
                      <span
                        key={child.id}
                        className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full"
                      >
                        {child.name}
                      </span>
                    ))}
                    {category.children.length > 4 && (
                      <span className="text-xs text-zinc-400 px-1">
                        +{category.children.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
