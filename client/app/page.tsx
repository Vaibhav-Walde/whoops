"use client";

import Footer from "@/components/home/Footer";
import CTABanner from "@/components/home/Cta";
import FAQ from "@/components/home/FAQ";
import TechStack from "@/components/home/TechStack";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Stats from "@/components/home/Stats";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <TechStack />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}
