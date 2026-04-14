import type { Metadata } from "next";
import { db } from "@/lib/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about SHOP EXPRESS ZM — orders, payments, delivery, and more.",
};

export default async function FAQPage() {
  const faqs = await db.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const grouped = faqs.reduce(
    (acc, faq) => {
      const cat = faq.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(faq);
      return acc;
    },
    {} as Record<string, typeof faqs>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-500">
          Find answers to common questions about shopping, payments, delivery,
          and more.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">
              {category}
            </h2>
            <Accordion>
              {items.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left text-sm">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-zinc-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Still need help */}
      <div className="mt-12 bg-zinc-50 rounded-xl p-8 text-center max-w-2xl mx-auto">
        <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Still have questions?
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          Chat with us on WhatsApp for immediate assistance
        </p>
        <a
          href={siteConfig.links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
