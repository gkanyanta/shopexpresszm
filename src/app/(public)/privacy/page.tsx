import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Privacy Policy
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
              {siteConfig.company.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your personal
              information when you use {siteConfig.name}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              2. Information We Collect
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li><strong>Personal Information:</strong> Name, email address, phone number, delivery address</li>
              <li><strong>Account Information:</strong> Login credentials, purchase history, wishlist items</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely by third-party providers)</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on site</li>
              <li><strong>Communication Data:</strong> Messages sent through our platform, customer support interactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>To process and fulfil your orders</li>
              <li>To manage your account and provide customer support</li>
              <li>To send order updates, delivery notifications, and receipts</li>
              <li>To improve our platform, products, and services</li>
              <li>To send promotional communications (with your consent)</li>
              <li>To comply with legal obligations under Zambian law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              4. Information Sharing
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 mt-2">
              <li><strong>Vendors:</strong> Name and delivery address to fulfil orders</li>
              <li><strong>Delivery Partners:</strong> Delivery details necessary for shipment</li>
              <li><strong>Payment Processors:</strong> Payment details for transaction processing</li>
              <li><strong>Legal Authorities:</strong> When required by Zambian law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              5. Data Security
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              We implement appropriate technical and organisational measures to protect your personal data
              against unauthorised access, alteration, disclosure, or destruction. This includes SSL encryption,
              secure password hashing, and regular security assessments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              6. Your Rights
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              Under applicable data protection legislation, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              7. Cookies
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, analyse site
              traffic, and personalise content. You can manage cookie preferences through your browser settings.
              Disabling cookies may affect certain features of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly
              collect personal information from children. If we become aware of such collection, we will
              take steps to delete the information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              9. Changes to This Policy
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated revision date. Continued use of our services after changes constitutes
              acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              10. Contact Us
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              For privacy-related inquiries, contact our Data Protection team:<br />
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
