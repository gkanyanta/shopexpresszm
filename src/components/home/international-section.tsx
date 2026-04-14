import Link from "next/link";
import { Globe, ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const sources = [
  { country: "United States", flag: "🇺🇸", stores: "Amazon, eBay, Walmart" },
  { country: "United Kingdom", flag: "🇬🇧", stores: "Amazon UK, ASOS, Argos" },
  { country: "China", flag: "🇨🇳", stores: "Alibaba, Temu, AliExpress" },
];

const benefits = [
  "Paste any product link and we'll handle the rest",
  "Get a detailed quotation before you commit",
  "Track your international order every step of the way",
  "Delivered right to your door in Zambia",
];

export function InternationalSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl p-8 md:p-12 border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Globe className="h-4 w-4" />
                Buy For Me Service
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
                Want Something From Abroad?
                <br />
                <span className="text-amber-600">We&apos;ll Get It For You.</span>
              </h2>

              <p className="text-zinc-600 mb-6">
                Can&apos;t find what you need locally? Our international sourcing
                service lets you request products from the USA, UK, and China.
                Simply share a product link or description, and we&apos;ll handle
                everything from purchase to delivery.
              </p>

              <ul className="space-y-2 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link href="/buy-for-me">
                <Button
                  size="lg"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white"
                >
                  Submit a Request
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {sources.map((source) => (
                <div
                  key={source.country}
                  className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{source.flag}</span>
                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {source.country}
                      </h3>
                      <p className="text-sm text-zinc-500">{source.stores}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <ExternalLink className="h-3 w-3" />
                    Paste any product link from these stores
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
