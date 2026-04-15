"use client";

import { useTransition } from "react";
import { toggleReviewApproval } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ReviewApprovalButton({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={isApproved ? "outline" : "default"}
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => toggleReviewApproval(reviewId))}
    >
      {isPending ? "..." : isApproved ? "Unapprove" : "Approve"}
    </Button>
  );
}
