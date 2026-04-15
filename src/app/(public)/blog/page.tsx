import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Newspaper, Tag, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog & Deals",
  description: `Latest news, deals, and offers from ${siteConfig.name}.`,
};

const samplePosts = [
  {
    id: 1,
    title: "Top 10 Gadgets to Import from the USA in 2026",
    excerpt:
      "Discover the most popular tech gadgets Zambian shoppers are ordering through our Buy For Me service.",
    category: "Buy For Me",
    date: "Coming Soon",
    image: null,
  },
  {
    id: 2,
    title: "How to Get the Best Deals on SHOP EXPRESS ZM",
    excerpt:
      "Tips and tricks for finding the best prices, using coupons, and catching flash sales on our platform.",
    category: "Tips",
    date: "Coming Soon",
    image: null,
  },
  {
    id: 3,
    title: "Supporting Zambian Vendors: Local Business Spotlight",
    excerpt:
      "Meet the amazing local businesses and vendors who sell on our marketplace.",
    category: "Community",
    date: "Coming Soon",
    image: null,
  },
  {
    id: 4,
    title: "Summer Fashion Deals - Up to 50% Off",
    excerpt:
      "Browse the latest fashion deals from local and international brands available on our platform.",
    category: "Deals",
    date: "Coming Soon",
    image: null,
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          Blog &amp; <span className="text-amber-500">Deals</span>
        </h1>
        <p className="text-lg text-zinc-600">
          Stay updated with the latest news, shopping tips, and exclusive deals
          from {siteConfig.name}.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 md:p-12 text-center mb-12">
        <div className="inline-flex p-3 bg-amber-100 rounded-full mb-4">
          <Newspaper className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-3">
          Full Blog Coming Soon!
        </h2>
        <p className="text-zinc-600 max-w-lg mx-auto mb-4">
          We&apos;re working on bringing you shopping guides, deal alerts, vendor
          spotlights, and more. In the meantime, check out some of the content
          we have planned.
        </p>
        <Link href="/deals">
          <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
            <Tag className="h-4 w-4 mr-1.5" />
            View Current Deals
          </Button>
        </Link>
      </div>

      {/* Sample Posts */}
      <h2 className="text-xl font-bold text-zinc-900 mb-6">
        Upcoming Articles
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {samplePosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-[16/10] bg-zinc-100 flex items-center justify-center">
              <Newspaper className="h-10 w-10 text-zinc-300" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.date}
                </span>
              </div>
              <h3 className="font-semibold text-zinc-900 text-sm line-clamp-2 mb-1">
                {post.title}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 bg-zinc-900 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          Don&apos;t Miss Our Deals
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-6">
          Follow us on WhatsApp to get notified about flash sales, new arrivals,
          and exclusive discounts.
        </p>
        <a
          href={siteConfig.links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Join WhatsApp Updates
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
