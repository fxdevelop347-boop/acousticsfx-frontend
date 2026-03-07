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
  { icon: "/assets/home/quaone.svg", title: "Quality", description: "Uncompromising craftsmanship meets lasting performance. Every detail is engineered for excellence and trust." },
  { icon: "/assets/home/quatwo.svg", title: "Service", description: "We deliver end-to-end acoustic, flooring, and soundproofing solutions reliable, precise, and built to last." },
  { icon: "/assets/home/quathr.svg", title: "Innovation", description: "Made from the finest raw materials, our panels enhance your space with elegance while promoting healthy living." },
  { icon: "/assets/home/quafour.svg", title: "Commitment", description: "We stand by every project with unwavering dedication, ensuring excellence, reliability, and lasting impact." },
  { icon: "/assets/home/quafive.svg", title: "Trustability", description: "We deliver on every promise with transparency and consistency, earning confidence that lasts a lifetime." },
  { icon: "/assets/home/quasix.svg", title: "Bespoke", description: "Tailored acoustic solutions designed to fit your unique space, vision, and lifestyle with precision." },
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

        <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold leading-tight text-gray-900 axiforma">
          We Cut Through Noise to create architects
          <br />
          that are thoughtful, timeless & Impactful.
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
