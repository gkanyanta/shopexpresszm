import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyRequests, acceptQuote } from "@/actions/buy-for-me";
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/format";
import Link from "next/link";
import {
  Globe,
  Plus,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  CreditCard,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy For Me Requests",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  QUOTED: { label: "Quoted", color: "bg-purple-100 text-purple-700", icon: CreditCard },
  AWAITING_PAYMENT: { label: "Awaiting Payment", color: "bg-orange-100 text-orange-700", icon: CreditCard },
  PAID: { label: "Paid", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  ORDERED: { label: "Ordered", color: "bg-indigo-100 text-indigo-700", icon: Package },
  IN_TRANSIT: { label: "In Transit", color: "bg-cyan-100 text-cyan-700", icon: Truck },
  ARRIVED: { label: "Arrived", color: "bg-teal-100 text-teal-700", icon: Package },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

const TIMELINE_STEPS = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "QUOTED",
  "AWAITING_PAYMENT",
  "PAID",
  "ORDERED",
  "IN_TRANSIT",
  "ARRIVED",
  "DELIVERED",
];

const SOURCE_LABELS: Record<string, string> = {
  USA: "United States",
  UK: "United Kingdom",
  CHINA: "China",
  OTHER: "Other",
};

export default async function BuyForMePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const requests = await getMyRequests(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-zinc-900">Buy For Me</h1>
        <Link href="/dashboard/buy-for-me/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
            <Plus className="h-4 w-4 mr-1.5" />
            New Request
          </Button>
        </Link>
      </div>
      <p className="text-zinc-500 text-sm mb-8">
        Request products from international markets and we&apos;ll buy and ship them for you.
      </p>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <CustomerSidebar />

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Globe className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-zinc-900 mb-1">
                No requests yet
              </h2>
              <p className="text-sm text-zinc-500 mb-4">
                Want a product from the USA, UK, or China? Submit a Buy For Me request
                and we&apos;ll handle the rest.
              </p>
              <Link href="/dashboard/buy-for-me/new">
                <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Submit Your First Request
                </Button>
              </Link>
            </div>
          ) : (
            requests.map((request) => {
              const statusCfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.SUBMITTED;
              const StatusIcon = statusCfg.icon;
              const currentStepIndex = TIMELINE_STEPS.indexOf(request.status);
              const isCancelled = request.status === "CANCELLED";

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-xl border overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 md:p-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-zinc-900 text-lg">
                          {request.productName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-zinc-500">
                          <span>Qty: {request.quantity}</span>
                          <span className="text-zinc-300">|</span>
                          <span>From: {SOURCE_LABELS[request.sourceCountry]}</span>
                          <span className="text-zinc-300">|</span>
                          <span>{formatDate(request.createdAt)}</span>
                        </div>
                      </div>
                      <Badge className={statusCfg.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusCfg.label}
                      </Badge>
                    </div>

                    {request.productUrl && (
                      <a
                        href={request.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-amber-600 hover:underline mt-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View product link
                      </a>
                    )}

                    {request.productDescription && (
                      <p className="text-sm text-zinc-600 mt-2">
                        {request.productDescription}
                      </p>
                    )}

                    {request.adminNotes && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-800 border border-amber-100">
                        <strong>Note from team:</strong> {request.adminNotes}
                      </div>
                    )}
                  </div>

                  {/* Status Timeline */}
                  {!isCancelled && (
                    <div className="px-4 md:px-6 py-4 bg-zinc-50">
                      <div className="flex items-center overflow-x-auto pb-2">
                        {TIMELINE_STEPS.map((step, i) => {
                          const isCompleted = i <= currentStepIndex;
                          const isCurrent = i === currentStepIndex;
                          return (
                            <div key={step} className="flex items-center shrink-0">
                              <div
                                className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
                                  isCurrent
                                    ? "bg-amber-500 text-white ring-2 ring-amber-200"
                                    : isCompleted
                                      ? "bg-green-500 text-white"
                                      : "bg-zinc-200 text-zinc-500"
                                }`}
                              >
                                {isCompleted && !isCurrent ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : (
                                  i + 1
                                )}
                              </div>
                              {i < TIMELINE_STEPS.length - 1 && (
                                <div
                                  className={`h-0.5 w-6 md:w-8 ${
                                    i < currentStepIndex
                                      ? "bg-green-400"
                                      : "bg-zinc-200"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center overflow-x-auto mt-1">
                        {TIMELINE_STEPS.map((step, i) => {
                          const isCurrent = i === currentStepIndex;
                          return (
                            <div
                              key={step}
                              className={`text-[10px] shrink-0 ${
                                i < TIMELINE_STEPS.length - 1
                                  ? "w-[calc(1.5rem+1.5rem)] md:w-[calc(1.5rem+2rem)]"
                                  : "w-6"
                              } text-center ${
                                isCurrent
                                  ? "text-amber-700 font-semibold"
                                  : "text-zinc-400"
                              }`}
                            >
                              {STATUS_CONFIG[step]?.label.split(" ")[0]}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quotes */}
                  {request.quotes.length > 0 && (
                    <div className="p-4 md:p-6">
                      <h4 className="text-sm font-semibold text-zinc-700 mb-3">
                        Quotes
                      </h4>
                      <div className="space-y-3">
                        {request.quotes.map((quote) => (
                          <div
                            key={quote.id}
                            className={`p-4 rounded-lg border ${
                              quote.isAccepted
                                ? "border-green-200 bg-green-50"
                                : "border-zinc-200 bg-white"
                            }`}
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-zinc-500">Product Cost</p>
                                <p className="font-medium text-zinc-900">
                                  {formatPrice(Number(quote.productCost))}
                                </p>
                              </div>
                              <div>
                                <p className="text-zinc-500">Shipping</p>
                                <p className="font-medium text-zinc-900">
                                  {formatPrice(Number(quote.shippingCost))}
                                </p>
                              </div>
                              <div>
                                <p className="text-zinc-500">Service Fee</p>
                                <p className="font-medium text-zinc-900">
                                  {formatPrice(Number(quote.serviceFee))}
                                </p>
                              </div>
                              <div>
                                <p className="text-zinc-500">Total</p>
                                <p className="font-bold text-zinc-900">
                                  {formatPrice(Number(quote.totalCost))}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-zinc-500">
                                Estimated delivery: {quote.estimatedDays} days
                                {quote.notes && ` - ${quote.notes}`}
                              </p>
                              {quote.isAccepted ? (
                                <Badge className="bg-green-100 text-green-700">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Accepted
                                </Badge>
                              ) : request.status === "QUOTED" ? (
                                <form
                                  action={async () => {
                                    "use server";
                                    await acceptQuote(quote.id);
                                  }}
                                >
                                  <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
                                  >
                                    Accept Quote
                                  </Button>
                                </form>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
