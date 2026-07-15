import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Services from "@/components/home/Services";
import Highlights from "@/components/home/Highlights";
import Statistics from "@/components/home/Statistics";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Newsletter from "@/components/home/Newsletter";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Services />
      <Highlights />
      <Statistics />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <CTA />
    </>
  );
}