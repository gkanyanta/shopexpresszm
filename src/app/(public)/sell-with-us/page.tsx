import type { Metadata } from "next";
import Link from "next/link";
import {
  Store,
  TrendingUp,
  Users,
  Truck,
  Shield,
  ArrowRight,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sell With Us",
  description:
    "Join SHOP EXPRESS ZM as a vendor. List your products, reach customers across Zambia, and grow your business.",
};

export default function SellWithUsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-zinc-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm mb-6">
              <Store className="h-4 w-4" />
              Vendor Opportunity
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Grow Your Business on
              <br />
              <span className="text-amber-400">SHOP EXPRESS ZM</span>
            </h1>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl">
              Join Zambia&apos;s growing online marketplace. List your products,
              reach thousands of customers nationwide, and let us handle the
              delivery logistics.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold"
              >
                Apply to Sell
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Why Sell on SHOP EXPRESS ZM?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Users,
              title: "Access More Customers",
              desc: "Reach buyers across Lusaka and all provinces in Zambia through our platform.",
            },
            {
              icon: TrendingUp,
              title: "Grow Your Revenue",
              desc: "Expand your sales beyond your physical location with online visibility.",
            },
            {
              icon: Truck,
              title: "Delivery Handled",
              desc: "We manage delivery logistics through our Inland Express network.",
            },
            {
              icon: Shield,
              title: "Secure Payments",
              desc: "Get paid reliably with our secure payment processing system.",
            },
            {
              icon: Store,
              title: "Your Own Store Page",
              desc: "Get a dedicated vendor store page to showcase your brand and products.",
            },
            {
              icon: Headphones,
              title: "Dedicated Support",
              desc: "Our vendor support team is here to help you succeed.",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="p-6 rounded-xl border">
                <div className="p-3 bg-amber-50 rounded-lg inline-flex mb-3">
                  <Icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">{b.title}</h3>
                <p className="text-sm text-zinc-500">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How to Join */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How to Get Started
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Create Account", desc: "Sign up and choose 'I want to sell'" },
              { step: "2", title: "Submit Application", desc: "Fill out your business details" },
              { step: "3", title: "Get Approved", desc: "Our team reviews in 2-3 days" },
              { step: "4", title: "Start Selling", desc: "List products and receive orders" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-zinc-900 text-amber-400 font-bold rounded-full flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-semibold text-zinc-900 mb-1">{s.title}</h3>
                <p className="text-sm text-zinc-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            What You Need to Apply
          </h2>
          <div className="space-y-3">
            {[
              "Registered business or trading name",
              "Valid phone number and email",
              "Physical business address in Zambia",
              "Product photos and descriptions ready",
              "Bank account or mobile money for payouts",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-zinc-600 mb-6 max-w-lg mx-auto">
            Join our growing community of Zambian vendors and reach customers
            nationwide.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
