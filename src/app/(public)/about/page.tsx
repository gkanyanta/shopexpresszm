import type { Metadata } from "next";
import { MapPin, Globe, Truck, ShieldCheck, Users, Target } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SHOP EXPRESS ZM — Zambia's trusted online marketplace powered by Inland Express Zambia.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          About <span className="text-amber-500">SHOP EXPRESS ZM</span>
        </h1>
        <p className="text-lg text-zinc-600">
          {siteConfig.description}
        </p>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Our Story</h2>
          <div className="space-y-4 text-zinc-600">
            <p>
              SHOP EXPRESS ZM was born from the vision of making quality products
              accessible to every Zambian. Backed by Inland Express Zambia&apos;s
              years of shipping and logistics expertise, we created an online
              marketplace that connects local sellers with customers nationwide.
            </p>
            <p>
              Based in Avondale, Lusaka, our team works tirelessly to ensure that
              whether you&apos;re shopping for local products or requesting items
              from international markets, your experience is seamless, secure,
              and satisfying.
            </p>
            <p>
              Our unique Buy For Me service allows you to access products from
              the USA, UK, and China — something that was once only possible for
              the well-connected. We&apos;ve democratised international shopping
              for all Zambians.
            </p>
          </div>
        </div>
        <div className="bg-zinc-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
          <div className="text-center">
            <div className="bg-zinc-900 text-amber-400 font-bold text-4xl px-4 py-3 rounded-xl inline-block mb-2">
              SE
            </div>
            <p className="text-zinc-400 text-sm">SHOP EXPRESS ZM</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-zinc-900 text-white rounded-2xl p-8">
          <Target className="h-8 w-8 text-amber-400 mb-4" />
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-zinc-300">
            To be Zambia&apos;s most trusted online marketplace, connecting local
            businesses with customers and bringing the world to Zambian
            doorsteps.
          </p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
          <Globe className="h-8 w-8 text-amber-600 mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 mb-3">Our Vision</h3>
          <p className="text-zinc-600">
            A Zambia where everyone has access to quality products — local and
            international — delivered with care and reliability.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-zinc-900">What Drives Us</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          {
            icon: ShieldCheck,
            title: "Trust",
            desc: "Verified vendors, secure payments, and transparent pricing.",
          },
          {
            icon: Truck,
            title: "Reliability",
            desc: "Consistent delivery backed by logistics expertise.",
          },
          {
            icon: Users,
            title: "Community",
            desc: "Supporting local businesses and Zambian entrepreneurs.",
          },
          {
            icon: Globe,
            title: "Access",
            desc: "Bringing international products within reach.",
          },
        ].map((value) => {
          const Icon = value.icon;
          return (
            <div key={value.title} className="text-center p-6 rounded-xl border">
              <div className="inline-flex p-3 bg-amber-50 rounded-lg mb-3">
                <Icon className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">{value.title}</h3>
              <p className="text-sm text-zinc-500">{value.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Location */}
      <div className="bg-zinc-50 rounded-2xl p-8 text-center">
        <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-zinc-900 mb-2">Visit Us</h3>
        <p className="text-zinc-600">{siteConfig.company.address}</p>
        <p className="text-zinc-500 text-sm mt-1">
          {siteConfig.company.phone} &bull; {siteConfig.company.email}
        </p>
      </div>
    </div>
  );
}
