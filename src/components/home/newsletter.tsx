"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-12 md:py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
            <Mail className="h-6 w-6 text-amber-600" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
            Stay Updated
          </h2>
          <p className="text-zinc-600 mb-6">
            Subscribe for exclusive deals, new arrivals, and updates from SHOP
            EXPRESS ZM
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
              Thank you for subscribing! You&apos;ll receive our latest updates
              and offers.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-6"
              >
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-xs text-zinc-400 mt-3">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
