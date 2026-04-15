"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitBuyForMeRequest } from "@/actions/buy-for-me";
import { buyForMeRequestSchema } from "@/lib/validations/buy-for-me";
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Globe, Loader2 } from "lucide-react";
import Link from "next/link";

const SOURCE_COUNTRIES = [
  { value: "USA", label: "United States (USA)" },
  { value: "UK", label: "United Kingdom (UK)" },
  { value: "CHINA", label: "China" },
  { value: "OTHER", label: "Other" },
] as const;

export default function NewBuyForMeRequestPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      productUrl: formData.get("productUrl") as string,
      productName: formData.get("productName") as string,
      productDescription: formData.get("productDescription") as string,
      sourceCountry: formData.get("sourceCountry") as "USA" | "UK" | "CHINA" | "OTHER",
      quantity: Number(formData.get("quantity")),
    };

    const validated = buyForMeRequestSchema.safeParse(data);
    if (!validated.success) {
      setError(validated.error.issues[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitBuyForMeRequest(validated.data);
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      }
      // redirect happens server-side
    } catch {
      // redirect throws, which is expected
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/buy-for-me"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to requests
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">
          New Buy For Me Request
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Tell us what you&apos;d like us to buy from abroad and we&apos;ll get you a quote.
        </p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <CustomerSidebar />

        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Globe className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Product Details</h2>
                <p className="text-xs text-zinc-500">
                  Provide as much detail as possible for an accurate quote.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="productName">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="e.g. iPhone 15 Pro Max 256GB"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="productUrl">Product URL (optional)</Label>
                <Input
                  id="productUrl"
                  name="productUrl"
                  type="url"
                  placeholder="https://www.amazon.com/dp/..."
                  className="mt-1.5"
                />
                <p className="text-xs text-zinc-400 mt-1">
                  Link to the product on Amazon, eBay, AliExpress, etc.
                </p>
              </div>

              <div>
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  placeholder="Describe the product, color, size, or any specific details..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sourceCountry">
                    Source Country <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="sourceCountry"
                    name="sourceCountry"
                    required
                    defaultValue="USA"
                    className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {SOURCE_COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="quantity">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    max={100}
                    defaultValue={1}
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="bg-zinc-50 rounded-lg p-4 text-sm text-zinc-600">
                <p className="font-medium text-zinc-700 mb-1">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Submit your request with product details</li>
                  <li>Our team reviews and sends you a quote</li>
                  <li>Accept the quote and make payment</li>
                  <li>We buy and ship the product to Zambia</li>
                  <li>Receive your product via our delivery network</li>
                </ol>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                  Submit Request
                </Button>
                <Link href="/dashboard/buy-for-me">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
