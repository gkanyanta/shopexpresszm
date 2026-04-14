import Link from "next/link";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Deals & Offers", href: "/deals" },
    { name: "New Arrivals", href: "/shop?sort=newest" },
    { name: "Buy From Abroad", href: "/buy-for-me" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Sell With Us", href: "/sell-with-us" },
    { name: "Shipping Services", href: "/shipping" },
    { name: "Delivery Info", href: "/delivery-info" },
    { name: "Contact Us", href: "/contact" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Track Order", href: "/track-order" },
    { name: "Payment Info", href: "/payment-info" },
    { name: "Returns & Refunds", href: "/returns" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Delivery Policy", href: "/delivery-policy" },
    { name: "Vendor Terms", href: "/vendor-terms" },
    { name: "Restricted Items", href: "/restricted-items" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      {/* WhatsApp CTA */}
      <div className="bg-green-600 text-white py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-sm">
          <MessageCircle className="h-5 w-5" />
          <span>Need help? Chat with us on WhatsApp</span>
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2 hover:text-green-100"
          >
            {siteConfig.company.whatsapp}
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-white">
                SHOP EXPRESS <span className="text-amber-400">ZM</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 mb-4 max-w-sm">
              {siteConfig.description}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{siteConfig.company.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{siteConfig.company.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{siteConfig.company.email}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h3 className="text-white font-semibold mb-3 text-sm">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-zinc-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">
                Subscribe to our newsletter
              </h3>
              <p className="text-sm text-zinc-400">
                Get deals, new arrivals, and updates delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-64"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold text-sm rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-amber-400 transition-colors lg:hidden"
              >
                {link.name}
              </Link>
            ))}
            <span className="hidden lg:inline">
              Backed by {siteConfig.company.name}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
