import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-zinc-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm mb-6">
            <Globe className="h-4 w-4" />
            Powered by Inland Express Zambia
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Shop Local.{" "}
            <span className="text-amber-400">Source Global.</span>
            <br />
            Deliver Everywhere.
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl">
            Your trusted online marketplace for local and international
            products. Shop from local sellers, request products from the USA, UK
            & China, pay online, and get delivered across Zambia.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold text-base w-full sm:w-auto"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/buy-for-me">
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-600 text-white hover:bg-zinc-800 text-base w-full sm:w-auto"
              >
                <Globe className="mr-2 h-5 w-5" />
                Buy From Abroad
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Truck className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Nationwide Delivery</p>
                <p className="text-xs text-zinc-400">Lusaka & all provinces</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Globe className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm">International Sourcing</p>
                <p className="text-xs text-zinc-400">USA, UK & China</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Payments</p>
                <p className="text-xs text-zinc-400">Card & mobile money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
