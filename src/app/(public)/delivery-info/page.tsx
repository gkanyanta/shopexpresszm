import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Package,
  AlertTriangle,
  CheckCircle2,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery Information",
  description:
    "Delivery zones, fees, and timelines for SHOP EXPRESS ZM orders across Zambia.",
};

export default function DeliveryInfoPage() {
  const deliveryZones = [
    { zone: "Lusaka (within city)", standard: "K30", express: "K60", time: "1-2 days" },
    { zone: "Lusaka (suburbs)", standard: "K50", express: "K90", time: "2-3 days" },
    { zone: "Copperbelt (Kitwe, Ndola)", standard: "K80", express: "K150", time: "3-5 days" },
    { zone: "Central (Kabwe)", standard: "K70", express: "K130", time: "2-4 days" },
    { zone: "Southern (Livingstone)", standard: "K100", express: "K180", time: "4-6 days" },
    { zone: "Eastern (Chipata)", standard: "K120", express: "K200", time: "5-7 days" },
    { zone: "Northwestern (Solwezi)", standard: "K130", express: "K220", time: "5-7 days" },
    { zone: "Northern (Kasama)", standard: "K130", express: "K220", time: "5-7 days" },
    { zone: "Luapula (Mansa)", standard: "K140", express: "K230", time: "6-8 days" },
    { zone: "Western (Mongu)", standard: "K140", express: "K230", time: "6-8 days" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          Delivery <span className="text-amber-500">Information</span>
        </h1>
        <p className="text-lg text-zinc-600">
          Everything you need to know about how we deliver your orders across
          Zambia.
        </p>
      </div>

      {/* Delivery Methods */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: Truck,
            title: "Standard Delivery",
            desc: "Reliable delivery to your doorstep within the estimated timeframe for your zone.",
            color: "bg-amber-50 text-amber-600",
          },
          {
            icon: Clock,
            title: "Express Delivery",
            desc: "Priority handling and faster delivery for urgent orders. Available in most areas.",
            color: "bg-blue-50 text-blue-600",
          },
          {
            icon: MapPin,
            title: "Pickup",
            desc: `Collect your order free of charge from our office at ${siteConfig.company.address}.`,
            color: "bg-green-50 text-green-600",
          },
        ].map((method) => {
          const Icon = method.icon;
          return (
            <div key={method.title} className="bg-white rounded-xl border p-6">
              <div className={`inline-flex p-3 rounded-lg mb-4 ${method.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                {method.title}
              </h3>
              <p className="text-sm text-zinc-600">{method.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Delivery Zones Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">
          Delivery Zones & Fees
        </h2>
        <div className="bg-white rounded-xl border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b">
                <th className="text-left p-4 font-semibold text-zinc-700">
                  Zone
                </th>
                <th className="text-left p-4 font-semibold text-zinc-700">
                  Standard Fee
                </th>
                <th className="text-left p-4 font-semibold text-zinc-700">
                  Express Fee
                </th>
                <th className="text-left p-4 font-semibold text-zinc-700">
                  Est. Time (Standard)
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryZones.map((zone, i) => (
                <tr
                  key={zone.zone}
                  className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}
                >
                  <td className="p-4 font-medium text-zinc-900">{zone.zone}</td>
                  <td className="p-4 text-zinc-600">{zone.standard}</td>
                  <td className="p-4 text-zinc-600">{zone.express}</td>
                  <td className="p-4 text-zinc-600">{zone.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-400 mt-2 text-center">
          Fees are estimates and may vary based on package weight and dimensions.
          Free delivery on orders above K500 within Lusaka.
        </p>
      </div>

      {/* Important Notes */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            What to Expect
          </h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li>SMS/WhatsApp notification when your order is dispatched</li>
            <li>Real-time tracking available in your dashboard</li>
            <li>Delivery confirmation with signature required</li>
            <li>Secure packaging for fragile items</li>
            <li>Free delivery on orders above K500 (Lusaka only)</li>
          </ul>
        </div>

        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Please Note
          </h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>Delivery times are estimates and may vary due to weather or road conditions</li>
            <li>Someone must be available to receive the delivery at the address provided</li>
            <li>Incorrect addresses may incur additional charges for redelivery</li>
            <li>Large or heavy items may take additional time for rural deliveries</li>
            <li>Public holidays may affect delivery schedules</li>
          </ul>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-zinc-900 rounded-2xl p-8 text-center text-white">
        <Phone className="h-8 w-8 text-amber-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Need Help With a Delivery?</h2>
        <p className="text-zinc-400 mb-4">
          Contact our delivery support team for assistance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <span className="text-zinc-300">{siteConfig.company.phone}</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="text-zinc-300">{siteConfig.company.email}</span>
        </div>
      </div>
    </div>
  );
}
