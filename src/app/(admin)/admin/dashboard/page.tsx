import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  Globe,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [
    userCount,
    vendorCount,
    productCount,
    orderCount,
    buyForMeCount,
    pendingVendors,
    pendingBuyForMe,
    recentOrders,
  ] = await Promise.all([
    db.user.count(),
    db.vendorProfile.count({ where: { status: "APPROVED" } }),
    db.product.count({ where: { isActive: true } }),
    db.order.count(),
    db.buyForMeRequest.count(),
    db.vendorProfile.count({ where: { status: "PENDING" } }),
    db.buyForMeRequest.count({ where: { status: "SUBMITTED" } }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Active Vendors", value: vendorCount, icon: Store, color: "bg-green-50 text-green-600" },
    { label: "Products", value: productCount, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "Orders", value: orderCount, icon: ShoppingCart, color: "bg-amber-50 text-amber-600" },
    { label: "Buy For Me", value: buyForMeCount, icon: Globe, color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
        <p className="text-zinc-500 text-sm">
          Overview of your marketplace performance
        </p>
      </div>

      {/* Alerts */}
      {(pendingVendors > 0 || pendingBuyForMe > 0) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {pendingVendors > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4" />
              {pendingVendors} vendor application{pendingVendors !== 1 ? "s" : ""} pending review
            </div>
          )}
          {pendingBuyForMe > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm">
              <Globe className="h-4 w-4" />
              {pendingBuyForMe} Buy For Me request{pendingBuyForMe !== 1 ? "s" : ""} to review
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50">
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">
                    Items
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatus === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
