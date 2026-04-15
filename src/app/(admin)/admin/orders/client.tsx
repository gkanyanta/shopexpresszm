"use client";

import { useTransition } from "react";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(() => {
      updateOrderStatus(orderId, e.target.value as OrderStatus);
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
    >
      <option value="PENDING">Pending</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
      <option value="REFUNDED">Refunded</option>
    </select>
  );
}

export function PaymentStatusButton({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: PaymentStatus;
}) {
  const [isPending, startTransition] = useTransition();

  if (paymentStatus === "PAID") {
    return (
      <span className="text-xs text-green-600 font-medium">Confirmed</span>
    );
  }

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(() => updatePaymentStatus(orderId, "PAID"))
      }
    >
      {isPending ? "..." : "Confirm Payment"}
    </Button>
  );
}
