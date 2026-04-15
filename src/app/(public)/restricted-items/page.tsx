import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AlertTriangle, Ban, ShieldAlert, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Restricted Items",
  description: `Items that are restricted or prohibited from sale on ${siteConfig.name}.`,
};

export default function RestrictedItemsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-red-50 rounded-lg shrink-0">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">
              Restricted Items
            </h1>
            <p className="text-zinc-600 text-sm">
              The following items are restricted or prohibited from sale on {siteConfig.name}.
              This list is not exhaustive and is subject to change. Violations may result in account
              suspension.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 rounded-xl p-6 border border-red-100">
            <h2 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
              <Ban className="h-5 w-5" />
              Prohibited Items (Absolutely Not Allowed)
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-red-700">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Firearms and ammunition</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Explosives and fireworks</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Illegal drugs and narcotics</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Counterfeit or pirated goods</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Stolen property</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Human organs or body parts</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Endangered wildlife products</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Child exploitation material</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Hazardous chemicals</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> Items that violate Zambian law</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <h2 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Restricted Items (Require Approval)
            </h2>
            <p className="text-sm text-amber-700 mb-3">
              The following items may only be listed with prior approval from {siteConfig.name}:
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-amber-700">
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Alcoholic beverages</li>
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Tobacco products</li>
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Prescription medications</li>
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Knives and bladed weapons</li>
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Pesticides and herbicides</li>
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Automotive batteries</li>
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Medical devices</li>
              <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">-</span> Surveillance equipment</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Buy For Me Service Restrictions
            </h2>
            <p className="text-sm text-blue-700 mb-3">
              In addition to the above, the following items cannot be requested through our Buy For Me service:
            </p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">-</span> Items prohibited from export by the source country</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">-</span> Items prohibited from import into Zambia by ZICTA, ZAMRA, or Customs</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">-</span> Live animals or plants</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">-</span> Perishable food items</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">-</span> Currency and financial instruments</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">-</span> Items exceeding customs value thresholds without proper documentation</li>
            </ul>
          </div>

          <div className="bg-zinc-50 rounded-xl p-6 border">
            <h2 className="text-lg font-semibold text-zinc-800 mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions?
            </h2>
            <p className="text-sm text-zinc-600">
              If you are unsure whether an item is permitted on our platform, please contact us before
              listing. We are happy to clarify and help ensure compliance.
            </p>
            <p className="text-sm text-zinc-600 mt-3">
              {siteConfig.company.name}<br />
              Email: {siteConfig.company.email}<br />
              Phone: {siteConfig.company.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
