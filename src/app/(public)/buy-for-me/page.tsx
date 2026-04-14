import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Link2,
  FileText,
  CreditCard,
  Package,
  Truck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Buy For Me - International Shopping Service",
  description:
    "Request products from the USA, UK, and China. We buy, ship, and deliver to your door in Zambia.",
};

const steps = [
  {
    icon: Link2,
    title: "Submit Your Request",
    desc: "Paste a product link from Amazon, eBay, Alibaba, or any store. Or describe what you need.",
  },
  {
    icon: FileText,
    title: "Get a Quotation",
    desc: "Our team reviews your request and provides a detailed quote: product cost + shipping + service fee.",
  },
  {
    icon: CreditCard,
    title: "Make Payment",
    desc: "Accept the quote and pay securely via card, mobile money, or bank transfer.",
  },
  {
    icon: Package,
    title: "We Order & Ship",
    desc: "We purchase the product and ship it to Zambia. Track every step of the way.",
  },
  {
    icon: Truck,
    title: "Delivery to You",
    desc: "Receive your international purchase delivered right to your door in Zambia.",
  },
];

const sources = [
  {
    country: "United States",
    flag: "🇺🇸",
    stores: ["Amazon", "eBay", "Walmart", "Best Buy", "Target"],
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    stores: ["Amazon UK", "ASOS", "Argos", "John Lewis", "Currys"],
  },
  {
    country: "China",
    flag: "🇨🇳",
    stores: ["Alibaba", "AliExpress", "Temu", "1688", "Taobao"],
  },
];

export default function BuyForMePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm mb-6">
            <Globe className="h-4 w-4" />
            International Shopping Service
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl mx-auto">
            Want Something From Abroad?
            <br />
            <span className="text-amber-400">We&apos;ll Get It For You.</span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            Can&apos;t find what you need in Zambia? Submit a request and our
            team will source it from the USA, UK, or China and deliver it to
            your door.
          </p>
          <Link href="/auth/signin">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold text-base"
            >
              Submit a Request
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-zinc-200" />
                )}
                <div className="inline-flex p-3 bg-amber-50 rounded-xl mb-3 relative">
                  <Icon className="h-6 w-6 text-amber-600" />
                  <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-900 mb-1 text-sm">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-500">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Countries */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Where We Source From
          </h2>
          <p className="text-zinc-500 text-center mb-10">
            We can purchase from virtually any reputable online store in these
            countries
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sources.map((source) => (
              <div
                key={source.country}
                className="bg-white rounded-xl border p-6 text-center"
              >
                <span className="text-5xl block mb-3">{source.flag}</span>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">
                  {source.country}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {source.stores.map((store) => (
                    <span
                      key={store}
                      className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs"
                    >
                      {store}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            What&apos;s Included
          </h2>
          <div className="space-y-3">
            {[
              "Detailed quotation with full cost breakdown",
              "Product verification before purchase",
              "Secure international shipping",
              "Customs handling and clearance",
              "Real-time tracking updates",
              "Last-mile delivery to your Zambian address",
              "WhatsApp support throughout the process",
              "7-day return window for defective items",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
            Sign in or create an account to submit your first Buy For Me
            request. Our team typically responds within 24 hours.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold"
            >
              Create Account & Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
