import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWishlistItems, toggleWishlist } from "@/actions/wishlist";
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar";
import { ProductCard } from "@/components/common/product-card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const items = await getWishlistItems(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">My Wishlist</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Products you&apos;ve saved for later.
      </p>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <CustomerSidebar />

        <div>
          {items.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Heart className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-zinc-900 mb-1">
                Your wishlist is empty
              </h2>
              <p className="text-sm text-zinc-500 mb-4">
                Browse our products and tap the heart icon to save items here.
              </p>
              <Link href="/shop">
                <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
                  <ShoppingBag className="h-4 w-4 mr-1.5" />
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-500 mb-4">
                {items.length} item{items.length !== 1 ? "s" : ""} saved
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="relative group/wishlist">
                    <ProductCard
                      product={{
                        id: item.product.id,
                        title: item.product.title,
                        slug: item.product.slug,
                        price: Number(item.product.price),
                        compareAtPrice: item.product.compareAtPrice
                          ? Number(item.product.compareAtPrice)
                          : null,
                        images: item.product.images,
                        category: item.product.category,
                        vendor: item.product.vendor,
                        isLocal: item.product.isLocal,
                        isFeatured: item.product.isFeatured,
                      }}
                    />
                    <form
                      action={async () => {
                        "use server";
                        await toggleWishlist(item.productId);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover/wishlist:opacity-100 transition-opacity rounded-full"
                        title="Remove from wishlist"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
