import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mwansa Chanda",
    location: "Lusaka",
    rating: 5,
    text: "I ordered a laptop from the USA through the Buy For Me service. The process was smooth and transparent. Got my MacBook delivered right to my door in Avondale!",
    role: "Customer",
  },
  {
    name: "Thandiwe Mulenga",
    location: "Kitwe",
    rating: 5,
    text: "As a small business owner, SHOP EXPRESS ZM has helped me reach customers beyond my physical shop. My sales have grown significantly since joining as a vendor.",
    role: "Vendor",
  },
  {
    name: "Joseph Banda",
    location: "Ndola",
    rating: 4,
    text: "Fast delivery even to the Copperbelt! I've ordered multiple times and always received my items in great condition. The mobile money payment option is very convenient.",
    role: "Customer",
  },
  {
    name: "Grace Tembo",
    location: "Lusaka",
    rating: 5,
    text: "The international shopping service is a game-changer. I ordered beauty products from the UK and they arrived faster than I expected. Great communication throughout.",
    role: "Customer",
  },
];

export function Testimonials() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
            What Our Customers Say
          </h2>
          <p className="text-zinc-500 mt-2">
            Trusted by shoppers and vendors across Zambia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <Quote className="h-8 w-8 text-amber-200 mb-3" />

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-zinc-600 mb-4 line-clamp-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="border-t pt-3">
                <p className="font-medium text-sm text-zinc-900">
                  {testimonial.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {testimonial.role} &bull; {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
