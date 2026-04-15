"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/slides/slide-1.jpg",
    title: "Shop Local.",
    highlight: "Source Global.",
    subtitle: "Deliver Everywhere.",
    description:
      "Your trusted online marketplace for local and international products. Shop from local sellers, request products from the USA, UK & China, and get delivered across Zambia.",
    cta: { label: "Start Shopping", href: "/shop" },
    ctaSecondary: { label: "Buy From Abroad", href: "/buy-for-me" },
  },
  {
    image: "/slides/slide-2.jpg",
    title: "Fresh Deals,",
    highlight: "Every Day.",
    subtitle: "Unbeatable Prices.",
    description:
      "Discover amazing deals on electronics, fashion, beauty products, and more from verified local vendors across Zambia.",
    cta: { label: "View Deals", href: "/deals" },
    ctaSecondary: { label: "Browse Categories", href: "/categories" },
  },
  {
    image: "/slides/slide-3.jpg",
    title: "Can't Find It",
    highlight: "Locally?",
    subtitle: "We'll Get It For You.",
    description:
      "Use our Buy For Me service to order products from the USA, UK, and China. We handle purchasing, shipping, and delivery right to your door.",
    cta: { label: "Buy For Me", href: "/buy-for-me" },
    ctaSecondary: { label: "Learn More", href: "/shipping" },
  },
  {
    image: "/slides/slide-4.jpg",
    title: "Sell Your",
    highlight: "Products",
    subtitle: "To All of Zambia.",
    description:
      "Join as a vendor and reach thousands of customers nationwide. Easy setup, powerful tools, and reliable delivery through Inland Express.",
    cta: { label: "Start Selling", href: "/sell-with-us" },
    ctaSecondary: { label: "Vendor Info", href: "/vendor-terms" },
  },
  {
    image: "/slides/slide-5.jpg",
    title: "Fast & Reliable",
    highlight: "Delivery.",
    subtitle: "All 10 Provinces.",
    description:
      "Powered by Inland Express Zambia's nationwide logistics network. Same-day delivery in Lusaka, express delivery across all provinces.",
    cta: { label: "Shop Now", href: "/shop" },
    ctaSecondary: { label: "Delivery Info", href: "/delivery-info" },
  },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden bg-zinc-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
        >
          {/* Background image */}
          <Image
            src={slide.image}
            alt={`${slide.title} ${slide.highlight}`}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-900/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm mb-6">
            <Globe className="h-4 w-4" />
            Powered by Inland Express Zambia
          </div>

          {slides.map((slide, index) => (
            <div
              key={index}
              className="transition-all duration-700 ease-in-out"
              style={{
                opacity: index === current ? 1 : 0,
                transform: index === current ? "translateY(0)" : "translateY(20px)",
                position: index === current ? "relative" : "absolute",
                pointerEvents: index === current ? "auto" : "none",
              }}
            >
              {index === current && (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 text-white">
                    {slide.title}{" "}
                    <span className="text-amber-400">{slide.highlight}</span>
                  </h1>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                    {slide.subtitle}
                  </p>
                  <p className="text-base md:text-lg text-zinc-300 mb-8 max-w-xl">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={slide.cta.href}>
                      <Button
                        size="lg"
                        className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold text-base w-full sm:w-auto"
                      >
                        {slide.cta.label}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href={slide.ctaSecondary.href}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-zinc-500 text-white hover:bg-white/10 text-base w-full sm:w-auto"
                      >
                        {slide.ctaSecondary.label}
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? "w-8 h-2.5 bg-amber-400"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom feature bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-zinc-900/90 to-transparent pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 backdrop-blur-sm rounded-lg border border-amber-500/20">
                <Truck className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-white">Nationwide Delivery</p>
                <p className="text-xs text-zinc-400">Lusaka & all provinces</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 backdrop-blur-sm rounded-lg border border-amber-500/20">
                <Globe className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-white">International Sourcing</p>
                <p className="text-xs text-zinc-400">USA, UK & China</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 backdrop-blur-sm rounded-lg border border-amber-500/20">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-white">Secure Payments</p>
                <p className="text-xs text-zinc-400">Card & mobile money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
