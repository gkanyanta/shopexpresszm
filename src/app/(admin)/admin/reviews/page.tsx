import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReviewApprovalButton } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review Moderation - Admin",
};

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const reviews = await db.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { title: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Review Moderation
        </h1>
        <p className="text-zinc-500 text-sm">
          Approve or reject customer reviews
        </p>
      </div>

      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-zinc-400"
                >
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium max-w-[180px] truncate">
                    {review.product.title}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {review.user.name || review.user.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? "text-amber-500"
                              : "text-zinc-200"
                          }
                        >
                          &#9733;
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600 max-w-[250px] truncate">
                    {review.comment || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={review.isApproved ? "default" : "secondary"}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell>
                    <ReviewApprovalButton
                      reviewId={review.id}
                      isApproved={review.isApproved}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
