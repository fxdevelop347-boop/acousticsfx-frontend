"use client";

import { useEffect, useState } from "react";
import Image from "@/components/shared/SmartImage";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const CONTENT_KEYS = [
  "about.foundation.heading",
  "about.foundation.subtitle",
  "about.foundation.card1Title",
  "about.foundation.card1Desc",
  "about.foundation.image1",
  "about.foundation.card2Title",
  "about.foundation.card2Desc",
  "about.foundation.image2",
  "about.foundation.card3Title",
  "about.foundation.card3Desc",
  "about.foundation.image3",
];

const DEFAULTS: Record<string, string> = {
  "about.foundation.heading": "Our Foundation of Trust & Innovation",
  "about.foundation.subtitle":
    "At FX Acoustics, our values bridge vision with purpose, shaping spaces that resonate beyond sound. Integrity, Innovation, Collaboration, and Customer-Centricity guide every solution we craft with care.",
  "about.foundation.card1Title": "Our Mission",
  "about.foundation.card1Desc":
    "Our mission at FX Acoustics is to blend functionality with aesthetics to create superior acoustic products that enhance the auditory and visual experience of any space. We are dedicated to delivering exceptional craftsmanship, personalized service, and sustainable solutions that exceed expectations.",
  "about.foundation.image1": "/assets/about/Image (4).png",
  "about.foundation.card2Title": "Our Vision",
  "about.foundation.card2Desc":
    "At FX Acoustics, we envision becoming the foremost provider of innovative and decorative acoustic solutions \u2014 transforming spaces into environments that are both aesthetically striking and acoustically perfected.",
  "about.foundation.image2": "/assets/about/bgfoundation.png",
  "about.foundation.card3Title": "Our Values",
  "about.foundation.card3Desc":
    "At FX Acoustics, our values bridge vision and purpose. Integrity builds trust, Innovation drives future-ready solutions, and Collaboration empowers us to co-create with architects and clients. We remain Customer-Centric, placing aspirations at the heart of every design decision.",
  "about.foundation.image3": "/assets/about/6d475af8e833a39bf05332dcf051bd2d05e4d822.png",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function FoundationSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const cards = [
    {
      number: "01",
      title: val(content, "about.foundation.card1Title"),
      description: val(content, "about.foundation.card1Desc"),
      image: val(content, "about.foundation.image1"),
    },
    {
      number: "02",
      title: val(content, "about.foundation.card2Title"),
      description: val(content, "about.foundation.card2Desc"),
      image: val(content, "about.foundation.image2"),
    },
    {
      number: "03",
      title: val(content, "about.foundation.card3Title"),
      description: val(content, "about.foundation.card3Desc"),
      image: val(content, "about.foundation.image3"),
    },
  ];

  return (
    <section className="px-4 sm:px-[40px] lg:px-[100px] py-8 sm:py-12 lg:py-16 bg-[#F5F5F5]">
      <FadeIn
        direction="up"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 mb-6 sm:mb-12 lg:mb-14 items-start"
      >
        <h2 className="text-lg sm:text-[28px] lg:text-[32px] font-semibold text-[#111] leading-snug sm:leading-tight">
          {val(content, "about.foundation.heading")}
        </h2>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
          {val(content, "about.foundation.subtitle")}
        </p>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12 lg:gap-16 items-start">
        {cards.map((card) => (
          <StaggerItem key={card.number}>
            <div className="group relative h-auto lg:h-[420px] min-h-[260px] sm:min-h-[320px] overflow-hidden border border-gray-100 bg-white p-5 sm:p-9 lg:p-10 transition-all duration-500">
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
              </div>

              <div className="relative z-10 flex h-full flex-col transition-colors duration-500">
                <span className="text-4xl sm:text-5xl font-light text-[#111] transition-colors duration-500 group-hover:text-white">
                  {card.number}
                </span>

                <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-[#111] transition-colors duration-500 group-hover:text-white">
                  {card.title}
                </h3>

                <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-gray-600 transition-colors duration-500 group-hover:text-white/90">
                  {card.description}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}