import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Returns & Refund Policy",
  description: `Returns and refund policy for ${siteConfig.name}.`,
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Returns &amp; Refund Policy
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Last updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              1. Return Eligibility
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              You may request a return within 7 days of receiving your order, provided:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>The item is in its original, unused condition with all tags and packaging intact</li>
              <li>You have proof of purchase (order number or receipt)</li>
              <li>The item is not a perishable good, personalised item, or hygiene product</li>
              <li>The item was not purchased through the Buy For Me service (see section 5)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              2. How to Request a Return
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600">
              <li>Contact us at {siteConfig.company.email} or via WhatsApp with your order number</li>
              <li>Describe the reason for the return and include photos if the item is damaged or defective</li>
              <li>Our team will review your request within 2 business days</li>
              <li>If approved, we will provide return instructions and arrange pickup or drop-off</li>
              <li>Return the item in its original packaging</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              3. Refund Process
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              Once we receive and inspect the returned item:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>Refunds are processed within 5-10 business days</li>
              <li>Refunds are returned to the original payment method</li>
              <li>Mobile money refunds are typically processed within 3-5 business days</li>
              <li>Card refunds may take up to 10 business days depending on your bank</li>
              <li>Delivery fees are non-refundable unless the return is due to our error</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              4. Damaged or Defective Items
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              If you receive a damaged or defective item, please contact us within 48 hours of delivery.
              Include clear photos of the damage. We will arrange a replacement or full refund at no
              additional cost to you, including return shipping fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              5. Buy For Me Orders
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Items purchased through our Buy For Me service are generally non-refundable due to the
              international nature of the transaction. However, if the item received is significantly
              different from what was described or is defective, we will work with you to find a
              satisfactory resolution on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              6. Exchanges
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              We offer exchanges for items of equal or greater value (subject to price difference payment).
              Exchange requests follow the same process as returns. The replacement item will be shipped
              once the original item is received and inspected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              7. Non-Returnable Items
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>Perishable goods (food, flowers)</li>
              <li>Personal hygiene products (cosmetics, underwear)</li>
              <li>Customised or personalised items</li>
              <li>Downloaded digital products</li>
              <li>Items marked as &quot;Final Sale&quot;</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              8. Contact Us
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              For return and refund inquiries:<br />
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
