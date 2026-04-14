import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  ShoppingBasket,
  Briefcase,
  Car,
  Package,
} from "lucide-react";

const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
    slug: "electronics",
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Fashion",
    icon: Shirt,
    slug: "fashion",
    color: "bg-pink-50 text-pink-600",
  },
  {
    name: "Beauty",
    icon: Sparkles,
    slug: "beauty",
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "Home & Kitchen",
    icon: Home,
    slug: "home-kitchen",
    color: "bg-orange-50 text-orange-600",
  },
  {
    name: "Groceries",
    icon: ShoppingBasket,
    slug: "groceries-household",
    color: "bg-green-50 text-green-600",
  },
  {
    name: "Office Supplies",
    icon: Briefcase,
    slug: "office-supplies",
    color: "bg-slate-50 text-slate-600",
  },
  {
    name: "Automotive",
    icon: Car,
    slug: "automotive-accessories",
    color: "bg-red-50 text-red-600",
  },
  {
    name: "Imported Orders",
    icon: Package,
    slug: "imported-special-orders",
    color: "bg-amber-50 text-amber-600",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
            Shop by Category
          </h2>
          <p className="text-zinc-500 mt-2">
            Browse our wide range of products across popular categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className={`p-3 rounded-xl ${category.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-zinc-700 text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
