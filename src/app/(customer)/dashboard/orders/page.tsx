import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCustomerOrders } from "@/actions/orders";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Eye, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

const paymentStatusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UNPAID: "destructive",
  PENDING: "secondary",
  PAID: "default",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export default async function CustomerOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard/orders");
  }

  const { orders, error } = await getCustomerOrders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your orders
          </p>
        </div>
        <Link href="/shop">
          <Button variant="outline">
            <ShoppingBag className="mr-2 size-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {orders && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Package className="mb-4 size-12 text-muted-foreground" />
          <h2 className="text-lg font-medium">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your order history will appear here once you make a purchase.
          </p>
          <Link href="/shop" className="mt-4">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(Number(order.total))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.status] || "secondary"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={paymentStatusColors[order.paymentStatus] || "secondary"}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-1 size-4" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
