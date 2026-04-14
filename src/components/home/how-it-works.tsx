import { Search, ShoppingCart, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Discover",
    description:
      "Explore products from local sellers or request items from international stores.",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Add to Cart",
    description:
      "Select your items, choose quantities, and add them to your shopping cart.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Pay Securely",
    description:
      "Check out using card, mobile money, or bank transfer. All payments are secure.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Get Delivered",
    description:
      "Sit back and relax. We deliver to Lusaka and across Zambia right to your door.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-zinc-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
          <p className="text-zinc-400 mt-2">
            Shopping on SHOP EXPRESS ZM is simple
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="text-center relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-zinc-700" />
                )}

                <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl mb-4 relative">
                  <Icon className="h-8 w-8 text-amber-400" />
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-zinc-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
