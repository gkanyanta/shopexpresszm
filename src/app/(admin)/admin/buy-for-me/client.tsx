"use client";

import { useTransition } from "react";
import {
  updateBuyForMeStatus,
  createBuyForMeQuote,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import type { BuyForMeStatus } from "@prisma/client";

export function BuyForMeStatusForm({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: BuyForMeStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(() => {
      updateBuyForMeStatus(requestId, e.target.value as BuyForMeStatus);
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
    >
      <option value="SUBMITTED">Submitted</option>
      <option value="UNDER_REVIEW">Under Review</option>
      <option value="QUOTED">Quoted</option>
      <option value="AWAITING_PAYMENT">Awaiting Payment</option>
      <option value="PAID">Paid</option>
      <option value="ORDERED">Ordered</option>
      <option value="IN_TRANSIT">In Transit</option>
      <option value="ARRIVED">Arrived</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}

export function BuyForMeDetails({
  request,
  latestQuote,
}: {
  request: {
    id: string;
    productUrl: string | null;
    productDescription: string | null;
    sourceCountry: string;
    quantity: number;
    adminNotes: string | null;
  };
  latestQuote: {
    productCost: number;
    shippingCost: number;
    serviceFee: number;
    totalCost: number;
    estimatedDays: number;
    isAccepted: boolean;
  } | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <div>
          <span className="text-zinc-500">Source Country:</span>{" "}
          <span className="font-medium">{request.sourceCountry}</span>
        </div>
        <div>
          <span className="text-zinc-500">Quantity:</span>{" "}
          <span className="font-medium">{request.quantity}</span>
        </div>
        {request.productUrl && (
          <div>
            <span className="text-zinc-500">Product URL:</span>{" "}
            <a
              href={request.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {request.productUrl}
            </a>
          </div>
        )}
        {request.productDescription && (
          <div>
            <span className="text-zinc-500">Description:</span>{" "}
            <span className="text-zinc-700">{request.productDescription}</span>
          </div>
        )}
      </div>

      {latestQuote && (
        <div className="bg-zinc-50 rounded-lg p-3 space-y-1">
          <p className="font-semibold text-zinc-900 mb-2">Latest Quote</p>
          <div className="flex justify-between">
            <span className="text-zinc-500">Product Cost:</span>
            <span>{formatPrice(latestQuote.productCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Shipping:</span>
            <span>{formatPrice(latestQuote.shippingCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Service Fee:</span>
            <span>{formatPrice(latestQuote.serviceFee)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 font-semibold">
            <span>Total:</span>
            <span>{formatPrice(latestQuote.totalCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Est. Days:</span>
            <span>{latestQuote.estimatedDays} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Accepted:</span>
            <span>{latestQuote.isAccepted ? "Yes" : "No"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function BuyForMeQuoteForm({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createBuyForMeQuote(requestId, {
        productCost: Number(formData.get("productCost")),
        shippingCost: Number(formData.get("shippingCost")),
        serviceFee: Number(formData.get("serviceFee")),
        estimatedDays: Number(formData.get("estimatedDays")),
        notes: (formData.get("notes") as string) || undefined,
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label htmlFor={`productCost-${requestId}`}>Product Cost</Label>
          <Input
            id={`productCost-${requestId}`}
            name="productCost"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`shippingCost-${requestId}`}>Shipping Cost</Label>
          <Input
            id={`shippingCost-${requestId}`}
            name="shippingCost"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`serviceFee-${requestId}`}>Service Fee</Label>
          <Input
            id={`serviceFee-${requestId}`}
            name="serviceFee"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`estimatedDays-${requestId}`}>Est. Days</Label>
          <Input
            id={`estimatedDays-${requestId}`}
            name="estimatedDays"
            type="number"
            min="1"
            required
            placeholder="14"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`notes-${requestId}`}>Notes (optional)</Label>
        <Textarea
          id={`notes-${requestId}`}
          name="notes"
          rows={2}
          placeholder="Any additional notes for the customer"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Quote"}
      </Button>
    </form>
  );
}
