"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const CONTENT_KEYS = ["about.foundation.image"];
const DEFAULT_IMAGE = "/assets/about/bgfoundation.png";

export default function FoundationSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const foundationImage = content["about.foundation.image"]?.value ?? DEFAULT_IMAGE;

  return (
    <section className="px-[16px] sm:px-[40px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] bg-[#F5F5F5]">

      {/* ================= Top Heading Row ================= */}
      <FadeIn
        direction="up"
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 mb-12 sm:mb-16 lg:mb-20 items-start"
      >
        <h2 className="text-[28px] sm:text-[34px] lg:text-4xl font-semibold text-[#111] leading-tight">
          Our Foundation of Trust &amp; Innovation
        </h2>

        <p className="text-gray-600 leading-relaxed max-w-xl">
          At FX Acoustics, our values bridge vision with purpose, shaping spaces
          that resonate beyond sound. Integrity, Innovation, Collaboration, and
          Customer-Centricity guide every solution we craft with care.
        </p>
      </FadeIn>

      {/* ================= Cards Section ================= */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 items-start">
        {/* -------- Card 01 -------- */}
        <StaggerItem>
          <div className="bg-white border border-gray-100 p-8 sm:p-9 lg:p-10 h-auto lg:h-[420px] flex flex-col">
            <span className="text-5xl font-light text-[#111]">01</span>

            <h3 className="mt-6 text-xl font-semibold text-[#111]">
              Our Mission
            </h3>

            <p className="mt-4 text-gray-600 leading-relaxed text-sm">
              Our mission at FX Acoustics is to blend functionality with aesthetics
              to create superior acoustic products that enhance the auditory and
              visual experience of any space. We are dedicated to delivering
              exceptional craftsmanship, personalized service, and sustainable
              solutions that exceed expectations.
            </p>
          </div>
        </StaggerItem>

        {/* -------- Card 02 (Image Card) -------- */}
        <StaggerItem>
          <div className="relative h-[300px] sm:h-[360px] lg:h-[420px] overflow-hidden">
            <Image
              src={foundationImage}
              alt="Our Vision — innovative acoustic environments"
              fill
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Text on Image */}
            <div className="absolute bottom-6 sm:bottom-7 lg:bottom-8 left-6 sm:left-7 lg:left-8 right-6 sm:right-7 lg:right-8 text-white">
              <span className="text-5xl font-light">02</span>
              <h3 className="mt-3 text-xl font-semibold">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                At FX Acoustics, we envision becoming the foremost provider of
                innovative and decorative acoustic solutions &mdash; transforming spaces
                into environments that are both aesthetically striking and
                acoustically perfected.
              </p>
            </div>
          </div>
        </StaggerItem>

        {/* -------- Card 03 -------- */}
        <StaggerItem>
          <div className="bg-white border border-gray-100 p-8 sm:p-9 lg:p-10 h-auto lg:h-[420px] flex flex-col">
            <span className="text-5xl font-light text-[#111]">03</span>

            <h3 className="mt-6 text-xl font-semibold text-[#111]">
              Our Values
            </h3>

            <p className="mt-4 text-gray-600 leading-relaxed text-sm">
              At FX Acoustics, our values bridge vision and purpose. Integrity
              builds trust, Innovation drives future-ready solutions, and
              Collaboration empowers us to co-create with architects and clients.
              We remain Customer-Centric, placing aspirations at the heart of
              every design decision.
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
