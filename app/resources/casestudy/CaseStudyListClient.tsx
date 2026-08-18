"use client";

import CaseStudySection from "@/components/resources/CaseStudySection";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";

export default function CaseStudyListClient() {
  return (
    <>
      <CaseStudySection
        image="/assets/product/product-hero.png"
        bgColor="white"
        reverse={false}
        imageAlt="Large open office interior with FX Acoustics wood acoustic ceiling and wall panels"
      />

      <CaseStudySection
        image="/assets/product/product-card-1.png"
        bgColor="light-blue"
        reverse={true}
        showIntroHeader={false}
        imageAlt="Conference and collaboration space with fabric-wrapped acoustic wall panels"
        cardTitle="Collaboration Zones & Meeting Suites"
        cardDescription="Targeted acoustic treatment for open-plan collaboration areas—balancing speech intelligibility and privacy using fabric panels, ceiling baffles, and calibrated absorption."
      />

      <CaseStudySection
        image="/assets/product/product-card-6.png"
        bgColor="white"
        reverse={false}
        showIntroHeader={false}
        imageAlt="Hospitality lounge seating area with decorative acoustic wall finishes"
        cardTitle="Hospitality & Guest Experience"
        cardDescription="Premium finishes with performance-grade acoustic control for restaurants and hotel public areas—reducing crowd noise while preserving warm, inviting interiors."
      />

      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
