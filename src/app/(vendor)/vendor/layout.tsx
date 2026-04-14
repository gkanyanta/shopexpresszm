"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/products", label: "Products", icon: Package },
  { href: "/vendor/orders", label: "Orders", icon: ShoppingCart },
  { href: "/vendor/store", label: "My Store", icon: Store },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-zinc-900 text-white min-h-screen p-4 hidden lg:block">
        <div className="mb-8">
          <Link href="/vendor/dashboard" className="block">
            <span className="text-lg font-bold">
              SHOP EXPRESS <span className="text-amber-400">ZM</span>
            </span>
            <p className="text-xs text-zinc-400 mt-0.5">Vendor Portal</p>
          </Link>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 font-medium"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-zinc-50">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
