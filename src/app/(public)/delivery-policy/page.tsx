import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Delivery Policy",
  description: `Delivery policy for ${siteConfig.name}.`,
};

export default function DeliveryPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Delivery Policy
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Last updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              1. Delivery Coverage
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {siteConfig.name} delivers to all ten provinces of Zambia. Our primary delivery
              hubs are located in Lusaka, with partner networks in {siteConfig.deliveryAreas.join(", ")},
              and other major towns. Delivery to rural areas may require additional time and fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              2. Delivery Methods
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li><strong>Standard Delivery:</strong> Orders are dispatched within 24-48 hours of payment confirmation and delivered within the estimated timeframe for your zone.</li>
              <li><strong>Express Delivery:</strong> Available for select areas at an additional fee. Orders are prioritised and delivered faster than standard.</li>
              <li><strong>Pickup:</strong> Collect your order free of charge from our office at {siteConfig.company.address}. Orders are available for pickup within 24 hours of confirmation.</li>
              <li><strong>Nationwide Courier:</strong> For remote or hard-to-reach areas, we partner with national courier services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              3. Delivery Timeframes
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              Estimated delivery times begin from the date of dispatch, not the date of order. Typical timeframes are:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>Lusaka: 1-3 business days</li>
              <li>Copperbelt &amp; Central Province: 3-5 business days</li>
              <li>Other provinces: 5-8 business days</li>
              <li>International Buy For Me orders: 7-60 business days depending on shipping method</li>
            </ul>
            <p className="text-zinc-500 text-xs mt-2">
              Timeframes are estimates and not guaranteed. Delays may occur due to weather, public holidays, or other factors beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              4. Delivery Fees
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Delivery fees are calculated based on your delivery zone, package weight, and chosen delivery method.
              Fees are displayed at checkout before payment. We offer free standard delivery within Lusaka for
              orders above K500. Delivery fees are non-refundable unless the order is cancelled due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              5. Order Tracking
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Once your order is dispatched, you will receive tracking information via email and SMS.
              You can also track your order status in your dashboard. For real-time updates, contact
              our support team via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              6. Delivery Acceptance
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              A valid recipient must be present at the delivery address to accept the package. We may
              require identification for high-value orders. If no one is available, the driver will
              attempt redelivery or leave instructions for pickup. Failed delivery attempts due to
              the recipient&apos;s unavailability may incur additional charges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              7. Damaged Deliveries
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Please inspect your package upon delivery. If the package appears damaged, note this
              with the delivery driver and contact us within 48 hours with photos of the damage.
              We will arrange a replacement or refund in accordance with our Returns &amp; Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              8. Contact Us
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              For delivery inquiries:<br />
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
