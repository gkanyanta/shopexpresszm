"use client";

import { useTransition } from "react";
import { createCoupon, toggleCouponActive } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CouponForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createCoupon({
        code: formData.get("code") as string,
        description: (formData.get("description") as string) || undefined,
        discountType: formData.get("discountType") as "percentage" | "fixed",
        discountValue: Number(formData.get("discountValue")),
        minOrderAmount: formData.get("minOrderAmount")
          ? Number(formData.get("minOrderAmount"))
          : null,
        maxUses: formData.get("maxUses")
          ? Number(formData.get("maxUses"))
          : null,
        startsAt: formData.get("startsAt")
          ? new Date(formData.get("startsAt") as string)
          : null,
        expiresAt: formData.get("expiresAt")
          ? new Date(formData.get("expiresAt") as string)
          : null,
      });
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Coupon Code</Label>
          <Input
            id="code"
            name="code"
            placeholder="e.g. SAVE20"
            required
            className="uppercase"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountType">Discount Type</Label>
          <select
            id="discountType"
            name="discountType"
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">Discount Value</Label>
          <Input
            id="discountValue"
            name="discountValue"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="e.g. 20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            placeholder="Optional description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minOrderAmount">Min Order (ZMW)</Label>
          <Input
            id="minOrderAmount"
            name="minOrderAmount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxUses">Max Uses</Label>
          <Input
            id="maxUses"
            name="maxUses"
            type="number"
            min="1"
            placeholder="Unlimited"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiry Date</Label>
          <Input id="expiresAt" name="expiresAt" type="date" />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Coupon"}
      </Button>
    </form>
  );
}

export function CouponToggleButton({
  couponId,
  isActive,
}: {
  couponId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={isActive ? "destructive" : "default"}
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => toggleCouponActive(couponId))}
    >
      {isPending ? "..." : isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
