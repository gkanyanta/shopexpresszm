"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  Package,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/common/product-card";
import { formatPrice, formatDate } from "@/lib/format";

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string | null;
    description: string | null;
    shortDescription: string | null;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    brand: string | null;
    isLocal: boolean;
    isFeatured: boolean;
    weight: number | null;
    width: number | null;
    height: number | null;
    length: number | null;
    costPrice: number | null;
    images: { id: string; url: string; alt: string | null }[];
    category: { id: string; name: string; slug: string } | null;
    vendor: {
      id: string;
      businessName: string;
      slug: string;
      isVerified: boolean;
    } | null;
    reviews: {
      id: string;
      rating: number;
      title: string | null;
      comment: string | null;
      createdAt: Date;
      user: { name: string | null; image: string | null };
    }[];
  };
  avgRating: number;
  relatedProducts: {
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt: string | null }[];
    category: { name: string } | null;
    vendor: { businessName: string } | null;
    isLocal: boolean;
    isFeatured: boolean;
  }[];
}

export function ProductDetails({
  product,
  avgRating,
  relatedProducts,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-700">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-zinc-700">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-zinc-700"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-900 truncate">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-zinc-100 rounded-xl flex items-center justify-center">
          <ShoppingCart className="h-24 w-24 text-zinc-300" />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {!product.isLocal && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                International
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-amber-500 text-zinc-900">Featured</Badge>
            )}
            {discount && (
              <Badge className="bg-red-500 text-white">-{discount}%</Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
            {product.title}
          </h1>

          {product.vendor && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-zinc-500">Sold by</span>
              <Link
                href={`/vendor/store/${product.vendor.slug}`}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                {product.vendor.businessName}
              </Link>
              {product.vendor.isVerified && (
                <BadgeCheck className="h-4 w-4 text-blue-500" />
              )}
            </div>
          )}

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-zinc-400">
                ({product.reviews.length} review
                {product.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-zinc-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <span className="text-lg text-zinc-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
          </div>

          {product.shortDescription && (
            <p className="text-zinc-600 mb-6">{product.shortDescription}</p>
          )}

          <Separator className="mb-6" />

          {/* Stock */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-zinc-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-2 hover:bg-zinc-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                size="lg"
                className="flex-1 bg-zinc-900 hover:bg-zinc-800"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button variant="outline" size="icon" className="shrink-0">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Trust indicators */}
          <div className="space-y-3 bg-zinc-50 rounded-lg p-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-4 w-4 text-amber-600" />
              <span>Delivery across Zambia from K35</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-amber-600" />
              <span>Secure payment with card or mobile money</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Package className="h-4 w-4 text-amber-600" />
              <span>Returns accepted within 7 days</span>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 text-sm text-zinc-500 space-y-1">
            {product.sku && <p>SKU: {product.sku}</p>}
            {product.brand && <p>Brand: {product.brand}</p>}
            {product.category && <p>Category: {product.category.name}</p>}
          </div>
        </div>
      </div>

      {/* Tabs: Description, Reviews */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose prose-zinc max-w-none">
            <p className="whitespace-pre-wrap">
              {product.description || "No description available."}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          {product.reviews.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {review.user.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-medium text-sm mb-1">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-zinc-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
