"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  FolderTree,
  Globe,
  Truck,
  Ticket,
  FileText,
  Star,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/vendors", label: "Vendors", icon: Store },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/buy-for-me", label: "Buy For Me", icon: Globe },
  { href: "/admin/delivery", label: "Delivery Zones", icon: Truck },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/cms", label: "CMS / Content", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 text-white min-h-screen p-4 hidden lg:block">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="block">
          <span className="text-lg font-bold">
            SHOP EXPRESS <span className="text-amber-400">ZM</span>
          </span>
          <p className="text-xs text-zinc-400 mt-0.5">Admin Dashboard</p>
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
  );
}
