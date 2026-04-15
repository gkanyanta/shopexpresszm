import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CouponForm, CouponToggleButton } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Coupon Management - Admin",
};

export default async function AdminCouponsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Coupon Management
        </h1>
        <p className="text-zinc-500 text-sm">
          Create and manage discount coupons
        </p>
      </div>

      {/* Create Coupon Form */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Create New Coupon
        </h2>
        <CouponForm />
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-zinc-400"
                >
                  No coupons created
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-semibold">
                    {coupon.code}
                  </TableCell>
                  <TableCell className="text-zinc-600 max-w-[200px] truncate">
                    {coupon.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.discountType === "percentage"
                        ? "Percentage"
                        : "Fixed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {coupon.discountType === "percentage"
                      ? `${Number(coupon.discountValue)}%`
                      : formatPrice(Number(coupon.discountValue))}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {coupon.usedCount}
                    {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {coupon.expiresAt
                      ? formatDate(coupon.expiresAt)
                      : "No expiry"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={coupon.isActive ? "default" : "secondary"}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CouponToggleButton
                      couponId={coupon.id}
                      isActive={coupon.isActive}
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
