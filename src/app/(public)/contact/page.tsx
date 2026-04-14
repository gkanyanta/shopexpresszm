import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with SHOP EXPRESS ZM. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-3">Contact Us</h1>
        <p className="text-zinc-500">
          Have a question or need help? We&apos;re here for you. Reach out
          through any of the channels below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex gap-4 p-5 rounded-xl border">
            <div className="p-3 bg-amber-50 rounded-lg h-fit">
              <MapPin className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Office Address</h3>
              <p className="text-sm text-zinc-500 mt-1">
                {siteConfig.company.address}
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-xl border">
            <div className="p-3 bg-amber-50 rounded-lg h-fit">
              <Phone className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Phone</h3>
              <p className="text-sm text-zinc-500 mt-1">
                {siteConfig.company.phone}
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-xl border">
            <div className="p-3 bg-amber-50 rounded-lg h-fit">
              <Mail className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Email</h3>
              <p className="text-sm text-zinc-500 mt-1">
                {siteConfig.company.email}
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-xl border">
            <div className="p-3 bg-green-50 rounded-lg h-fit">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">WhatsApp</h3>
              <p className="text-sm text-zinc-500 mt-1">
                {siteConfig.company.whatsapp}
              </p>
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat Now
                </Button>
              </a>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-xl border">
            <div className="p-3 bg-amber-50 rounded-lg h-fit">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Business Hours</h3>
              <p className="text-sm text-zinc-500 mt-1">
                Monday - Friday: 8:00 AM - 5:00 PM
                <br />
                Saturday: 9:00 AM - 1:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            Send us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">
                Subject
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                placeholder="Your message..."
              />
            </div>
            <Button className="w-full bg-zinc-900 hover:bg-zinc-800">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
