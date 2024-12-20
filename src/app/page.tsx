'use client';

import { FeaturesSection } from '@/components/sections/features-section';
import { HeroSection } from '@/components/sections/hero-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { KeyMetricsSection } from '@/components/sections/key-metrics-section';
import { NewsletterSection } from '@/components/sections/newsletter-section';
import { PropertyListingsSection } from '@/components/sections/property-listings-section';

export default function Home() {
  return (
    <div className="bg-gray-50">
      <HeroSection />
      <FeaturesSection />
      <KeyMetricsSection />
      <PropertyListingsSection />
      <HowItWorksSection />
      <NewsletterSection />
    </div>
  );
}
