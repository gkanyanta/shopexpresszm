import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusForm, PaymentStatusButton } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Management - Admin",
};

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { quantity: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Order Management</h1>
        <p className="text-zinc-500 text-sm">
          View and manage all orders, update status and payments
        </p>
      </div>

      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-zinc-400">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {order.user.name || order.user.email}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(Number(order.total))}
                  </TableCell>
                  <TableCell>
                    <OrderStatusForm
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "PAID"
                          ? "default"
                          : order.paymentStatus === "FAILED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusButton
                      orderId={order.id}
                      paymentStatus={order.paymentStatus}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
