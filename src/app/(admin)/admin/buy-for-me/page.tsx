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
import { BuyForMeStatusForm, BuyForMeQuoteForm, BuyForMeDetails } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy For Me Requests - Admin",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUBMITTED: "secondary",
  UNDER_REVIEW: "secondary",
  QUOTED: "outline",
  AWAITING_PAYMENT: "outline",
  PAID: "default",
  ORDERED: "default",
  IN_TRANSIT: "default",
  ARRIVED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

export default async function AdminBuyForMePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const requests = await db.buyForMeRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      quotes: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Buy For Me Requests
        </h1>
        <p className="text-zinc-500 text-sm">
          Review requests, create quotations, and track progress
        </p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-zinc-400">
            No Buy For Me requests yet
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl border">
              {/* Header row */}
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-zinc-900">
                      {request.productName}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      by {request.user.name || request.user.email} &middot;{" "}
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={statusColors[request.status] || "secondary"}>
                      {request.status.replace(/_/g, " ")}
                    </Badge>
                    <BuyForMeStatusForm
                      requestId={request.id}
                      currentStatus={request.status}
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <BuyForMeDetails
                  request={{
                    id: request.id,
                    productUrl: request.productUrl,
                    productDescription: request.productDescription,
                    sourceCountry: request.sourceCountry,
                    quantity: request.quantity,
                    adminNotes: request.adminNotes,
                  }}
                  latestQuote={
                    request.quotes[0]
                      ? {
                          productCost: Number(request.quotes[0].productCost),
                          shippingCost: Number(request.quotes[0].shippingCost),
                          serviceFee: Number(request.quotes[0].serviceFee),
                          totalCost: Number(request.quotes[0].totalCost),
                          estimatedDays: request.quotes[0].estimatedDays,
                          isAccepted: request.quotes[0].isAccepted,
                        }
                      : null
                  }
                />

                {/* Quote Form */}
                {!request.quotes[0] && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-zinc-900 mb-3">
                      Create Quotation
                    </h4>
                    <BuyForMeQuoteForm requestId={request.id} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
