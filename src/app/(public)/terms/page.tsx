import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Last updated: January 2026
        </p>

        <div className="prose prose-zinc max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              1. Introduction
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Welcome to {siteConfig.name}, operated by {siteConfig.company.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
              By accessing or using our website and services, you agree to be bound by these Terms &amp; Conditions.
              If you do not agree with any part of these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              2. Eligibility
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              You must be at least 18 years of age to use our services. By creating an account, you represent
              that you are of legal age and have the capacity to enter into a binding agreement under Zambian law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              3. Account Registration
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree to
              provide accurate and complete information during registration and to update your information as needed.
              You are responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              4. Products and Pricing
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              All prices are displayed in Zambian Kwacha ({siteConfig.currency.code}) and include applicable taxes
              unless otherwise stated. We reserve the right to modify prices at any time without prior notice.
              Product availability is subject to change. We make every effort to display accurate product
              descriptions and images, but we do not warrant that descriptions are error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              5. Orders and Payment
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              An order constitutes an offer to purchase. We reserve the right to accept or decline any order.
              Payment must be completed before order processing begins, unless otherwise agreed. We accept
              mobile money, card payments, and bank transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              6. Buy For Me Service
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Our Buy For Me service allows customers to request products from international markets. Quotes
              provided are estimates and may vary based on exchange rates, shipping costs, and customs duties.
              By accepting a quote, you agree to the total cost including product price, shipping, and service fees.
              International orders are subject to customs regulations and may experience delays.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              7. Delivery
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Delivery times are estimates and not guaranteed. We are not liable for delays caused by
              circumstances beyond our control, including weather, road conditions, or customs processes.
              Risk of loss passes to you upon delivery to the specified address.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              8. Intellectual Property
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              All content on this platform, including logos, text, graphics, and software, is the property
              of {siteConfig.company.name} or its licensors and is protected by Zambian and international
              intellectual property laws. You may not reproduce, distribute, or create derivative works
              without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              9. Limitation of Liability
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              To the maximum extent permitted by Zambian law, {siteConfig.company.name} shall not be liable
              for any indirect, incidental, special, or consequential damages arising from your use of our
              services. Our total liability shall not exceed the amount paid for the specific order in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              10. Governing Law
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the Republic
              of Zambia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Zambia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              11. Contact Us
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              If you have questions about these Terms &amp; Conditions, contact us at:<br />
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
