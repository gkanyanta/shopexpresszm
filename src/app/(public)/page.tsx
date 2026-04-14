import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { HowItWorks } from "@/components/home/how-it-works";
import { InternationalSection } from "@/components/home/international-section";
import { DeliverySection } from "@/components/home/delivery-section";
import { VendorCTA } from "@/components/home/vendor-cta";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <HowItWorks />
      <InternationalSection />
      <DeliverySection />
      <VendorCTA />
      <Testimonials />
      <Newsletter />
    </>
  );
}
