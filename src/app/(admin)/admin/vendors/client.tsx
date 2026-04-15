"use client";

import { useTransition } from "react";
import { approveVendor, suspendVendor, rejectVendor } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import type { VendorStatus } from "@prisma/client";

export function VendorActions({
  vendorId,
  status,
}: {
  vendorId: string;
  status: VendorStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {status !== "APPROVED" && (
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => startTransition(() => approveVendor(vendorId))}
        >
          {isPending ? "..." : "Approve"}
        </Button>
      )}
      {status !== "SUSPENDED" && status === "APPROVED" && (
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() => startTransition(() => suspendVendor(vendorId))}
        >
          {isPending ? "..." : "Suspend"}
        </Button>
      )}
      {status === "PENDING" && (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => startTransition(() => rejectVendor(vendorId))}
        >
          {isPending ? "..." : "Reject"}
        </Button>
      )}
    </div>
  );
}
