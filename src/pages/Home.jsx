import PageShell from "@/components/layout/PageShell";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesGrid from "@/components/home/ServicesGrid";
import WhyUsSection from "@/components/home/WhyUsSection";
import FAQSection from "@/components/home/FAQSection";
import CTABanner from "@/components/home/CTABanner";

export default function Home() {
  return (
    <PageShell titulo="Logística terrestre e last mile">
      <HeroSection />
      <HowItWorks />
      <ServicesGrid />
      <WhyUsSection />
      <FAQSection />
      <CTABanner />
    </PageShell>
  );
}
