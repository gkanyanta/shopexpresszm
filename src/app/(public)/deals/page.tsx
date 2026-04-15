import type { Metadata } from "next";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { ProductCard } from "@/components/common/product-card";
import { Tag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Deals & Offers",
  description: `Current deals and discounted products on ${siteConfig.name}.`,
};

export default async function DealsPage() {
  const discountedProducts = await db.product.findMany({
    where: {
      isActive: true,
      compareAtPrice: { not: null },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: { select: { name: true } },
      vendor: { select: { businessName: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const featuredProducts = await db.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: { select: { name: true } },
      vendor: { select: { businessName: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 8,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          Deals &amp; <span className="text-amber-500">Offers</span>
        </h1>
        <p className="text-lg text-zinc-600">
          Save on your favourite products with our latest deals and discounts.
        </p>
      </div>

      {/* Discounted Products */}
      {discountedProducts.length > 0 ? (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold text-zinc-900">On Sale Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {discountedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  price: Number(product.price),
                  compareAtPrice: product.compareAtPrice
                    ? Number(product.compareAtPrice)
                    : null,
                  images: product.images,
                  category: product.category,
                  vendor: product.vendor,
                  isLocal: product.isLocal,
                  isFeatured: product.isFeatured,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 md:p-12 text-center mb-12">
          <div className="inline-flex p-3 bg-amber-100 rounded-full mb-4">
            <Tag className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">
            New Deals Coming Soon!
          </h2>
          <p className="text-zinc-600 max-w-lg mx-auto mb-4">
            We&apos;re preparing exciting offers for you. Check back soon or
            follow us on WhatsApp to be the first to know.
          </p>
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Get Deal Alerts on WhatsApp
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </a>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-zinc-900">Featured Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  price: Number(product.price),
                  compareAtPrice: product.compareAtPrice
                    ? Number(product.compareAtPrice)
                    : null,
                  images: product.images,
                  category: product.category,
                  vendor: product.vendor,
                  isLocal: product.isLocal,
                  isFeatured: product.isFeatured,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Browse All */}
      <div className="text-center">
        <Link href="/shop">
          <Button
            variant="outline"
            size="lg"
            className="border-zinc-300"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
