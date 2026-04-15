"use client";

import { useState, useTransition } from "react";
import { trackOrderByNumber } from "@/actions/orders";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

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

const deliveryMethodLabels: Record<string, string> = {
  STANDARD: "Standard Delivery",
  EXPRESS: "Express Delivery",
  PICKUP: "Pickup",
  NATIONWIDE_COURIER: "Nationwide Courier",
};

type TrackingOrder = NonNullable<
  Awaited<ReturnType<typeof trackOrderByNumber>>["order"]
>;

export default function TrackOrderPage() {
  const [isPending, startTransition] = useTransition();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!orderNumber.trim()) return;

    setError("");
    setOrder(null);
    setSearched(true);

    startTransition(async () => {
      const result = await trackOrderByNumber(orderNumber.trim().toUpperCase());
      if (result.error) {
        setError(result.error);
      } else if (result.order) {
        setOrder(result.order as TrackingOrder);
      }
    });
  }

  const isCancelled = order?.status === "CANCELLED";
  const isRefunded = order?.status === "REFUNDED";
  const currentStatusIndex = order
    ? ORDER_STATUSES.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <Package className="mx-auto mb-4 size-12 text-primary" />
        <h1 className="text-2xl font-bold">Track Your Order</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your order number to check the status of your delivery
        </p>
      </div>

      <div className="mt-8 flex gap-2">
        <Input
          placeholder="e.g. SE-M1ABC2D-XY3Z"
          value={orderNumber}
          onChange={(e) => {
            setOrderNumber(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isPending || !orderNumber.trim()}>
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Search className="mr-2 size-4" />
          )}
          Track
        </Button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-8 text-center">
          <XCircle className="mx-auto mb-2 size-8 text-destructive" />
          <p className="text-destructive">{error}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please double-check your order number and try again.
          </p>
        </div>
      )}

      {order && (
        <div className="mt-8 space-y-6">
          {/* Order Summary */}
          <div className="rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-lg font-semibold">{order.orderNumber}</p>
              </div>
              <Badge variant={statusColors[order.status] || "secondary"} className="text-sm">
                {order.status}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Placed On</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Method</p>
                <p className="font-medium">
                  {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
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
            </div>
          </div>

          {/* Status Timeline */}
          {!isCancelled && !isRefunded && (
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">
                Order Progress
              </h2>
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
                            isActive
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
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

          {/* Cancelled */}
          {isCancelled && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
              <p className="font-medium text-destructive">
                This order has been cancelled.
              </p>
            </div>
          )}

          {/* Tracking Events */}
          {order.tracking && order.tracking.length > 0 && (
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">
                Tracking Updates
              </h2>
              <div className="space-y-3">
                {order.tracking.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`size-3 rounded-full ${
                          i === order.tracking.length - 1
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                      />
                      {i < order.tracking.length - 1 && (
                        <div className="h-full w-px bg-muted-foreground/20" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium">{event.status}</p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground">
                          {event.location}
                        </p>
                      )}
                      {event.notes && (
                        <p className="text-xs text-muted-foreground">
                          {event.notes}
                        </p>
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
        </div>
      )}

      {searched && !order && !error && !isPending && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Looking up your order...
        </div>
      )}
    </div>
  );
}
