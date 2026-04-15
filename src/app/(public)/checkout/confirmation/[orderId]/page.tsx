import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
      },
      address: true,
      payment: true,
    },
  });

  if (!order || order.userId !== session.user.id) {
    redirect("/dashboard/orders");
  }

  const deliveryMethodLabels: Record<string, string> = {
    STANDARD: "Standard Delivery",
    EXPRESS: "Express Delivery",
    PICKUP: "Pickup",
    NATIONWIDE_COURIER: "Nationwide Courier",
  };

  const paymentMethodLabels: Record<string, string> = {
    CARD: "Card Payment",
    MOBILE_MONEY: "Mobile Money",
    BANK_TRANSFER: "Bank Transfer",
    MANUAL: "Manual Payment",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. We&apos;ve received it and will begin processing shortly.
        </p>
      </div>

      <div className="mt-8 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-lg font-semibold">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.product.images[0] && (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.title}
                  className="size-12 rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(Number(item.price))} x {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(Number(item.total))}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>
              {Number(order.deliveryFee) > 0
                ? formatPrice(Number(order.deliveryFee))
                : "Free"}
            </span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(Number(order.discount))}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Delivery Method</p>
            <p className="font-medium">
              {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium">
              {order.paymentMethod
                ? paymentMethodLabels[order.paymentMethod] || order.paymentMethod
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <Badge
              variant={
                order.paymentStatus === "PAID"
                  ? "default"
                  : order.paymentStatus === "PENDING"
                    ? "secondary"
                    : "destructive"
              }
            >
              {order.paymentStatus}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Delivery Address</p>
            <p className="text-sm">
              {order.address.address1}, {order.address.city}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/dashboard/orders">
          <Button>
            <Package className="mr-2 size-4" />
            View My Orders
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline">
            Continue Shopping
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
