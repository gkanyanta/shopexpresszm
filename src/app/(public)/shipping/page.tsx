import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  Truck,
  Globe,
  Package,
  Clock,
  MapPin,
  ShieldCheck,
  Plane,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Services",
  description:
    "Learn about SHOP EXPRESS ZM shipping services — local delivery across Zambia and international shipping from the USA, UK, and China.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          Shipping <span className="text-amber-500">Services</span>
        </h1>
        <p className="text-lg text-zinc-600">
          Powered by {siteConfig.company.name}&apos;s logistics expertise, we
          offer reliable shipping across Zambia and from international markets.
        </p>
      </div>

      {/* Services */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-white rounded-2xl border p-8">
          <div className="inline-flex p-3 bg-amber-50 rounded-lg mb-4">
            <Truck className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">
            Local Delivery
          </h2>
          <p className="text-zinc-600 mb-4">
            We deliver to all major towns across Zambia. Orders are processed and
            dispatched within 24-48 hours of confirmation.
          </p>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <span>Standard delivery: 2-5 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <span>Express delivery: 1-2 business days (Lusaka)</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <span>Pickup available at our Lusaka office</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border p-8">
          <div className="inline-flex p-3 bg-blue-50 rounded-lg mb-4">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">
            International Shipping
          </h2>
          <p className="text-zinc-600 mb-4">
            Through our Buy For Me service, we source and ship products from the
            USA, UK, and China directly to your doorstep in Zambia.
          </p>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="flex items-start gap-2">
              <Plane className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Air freight: 7-14 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <Package className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Sea freight: 30-60 business days (bulky items)</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Full customs clearance handled by us</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Delivery Areas */}
      <div className="bg-zinc-50 rounded-2xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Delivery Areas
          </h2>
          <p className="text-zinc-600">
            We deliver to all major towns and cities across Zambia.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {siteConfig.deliveryAreas.map((area) => (
            <div
              key={area}
              className="bg-white rounded-lg p-3 text-center border"
            >
              <MapPin className="h-4 w-4 text-amber-500 mx-auto mb-1" />
              <span className="text-sm font-medium text-zinc-700">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-zinc-900">How Shipping Works</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          {
            icon: Package,
            step: "1",
            title: "Order Placed",
            desc: "Place your order through our platform and choose your delivery method.",
          },
          {
            icon: Building2,
            step: "2",
            title: "Processing",
            desc: "We package your order with care and assign it to our delivery team.",
          },
          {
            icon: Truck,
            step: "3",
            title: "In Transit",
            desc: "Track your shipment in real-time as it makes its way to you.",
          },
          {
            icon: MapPin,
            step: "4",
            title: "Delivered",
            desc: "Receive your order at your doorstep or pick it up from our office.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="text-center">
              <div className="relative inline-flex p-4 bg-amber-50 rounded-full mb-4">
                <Icon className="h-6 w-6 text-amber-600" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="font-semibold text-zinc-900 mb-1">{item.title}</h3>
              <p className="text-sm text-zinc-500">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="bg-zinc-900 rounded-2xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Questions About Shipping?</h2>
        <p className="text-zinc-400 mb-4">
          Our team is happy to help with any shipping inquiries.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <span className="text-zinc-300">
            {siteConfig.company.phone}
          </span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="text-zinc-300">
            {siteConfig.company.email}
          </span>
        </div>
      </div>
    </div>
  );
}
