import { MapPin, Truck, Clock, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";

const deliveryMethods = [
  {
    icon: Truck,
    name: "Standard Delivery",
    description: "2-3 business days within Lusaka",
    price: "From K35",
  },
  {
    icon: Zap,
    name: "Express Delivery",
    description: "Same day or next day in Lusaka",
    price: "From K75",
  },
  {
    icon: MapPin,
    name: "Pickup",
    description: "Collect from our Avondale office",
    price: "Free",
  },
  {
    icon: Clock,
    name: "Nationwide Courier",
    description: "3-7 business days outside Lusaka",
    price: "From K80",
  },
];

export function DeliverySection() {
  return (
    <section className="py-12 md:py-16 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
            Delivery Across Zambia
          </h2>
          <p className="text-zinc-500 mt-2">
            We deliver to Lusaka and all major towns nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {deliveryMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.name}
                className="bg-white rounded-xl p-5 border text-center"
              >
                <div className="inline-flex p-3 bg-amber-50 rounded-lg mb-3">
                  <Icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-zinc-900">{method.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {method.description}
                </p>
                <p className="text-sm font-semibold text-amber-600 mt-2">
                  {method.price}
                </p>
              </div>
            );
          })}
        </div>

        {/* Coverage towns */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-semibold text-zinc-900 mb-3 text-center">
            Towns We Cover
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {siteConfig.deliveryAreas.map((town) => (
              <span
                key={town}
                className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-full text-sm"
              >
                <MapPin className="inline h-3 w-3 mr-1" />
                {town}
              </span>
            ))}
            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              + more towns coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
