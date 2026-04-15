"use client";

import { useTransition } from "react";
import { toggleProductActive, deleteProduct } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ProductActions({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => toggleProductActive(productId))}
      >
        {isPending ? "..." : isActive ? "Deactivate" : "Activate"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (confirm("Are you sure you want to delete this product?")) {
            startTransition(() => deleteProduct(productId));
          }
        }}
      >
        {isPending ? "..." : "Delete"}
      </Button>
    </div>
  );
}
