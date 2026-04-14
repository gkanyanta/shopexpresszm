import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/common/product-card";

// Demo data - will be replaced with DB queries
const demoProducts = [
  {
    id: "1",
    title: "Samsung Galaxy A15 - 128GB Dual SIM",
    slug: "samsung-galaxy-a15-128gb",
    price: 3200,
    compareAtPrice: 3800,
    images: [{ url: "/placeholder-product.svg", alt: "Samsung Galaxy A15" }],
    category: { name: "Electronics" },
    vendor: { businessName: "TechZone Lusaka" },
    isLocal: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 23,
  },
  {
    id: "2",
    title: "Ankara Print Maxi Dress - Zambian Design",
    slug: "ankara-print-maxi-dress",
    price: 450,
    compareAtPrice: 600,
    images: [{ url: "/placeholder-product.svg", alt: "Ankara Dress" }],
    category: { name: "Fashion" },
    vendor: { businessName: "Zed Fashion Hub" },
    isLocal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 45,
  },
  {
    id: "3",
    title: "Portable Bluetooth Speaker - JBL Flip 6",
    slug: "jbl-flip-6-bluetooth-speaker",
    price: 1850,
    compareAtPrice: null,
    images: [{ url: "/placeholder-product.svg", alt: "JBL Flip 6" }],
    category: { name: "Electronics" },
    vendor: { businessName: "SoundWorld ZM" },
    isLocal: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 12,
  },
  {
    id: "4",
    title: "Organic Shea Butter Body Cream - 500ml",
    slug: "organic-shea-butter-cream",
    price: 120,
    compareAtPrice: 180,
    images: [{ url: "/placeholder-product.svg", alt: "Shea Butter Cream" }],
    category: { name: "Beauty" },
    vendor: { businessName: "Natural Glow ZM" },
    isLocal: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 67,
  },
  {
    id: "5",
    title: "Non-Stick Cookware Set - 10 Piece",
    slug: "non-stick-cookware-set-10pc",
    price: 890,
    compareAtPrice: 1200,
    images: [{ url: "/placeholder-product.svg", alt: "Cookware Set" }],
    category: { name: "Home & Kitchen" },
    vendor: { businessName: "HomeStyle Zambia" },
    isLocal: true,
    isFeatured: false,
    rating: 4.3,
    reviewCount: 31,
  },
  {
    id: "6",
    title: "Apple AirPods Pro (2nd Generation)",
    slug: "apple-airpods-pro-2nd-gen",
    price: 4500,
    compareAtPrice: 5200,
    images: [{ url: "/placeholder-product.svg", alt: "AirPods Pro" }],
    category: { name: "Electronics" },
    vendor: { businessName: "TechZone Lusaka" },
    isLocal: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 8,
  },
  {
    id: "7",
    title: "Office Executive Chair - Ergonomic",
    slug: "office-executive-chair-ergonomic",
    price: 2800,
    compareAtPrice: null,
    images: [{ url: "/placeholder-product.svg", alt: "Office Chair" }],
    category: { name: "Office Supplies" },
    vendor: { businessName: "OfficeMart ZM" },
    isLocal: true,
    isFeatured: false,
    rating: 4.4,
    reviewCount: 19,
  },
  {
    id: "8",
    title: "Chitenge Fabric Bundle - 6 Yards Premium",
    slug: "chitenge-fabric-bundle-6yards",
    price: 350,
    compareAtPrice: 450,
    images: [{ url: "/placeholder-product.svg", alt: "Chitenge Fabric" }],
    category: { name: "Fashion" },
    vendor: { businessName: "Zed Fashion Hub" },
    isLocal: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 89,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-12 md:py-16 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
              Featured Products
            </h2>
            <p className="text-zinc-500 mt-1">
              Hand-picked selections from top local and international sellers
            </p>
          </div>
          <Link href="/shop" className="hidden sm:block">
            <Button variant="ghost" className="text-amber-600 hover:text-amber-700">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {demoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop">
            <Button variant="outline" className="w-full">
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
