import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureStrip from "@/components/landing/FeatureStrip";
import HowItWorks from "@/components/landing/HowItWorks";
import AICompanions from "@/components/landing/AICompanions";
import ScienceBanner from "@/components/landing/ScienceBanner";
import Testimonials from "@/components/landing/Testimonials";
import CTAFooter from "@/components/landing/CTAFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <HeroSection />
      <FeatureStrip />
      <HowItWorks />
      <AICompanions />
      <ScienceBanner />
      <Testimonials />
      <CTAFooter />
    </main>
  );
}
