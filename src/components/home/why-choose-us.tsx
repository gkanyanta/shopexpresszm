import {
  Truck,
  ShieldCheck,
  Globe,
  CreditCard,
  Headphones,
  Package,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "From Lusaka to every province in Zambia. Fast, reliable delivery to your doorstep.",
  },
  {
    icon: Globe,
    title: "International Sourcing",
    description:
      "Request products from the USA, UK, and China. We buy and ship it to you.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Sellers",
    description:
      "All vendors are verified and approved. Shop with confidence from local businesses.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description:
      "Pay by card, mobile money, or bank transfer. Secure and convenient options.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Chat with us on WhatsApp or email. We're here to help with every order.",
  },
  {
    icon: Package,
    title: "Logistics Expertise",
    description:
      "Backed by Inland Express Zambia with years of shipping and logistics experience.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
            Why Shop With Us
          </h2>
          <p className="text-zinc-500 mt-2 max-w-2xl mx-auto">
            SHOP EXPRESS ZM combines the convenience of online shopping with the
            reliability of Inland Express Zambia&apos;s logistics network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex gap-4 p-6 rounded-xl border bg-white hover:shadow-md transition-shadow"
              >
                <div className="shrink-0">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <Icon className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
