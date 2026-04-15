"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Package,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { useSession, signOut } from "next-auth/react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "Buy For Me", href: "/buy-for-me" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);

  const dashboardLink =
    session?.user?.role === "ADMIN"
      ? "/admin/dashboard"
      : session?.user?.role === "VENDOR"
        ? "/vendor/dashboard"
        : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      {/* Top Bar */}
      <div className="bg-zinc-900 text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="hidden sm:block">
            Powered by Inland Express Zambia &bull; Gardenia Road, Avondale,
            Lusaka
          </p>
          <p className="sm:hidden">Powered by Inland Express Zambia</p>
          <div className="flex items-center gap-4">
            <Link
              href="/track-order"
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              <Package className="h-3 w-3" />
              Track Order
            </Link>
            <Link
              href="/buy-for-me"
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              <Globe className="h-3 w-3" />
              Buy From Abroad
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xl font-bold text-zinc-900"
                >
                  <Image
                    src={siteConfig.logo}
                    alt={siteConfig.name}
                    width={36}
                    height={36}
                    className="rounded"
                  />
                  {siteConfig.name}
                </Link>
                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/sell-with-us"
                    className="px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                  >
                    Sell With Us
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={40}
              height={40}
              className="rounded"
            />
            <span className="hidden sm:block text-lg font-bold text-zinc-900">
              Shop Express
              <span className="text-amber-500"> Zambia</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-amber-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/sell-with-us"
              className="px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Sell With Us
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href={dashboardLink} className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/orders" className="w-full">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/wishlist" className="w-full">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-600"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-zinc-900 hover:bg-zinc-800"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="search"
                placeholder="Search products, categories, vendors..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
