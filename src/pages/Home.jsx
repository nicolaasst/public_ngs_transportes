import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import WhyUsSection from "@/components/home/WhyUsSection";
import CoverageMap from "@/components/home/CoverageMap";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import CTABanner from "@/components/home/CTABanner";
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesGrid />
        <WhyUsSection />
        <CoverageMap />
        <Testimonials />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}