import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/common/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse products from local Zambian sellers and international sources. Electronics, fashion, beauty, home goods, and more.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    local?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 12;

  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { brand: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.local === "true") {
    where.isLocal = true;
  } else if (params.local === "false") {
    where.isLocal = false;
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice)
      (where.price as Record<string, unknown>).gte = parseFloat(params.minPrice);
    if (params.maxPrice)
      (where.price as Record<string, unknown>).lte = parseFloat(params.maxPrice);
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { price: "asc" };
  else if (params.sort === "price-desc") orderBy = { price: "desc" };
  else if (params.sort === "newest") orderBy = { createdAt: "desc" };
  else if (params.sort === "popular") orderBy = { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        category: { select: { name: true } },
        vendor: { select: { businessName: true } },
        reviews: { select: { rating: true } },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  const productsWithRating = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images,
    category: p.category,
    vendor: p.vendor,
    isLocal: p.isLocal,
    isFeatured: p.isFeatured,
    rating:
      p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : undefined,
    reviewCount: p.reviews.length || undefined,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Shop</h1>
        <p className="text-zinc-500 mt-1">
          {total} product{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <ShopFilters categories={categories} currentParams={params} />

        <div>
          {productsWithRating.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-400 text-lg">No products found</p>
              <p className="text-zinc-400 text-sm mt-1">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {productsWithRating.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <a
                        key={p}
                        href={`/shop?${new URLSearchParams({ ...params, page: p.toString() }).toString()}`}
                        className={`px-3 py-1.5 rounded text-sm ${
                          p === page
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                        }`}
                      >
                        {p}
                      </a>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
