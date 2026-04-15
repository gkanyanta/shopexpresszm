"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getOrderDetails, cancelOrder } from "@/actions/orders";
import { formatPrice, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Loader2,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  Ban,
} from "lucide-react";

export const dynamic = "force-dynamic";

type OrderData = NonNullable<Awaited<ReturnType<typeof getOrderDetails>>["order"]>;

const ORDER_STATUSES = [
  { key: "PENDING", label: "Pending", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

const paymentMethodLabels: Record<string, string> = {
  CARD: "Card Payment",
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Bank Transfer",
  MANUAL: "Manual Payment",
};

const deliveryMethodLabels: Record<string, string> = {
  STANDARD: "Standard Delivery",
  EXPRESS: "Express Delivery",
  PICKUP: "Pickup",
  NATIONWIDE_COURIER: "Nationwide Courier",
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: authStatus } = useSession();
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard/orders");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === "authenticated" && params.id) {
      loadOrder();
    }
  }, [authStatus, params.id]);

  async function loadOrder() {
    const result = await getOrderDetails(params.id as string);
    if (result.error) {
      setError(result.error);
    } else if (result.order) {
      setOrder(result.order as OrderData);
    }
  }

  async function handleCancel() {
    setCancelError("");
    startTransition(async () => {
      const result = await cancelOrder(params.id as string);
      if (result.error) {
        setCancelError(result.error);
      } else {
        setShowCancelConfirm(false);
        await loadOrder();
      }
    });
  }

  if (authStatus === "loading" || (!order && !error)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-8 text-center">
          <XCircle className="mx-auto mb-2 size-8 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Link href="/dashboard/orders" className="mt-4 inline-block">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const isCancelled = order.status === "CANCELLED";
  const isRefunded = order.status === "REFUNDED";
  const currentStatusIndex = ORDER_STATUSES.findIndex((s) => s.key === order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 size-4" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={statusColors[order.status] || "secondary"} className="text-sm">
          {order.status}
        </Badge>
      </div>

      {/* Status Timeline */}
      {!isCancelled && !isRefunded && (
        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">Order Status</h2>
          <div className="flex items-center justify-between">
            {ORDER_STATUSES.map((s, i) => {
              const isActive = i <= currentStatusIndex;
              const isCurrent = i === currentStatusIndex;
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        isActive ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < ORDER_STATUSES.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
                        i < currentStatusIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="mb-8 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
          <Ban className="mx-auto mb-2 size-8 text-destructive" />
          <p className="font-medium text-destructive">This order has been cancelled</p>
        </div>
      )}

      {/* Tracking Events */}
      {order.tracking && order.tracking.length > 0 && (
        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">Tracking History</h2>
          <div className="space-y-3">
            {order.tracking.map((event, i) => (
              <div key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-3 rounded-full ${
                      i === order.tracking.length - 1 ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  {i < order.tracking.length - 1 && (
                    <div className="h-full w-px bg-muted-foreground/20" />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium">{event.status}</p>
                  {event.location && (
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  )}
                  {event.notes && (
                    <p className="text-xs text-muted-foreground">{event.notes}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(event.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              {item.product.images[0] && (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.title}
                  className="size-16 rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.product.title}
                </Link>
                {item.product.vendor && (
                  <p className="text-xs text-muted-foreground">
                    by {item.product.vendor.businessName}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {formatPrice(Number(item.price))} x {item.quantity}
                </p>
              </div>
              <p className="font-medium">{formatPrice(Number(item.total))}</p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

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
      </div>

      {/* Details Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        {/* Delivery Info */}
        <div className="rounded-lg border p-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground">Delivery</h2>
          </div>
          <p className="font-medium">
            {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
          </p>
          <Separator className="my-3" />
          <p className="text-sm font-medium">
            {order.address.firstName} {order.address.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{order.address.address1}</p>
          {order.address.address2 && (
            <p className="text-sm text-muted-foreground">{order.address.address2}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {order.address.city}, {order.address.province}
          </p>
          <p className="text-sm text-muted-foreground">{order.address.phone}</p>
        </div>

        {/* Payment Info */}
        <div className="rounded-lg border p-6">
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground">Payment</h2>
          </div>
          <p className="font-medium">
            {order.paymentMethod
              ? paymentMethodLabels[order.paymentMethod] || order.paymentMethod
              : "N/A"}
          </p>
          <div className="mt-2">
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
          {order.payment?.transactionId && (
            <p className="mt-3 text-xs text-muted-foreground">
              Transaction: {order.payment.transactionId}
            </p>
          )}
          {order.coupon && (
            <>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">
                Coupon: <span className="font-medium">{order.coupon.code}</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Cancel Button */}
      {order.status === "PENDING" && (
        <div className="rounded-lg border p-6">
          {showCancelConfirm ? (
            <div className="space-y-4">
              <p className="text-sm">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              {cancelError && (
                <p className="text-sm text-destructive">{cancelError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
                  Yes, Cancel Order
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isPending}
                >
                  Keep Order
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              onClick={() => setShowCancelConfirm(true)}
            >
              <Ban className="mr-2 size-4" />
              Cancel Order
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
