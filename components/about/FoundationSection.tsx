"use client";

import { useEffect, useState } from "react";
import Image from "@/components/shared/SmartImage";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const CONTENT_KEYS = [
  "about.foundation.image1",
  "about.foundation.image2",
  "about.foundation.image3",
];

const DEFAULT_IMAGE_1 = "/assets/about/Image (4).png";
const DEFAULT_IMAGE_2 = "/assets/about/bgfoundation.png";
const DEFAULT_IMAGE_3 = "/assets/about/6d475af8e833a39bf05332dcf051bd2d05e4d822.png";

export default function FoundationSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const foundationImage1 =
    content["about.foundation.image1"]?.value ?? DEFAULT_IMAGE_1;

  const foundationImage2 =
    content["about.foundation.image2"]?.value ?? DEFAULT_IMAGE_2;

  const foundationImage3 =
    content["about.foundation.image3"]?.value ?? DEFAULT_IMAGE_3;

  const cards = [
    {
      number: "01",
      title: "Our Mission",
      description:
        "Our mission at FX Acoustics is to blend functionality with aesthetics to create superior acoustic products that enhance the auditory and visual experience of any space. We are dedicated to delivering exceptional craftsmanship, personalized service, and sustainable solutions that exceed expectations.",
      image: foundationImage1,
    },
    {
      number: "02",
      title: "Our Vision",
      description:
        "At FX Acoustics, we envision becoming the foremost provider of innovative and decorative acoustic solutions — transforming spaces into environments that are both aesthetically striking and acoustically perfected.",
      image: foundationImage2,
    },
    {
      number: "03",
      title: "Our Values",
      description:
        "At FX Acoustics, our values bridge vision and purpose. Integrity builds trust, Innovation drives future-ready solutions, and Collaboration empowers us to co-create with architects and clients. We remain Customer-Centric, placing aspirations at the heart of every design decision.",
      image: foundationImage3,
    },
  ];

  return (
    <section className="px-4 sm:px-[40px] lg:px-[100px] py-10 sm:py-[80px] lg:py-[100px] bg-[#F5F5F5]">
      <FadeIn
        direction="up"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-14 lg:gap-20 mb-8 sm:mb-16 lg:mb-20 items-start"
      >
        <h2 className="text-xl sm:text-[34px] lg:text-4xl font-semibold text-[#111] leading-snug sm:leading-tight">
          Our Foundation of Trust &amp; Innovation
        </h2>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
          At FX Acoustics, our values bridge vision with purpose, shaping spaces
          that resonate beyond sound. Integrity, Innovation, Collaboration, and
          Customer-Centricity guide every solution we craft with care.
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