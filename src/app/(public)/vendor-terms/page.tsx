import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Vendor Terms & Conditions",
  description: `Terms and conditions for vendors selling on ${siteConfig.name}.`,
};

export default function VendorTermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Vendor Terms &amp; Conditions
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Last updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              1. Introduction
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              These Vendor Terms &amp; Conditions govern the relationship between vendors (&quot;you&quot;, &quot;seller&quot;)
              and {siteConfig.company.name} (&quot;we&quot;, &quot;us&quot;, &quot;the platform&quot;) when selling products on {siteConfig.name}.
              By registering as a vendor, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              2. Vendor Registration
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>All vendor applications are subject to review and approval by our team</li>
              <li>You must provide accurate business information, including valid identification and tax registration where applicable</li>
              <li>We reserve the right to reject or suspend vendor accounts at our discretion</li>
              <li>You must maintain a valid phone number and email for communication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              3. Product Listings
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>All product listings must be accurate, including descriptions, images, pricing, and stock levels</li>
              <li>You may not list prohibited or restricted items (see our Restricted Items page)</li>
              <li>We reserve the right to remove listings that violate our policies</li>
              <li>Product images must be your own or properly licensed</li>
              <li>Prices must be in Zambian Kwacha ({siteConfig.currency.code})</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              4. Commission and Fees
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {siteConfig.name} charges a commission on each successful sale. The commission rate is
              communicated during onboarding and may vary by product category. Payment processing fees
              may also apply. Commission rates may be updated with 30 days&apos; notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              5. Order Fulfilment
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>You must process and dispatch orders within 48 hours of receiving an order notification</li>
              <li>Packaging must be adequate to protect the product during transit</li>
              <li>You must update order status promptly in the vendor dashboard</li>
              <li>Repeated failure to fulfil orders may result in account suspension</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              6. Payouts
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Vendor payouts are processed on a regular schedule (weekly or bi-weekly) after deducting
              applicable commissions and fees. Payouts are made via mobile money or bank transfer to the
              account registered in your vendor profile. A minimum payout threshold may apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              7. Returns and Disputes
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Vendors must honour the platform&apos;s Returns &amp; Refund Policy. In case of customer disputes,
              our support team will mediate. If a return is approved, the commission on the returned item
              may be refunded to the vendor. Vendors who repeatedly receive returns due to quality issues
              may face account review.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              8. Prohibited Conduct
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>Selling counterfeit, stolen, or illegally obtained products</li>
              <li>Misrepresenting product quality, origin, or specifications</li>
              <li>Attempting to conduct transactions outside the platform</li>
              <li>Manipulating reviews or ratings</li>
              <li>Violating any applicable Zambian laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              9. Termination
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Either party may terminate the vendor relationship with 14 days&apos; written notice. We may
              immediately suspend or terminate a vendor account for serious policy violations. Upon
              termination, pending orders must still be fulfilled and outstanding payouts will be
              processed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              10. Contact Us
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              For vendor support:<br />
              {siteConfig.company.name}<br />
              {siteConfig.company.address}<br />
              Email: {siteConfig.company.email}<br />
              Phone: {siteConfig.company.phone}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
