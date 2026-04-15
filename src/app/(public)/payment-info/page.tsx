import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Lock,
  HelpCircle,
  CheckCircle2,
  Banknote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Information",
  description:
    "Accepted payment methods and secure payment information for SHOP EXPRESS ZM.",
};

export default function PaymentInfoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          Payment <span className="text-amber-500">Information</span>
        </h1>
        <p className="text-lg text-zinc-600">
          We offer multiple secure payment options for your convenience.
        </p>
      </div>

      {/* Payment Methods */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          {
            icon: Smartphone,
            title: "Mobile Money",
            desc: "Pay via Airtel Money, MTN Mobile Money, or Zamtel Kwacha. Instant confirmation.",
            color: "bg-green-50 text-green-600",
          },
          {
            icon: CreditCard,
            title: "Card Payment",
            desc: "Visa and Mastercard accepted. Processed securely through our payment gateway.",
            color: "bg-blue-50 text-blue-600",
          },
          {
            icon: Building2,
            title: "Bank Transfer",
            desc: "Direct bank transfer to our Zambian bank account. Allow 1-2 business days for confirmation.",
            color: "bg-purple-50 text-purple-600",
          },
          {
            icon: Banknote,
            title: "Cash on Pickup",
            desc: "Pay in cash when you collect your order from our Lusaka office.",
            color: "bg-amber-50 text-amber-600",
          },
        ].map((method) => {
          const Icon = method.icon;
          return (
            <div key={method.title} className="bg-white rounded-xl border p-6 text-center">
              <div
                className={`inline-flex p-3 rounded-lg mb-4 ${method.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                {method.title}
              </h3>
              <p className="text-sm text-zinc-600">{method.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Security */}
      <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 mb-16 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Lock className="h-10 w-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Secure Payments</h2>
          <p className="text-zinc-400 mb-8">
            Your payment information is always protected. We use industry-standard
            encryption and never store your card details on our servers.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "SSL Encrypted",
                desc: "All transactions are secured with 256-bit SSL encryption.",
              },
              {
                icon: Lock,
                title: "PCI Compliant",
                desc: "Card payments processed through PCI-DSS compliant gateways.",
              },
              {
                icon: CheckCircle2,
                title: "Verified Payments",
                desc: "All payments are verified before order processing begins.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <Icon className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How to Pay */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">
          How to Pay
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              Mobile Money
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600">
              <li>Select &quot;Mobile Money&quot; as your payment method at checkout</li>
              <li>Choose your provider (Airtel Money, MTN, or Zamtel)</li>
              <li>Enter your mobile money number</li>
              <li>Approve the payment prompt on your phone</li>
              <li>You&apos;ll receive a confirmation SMS and email once payment is processed</li>
            </ol>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Bank Transfer
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600">
              <li>Select &quot;Bank Transfer&quot; at checkout</li>
              <li>Note the bank details and reference number provided</li>
              <li>Make the transfer from your bank account or at a bank branch</li>
              <li>Upload proof of payment or notify us via WhatsApp</li>
              <li>Your order will be processed once payment is confirmed (1-2 business days)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-zinc-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 text-center flex items-center justify-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          Payment FAQs
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "What currency do you accept?",
              a: `All prices are displayed in Zambian Kwacha (${siteConfig.currency.code}). We accept payments in ZMW only.`,
            },
            {
              q: "When will I be charged?",
              a: "For card and mobile money payments, you are charged immediately at checkout. For bank transfers, you must complete the transfer within 48 hours or the order will be cancelled.",
            },
            {
              q: "Can I get a refund?",
              a: "Yes, refunds are processed according to our Returns & Refund Policy. Refunds are returned to the original payment method within 5-10 business days.",
            },
            {
              q: "Is my payment information safe?",
              a: "Absolutely. We never store card details on our servers. All transactions are encrypted and processed through certified payment providers.",
            },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-lg p-4 border">
              <h3 className="font-medium text-zinc-900 text-sm">{faq.q}</h3>
              <p className="text-sm text-zinc-600 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
