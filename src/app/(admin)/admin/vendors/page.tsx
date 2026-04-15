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
import { VendorActions } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendor Management - Admin",
};

const statusColors: Record<string, string> = {
  PENDING: "secondary",
  APPROVED: "default",
  SUSPENDED: "destructive",
  REJECTED: "outline",
};

export default async function AdminVendorsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const vendors = await db.vendorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { products: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Vendor Management</h1>
        <p className="text-zinc-500 text-sm">
          Approve, suspend, or reject vendor applications
        </p>
      </div>

      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-zinc-400">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">
                    {vendor.businessName}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {vendor.user.name || vendor.user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (statusColors[vendor.status] as "default" | "secondary" | "destructive" | "outline") ||
                        "secondary"
                      }
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vendor.isVerified ? "default" : "outline"}>
                      {vendor.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {vendor._count.products}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {formatDate(vendor.createdAt)}
                  </TableCell>
                  <TableCell>
                    <VendorActions
                      vendorId={vendor.id}
                      status={vendor.status}
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
