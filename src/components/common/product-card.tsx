"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number | string;
    compareAtPrice?: number | string | null;
    images: { url: string; alt?: string | null }[];
    category?: { name: string } | null;
    vendor?: { businessName: string } | null;
    isLocal: boolean;
    isFeatured: boolean;
    rating?: number;
    reviewCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;
  const compareAt = product.compareAtPrice
    ? typeof product.compareAtPrice === "string"
      ? parseFloat(product.compareAtPrice)
      : product.compareAtPrice
    : null;
  const discount =
    compareAt && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;

  const imageUrl = product.images?.[0]?.url || "/placeholder-product.svg";

  return (
    <div className="group relative bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-zinc-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-zinc-300">
          <ShoppingCart className="h-12 w-12" />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs">
              -{discount}%
            </Badge>
          )}
          {!product.isLocal && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 text-xs"
            >
              International
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-zinc-900 text-xs">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-3">
        {product.category && (
          <p className="text-xs text-zinc-400 mb-1">{product.category.name}</p>
        )}

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-zinc-900 line-clamp-2 hover:text-amber-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {product.vendor && (
          <p className="text-xs text-zinc-400 mt-1">
            by {product.vendor.businessName}
          </p>
        )}

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-zinc-600">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount !== undefined && (
              <span className="text-xs text-zinc-400">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-bold text-zinc-900">
            {formatPrice(price)}
          </span>
          {compareAt && compareAt > price && (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="w-full mt-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
