import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeliveryZoneForm, DeliveryZoneDeleteButton } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Delivery Zones - Admin",
};

export default async function AdminDeliveryPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const zones = await db.deliveryZone.findMany({
    orderBy: [{ province: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Delivery Zone Management
        </h1>
        <p className="text-zinc-500 text-sm">
          Configure delivery zones, fees, and coverage areas
        </p>
      </div>

      {/* Create Zone Form */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Create Delivery Zone
        </h2>
        <DeliveryZoneForm />
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone Name</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Base Fee</TableHead>
              <TableHead>Express Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-zinc-400"
                >
                  No delivery zones configured
                </TableCell>
              </TableRow>
            ) : (
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell className="text-zinc-600">
                    {zone.province}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(Number(zone.baseFee))}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(Number(zone.expressFee))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={zone.isActive ? "default" : "secondary"}>
                      {zone.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DeliveryZoneDeleteButton zoneId={zone.id} />
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
