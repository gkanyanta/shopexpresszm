import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Package, Heart, Globe, MapPin } from "lucide-react";
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function CustomerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const [orderCount, wishlistCount, buyForMeCount, addressCount] =
    await Promise.all([
      db.order.count({ where: { userId: session.user.id } }),
      db.wishlistItem.count({ where: { userId: session.user.id } }),
      db.buyForMeRequest.count({ where: { userId: session.user.id } }),
      db.address.count({ where: { userId: session.user.id } }),
    ]);

  const recentOrders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      items: {
        include: { product: { select: { title: true } } },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">
        Welcome back, {session.user.name?.split(" ")[0]}!
      </h1>
      <p className="text-zinc-500 text-sm mb-8">
        Manage your orders, wishlist, and account from here.
      </p>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <CustomerSidebar />

        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Orders", value: orderCount, icon: Package, href: "/dashboard/orders" },
              { label: "Wishlist", value: wishlistCount, icon: Heart, href: "/dashboard/wishlist" },
              { label: "Buy For Me", value: buyForMeCount, icon: Globe, href: "/dashboard/buy-for-me" },
              { label: "Addresses", value: addressCount, icon: MapPin, href: "/dashboard/addresses" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-zinc-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-zinc-900">Recent Orders</h2>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-zinc-400">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
                <Link
                  href="/shop"
                  className="text-amber-600 text-sm hover:underline mt-1 inline-block"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
