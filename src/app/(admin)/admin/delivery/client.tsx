"use client";

import { useTransition } from "react";
import { createDeliveryZone, deleteDeliveryZone } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ZAMBIA_PROVINCES = [
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western",
];

export function DeliveryZoneForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createDeliveryZone({
        name: formData.get("name") as string,
        province: formData.get("province") as string,
        description: (formData.get("description") as string) || undefined,
        baseFee: Number(formData.get("baseFee")),
        expressFee: Number(formData.get("expressFee")),
        isActive: true,
      });
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Zone Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Lusaka Urban"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <select
            id="province"
            name="province"
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select province</option>
            {ZAMBIA_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            name="description"
            placeholder="Coverage area details"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseFee">Base Fee (ZMW)</Label>
          <Input
            id="baseFee"
            name="baseFee"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expressFee">Express Fee (ZMW)</Label>
          <Input
            id="expressFee"
            name="expressFee"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Zone"}
      </Button>
    </form>
  );
}

export function DeliveryZoneDeleteButton({ zoneId }: { zoneId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this delivery zone?")) {
          startTransition(() => deleteDeliveryZone(zoneId));
        }
      }}
    >
      {isPending ? "..." : "Delete"}
    </Button>
  );
}
