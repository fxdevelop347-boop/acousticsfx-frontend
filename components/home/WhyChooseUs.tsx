"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "@/components/animations";

interface CardData {
  icon: string;
  title: string;
  description: string;
}

const CONTENT_KEYS = [
  "home.whyChooseUs.icon1",
  "home.whyChooseUs.icon2",
  "home.whyChooseUs.icon3",
  "home.whyChooseUs.icon4",
  "home.whyChooseUs.icon5",
  "home.whyChooseUs.icon6",
];

const DEFAULT_CARDS: CardData[] = [
  {
    icon: "/assets/home/quaone.svg",
    title: "Quality",
    description:
      "Every FX Acoustics creation begins with a pursuit of perfection. Our acoustical panels, soundproofing systems, and architectural façades are crafted with meticulous precision, using premium materials that promise enduring performance and timeless elegance. Quality isn’t an aspect—it is our identity.",
  },
  {
    icon: "/assets/home/quatwo.svg",
    title: "Service",
    description:
      "We believe exceptional spaces are built on exceptional support. From acoustic consultation to manufacturing and installation, our service experience is seamless, attentive, and deeply personalized. We guide you at every step, ensuring your project unfolds effortlessly with absolute precision.",
  },
  {
    icon: "/assets/home/quathr.svg",
    title: "Innovation",
    description:
      "Innovation fuels our artistry. Through advanced acoustic engineering, state-of-the-art manufacturing, and globally inspired design, we create solutions that elevate environments—enhancing clarity, comfort, and visual harmony. Each product is a fusion of technology and refined craftsmanship.",
  },
  {
    icon: "/assets/home/quafour.svg",
    title: "Commitment",
    description:
      "Our commitment extends beyond delivery—it lives in every detail we stand behind. We honor every project with integrity, consistency, and an unwavering dedication to excellence, ensuring that each space benefits from long-lasting acoustic and architectural value.",
  },
  {
    icon: "/assets/home/quafive.svg",
    title: "Trustability",
    description:
      "Trust is earned through honesty and flawless execution. Over the years, architects, designers, corporates, and institutions have chosen us for our transparency, reliability, and manufacturing consistency. With FX Acoustics, what you envision is exactly what you receive—crafted with care and delivered with certainty.",
  },
  {
    icon: "/assets/home/quasix.svg",
    title: "Bespoke",
    description:
      "Luxury lies in customization. Our bespoke acoustical panels and tailor-made façade systems are designed to reflect your individual vision, architecture, and sensory experience. From texture to tone, every element is shaped with intention—creating spaces that sound exquisite and look extraordinary.",
  },
];

export default function WhyChooseUs() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const cards = DEFAULT_CARDS.map((card, i) => ({
    ...card,
    icon: content[CONTENT_KEYS[i]]?.value ?? card.icon,
  }));

  return (
    <section className="px-6 sm:px-10 lg:px-[100px] py-[80px] lg:py-[100px] bg-white">
      {/* Heading */}
      <FadeIn direction="up" duration={0.6} className="max-w-4xl mb-12 lg:mb-16">
        <p className="text-[15px] mb-3 text-gray-600 worksans-font font-bold">
          Why Choose Us
        </p>

        <h2 className="text-[18px] sm:text-[34px] lg:text-[40px] font-bold sm:leading-tight text-gray-900 axiforma">
          We Cut Through Noise to create architects that are thoughtful, timeless & Impactful.
        </h2>
      </FadeIn>

      {/* Cards Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {cards.map((card) => (
          <StaggerItem key={card.title} direction="up">
            <HoverScale className="group rounded-2xl border border-gray-100 p-6 shadow-sm bg-white">
              <div className="w-12 h-12 rounded-full bg-[#eaf4f6] group-hover:bg-[#3090A3] transition-all duration-300 flex items-center justify-center mb-4">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={32}
                  height={30}
                  className="transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                />
              </div>
              <h3 className="font-bold text-[25px] mb-2 text-[#1F6775] inter-font">
                {card.title}
              </h3>
              <p className="text-[18px] text-gray-600 leading-relaxed inter-font font-[400]">
                {card.description}
              </p>
            </HoverScale>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}