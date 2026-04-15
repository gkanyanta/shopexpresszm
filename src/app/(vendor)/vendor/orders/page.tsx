export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function VendorOrdersPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "VENDOR") {
    redirect("/auth/signin");
  }

  const vendorProfile = await db.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendorProfile) {
    redirect("/auth/signin");
  }

  // Find all orders that contain products from this vendor
  const orderItems = await db.orderItem.findMany({
    where: {
      product: {
        vendorId: vendorProfile.id,
      },
    },
    include: {
      order: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
      product: {
        select: { title: true },
      },
    },
    orderBy: {
      order: {
        createdAt: "desc",
      },
    },
  });

  // Group order items by order
  const ordersMap = new Map<
    string,
    {
      order: typeof orderItems[0]["order"];
      items: { title: string; quantity: number; price: string; total: string }[];
      vendorTotal: number;
    }
  >();

  for (const item of orderItems) {
    const existing = ordersMap.get(item.orderId);
    const itemData = {
      title: item.product.title,
      quantity: item.quantity,
      price: item.price.toString(),
      total: item.total.toString(),
    };

    if (existing) {
      existing.items.push(itemData);
      existing.vendorTotal += Number(item.total);
    } else {
      ordersMap.set(item.orderId, {
        order: item.order,
        items: [itemData],
        vendorTotal: Number(item.total),
      });
    }
  }

  const orders = Array.from(ordersMap.values());

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Orders containing your products
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Your Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(({ order, items, vendorTotal }) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p className="font-medium text-sm">
                        {order.user.name ?? "Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {items.map((item, idx) => (
                        <p key={idx} className="text-sm">
                          {item.title}{" "}
                          <span className="text-muted-foreground">
                            x{item.quantity}
                          </span>
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(vendorTotal)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status] ?? "outline"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
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
