import Link from "next/link";
import { Store, ArrowRight, TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VendorCTA() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm mb-4">
                <Store className="h-4 w-4" />
                Become a Vendor
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sell Your Products on
                <br />
                <span className="text-amber-400">SHOP EXPRESS ZM</span>
              </h2>

              <p className="text-zinc-300 mb-6">
                Join Zambia&apos;s growing online marketplace. List your products,
                reach customers nationwide, and grow your business with our
                logistics support.
              </p>

              <Link href="/sell-with-us">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold"
                >
                  Start Selling Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium">Grow Your Revenue</h3>
                  <p className="text-sm text-zinc-400">
                    Access thousands of customers across Zambia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium">Easy Onboarding</h3>
                  <p className="text-sm text-zinc-400">
                    Simple registration process with dedicated support
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium">Logistics Handled</h3>
                  <p className="text-sm text-zinc-400">
                    We handle delivery with Inland Express infrastructure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
