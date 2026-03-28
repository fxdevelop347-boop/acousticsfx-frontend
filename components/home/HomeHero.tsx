"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

const CONTENT_KEYS = [
  "home.hero.title",
  "home.hero.subtitle",
  "home.hero.button1Label",
  "home.hero.button2Label",
  "home.hero.backgroundImage",
  "home.hero.featureBoxes",
];

const DEFAULTS: Record<string, string> = {
  "home.hero.title":
    "We take pride in building stylish and featured acoustic solution.",
  "home.hero.subtitle":
    "Our solutions are engineered for clarity, comfort, and visual harmony. Whether it's a studio, auditorium, or workspace, we bring together design precision and acoustic mastery to elevate every square foot.",
  "home.hero.button1Label": "Get Quote →",
  "home.hero.button2Label": "Connect With Us →",
  "home.hero.backgroundImage": "/assets/home/background.png",
};

interface FeatureBox {
  title: string;
  description: string;
  image: string;
  accentColor: string;
}

const DEFAULT_FEATURE_BOXES: FeatureBox[] = [
  {
    title: "Acoustic Solution",
    description:
      "Premium acoustical solutions crafted to enhance clarity, reduce echo, and elevate the ambience of any space. Ideal for offices, hotels, residences, studios, auditoriums, and wellness environments, our panels blend design with performance to create interiors that sound as refined as they look.",
    image: "/assets/home/fi_11062015.png",
    accentColor: "yellow-400",
  },
  {
    title: "Hard wood Flooring",
    description:
      "Timeless, elegant, and crafted for durability, our hardwood flooring brings natural warmth and architectural luxury to any interior. Designed for high-end homes, hospitality spaces, offices, and premium commercial environments, Fx Acoustics’ real wooden flooring delivers refined aesthetics with exceptional performance and long-lasting comfort.",
    image: "/assets/home/fi_7821525.png",
    accentColor: "orange-400",
  },
  {
    title: "Soundproofing",
    description:
      "Advanced sound-isolation systems engineered to block external noise and ensure complete privacy. Perfect for homes, corporate cabins, studios, hospitality spaces, healthcare rooms, and industrial zones, our solutions deliver silence, comfort, and absolute acoustic control.",
    image: "/assets/home/fi_17991697.png",
    accentColor: "blue-400",
  },
];

const ACCENT_MAP: Record<string, { border: string; text: string }> = {
  "yellow-400": { border: "bg-yellow-400", text: "text-yellow-400" },
  "orange-400": { border: "bg-orange-400", text: "text-orange-400" },
  "blue-400": { border: "bg-blue-400", text: "text-blue-400" },
};

function val(content: ContentMap, key: string) {
  return content[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function HomeHero() {
  const [content, setContent] = useState<ContentMap>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const bgImage = val(content, "home.hero.backgroundImage");

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-[50px] sm:pt-[130px] lg:pt-[143px] text-center text-white">
        
        {/* Heading */}
        <FadeIn direction="up">
          <h1 className="max-w-7xl text-[28px] sm:text-[40px] lg:text-[76px] font-bold playfair-display">
            {val(content, "home.hero.title")}
          </h1>

          {/* ✅ CENTERED SUBTITLE */}
          <p className="mt-6 max-w-2xl mx-auto text-center text-gray-200">
            {val(content, "home.hero.subtitle")}
          </p>
        </FadeIn>

        {/* Feature Boxes */}
        <FadeIn className="mt-16 w-full">
          <StaggerContainer className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-6">

            {DEFAULT_FEATURE_BOXES.map((box, index) => {
              const accent = ACCENT_MAP[box.accentColor];
              const isExpanded = expanded === index;

              return (
                <StaggerItem
                  key={box.title}
                  direction="up"
                  className="relative h-[230px] sm:h-[250px] w-full mb-8 sm:w-[360px] bg-black/50 px-6 py-6"
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-[3px] ${accent.border}`}
                  />
              
                  <Image
                    src={box.image}
                    alt={box.title}
                    width={52}
                    height={52}
                    className="mb-4"
                  />

                  <h3
                    className={`mb-3 text-[14px] font-[700] poppins-font text-left ${accent.text}`}
                  >
                    {box.title}
                  </h3>

                  <div
                    className={`text-[14px] font-[400] poppins-font text-left text-gray-300 transition-all duration-300 ${
                      isExpanded
                        ? "max-h-[90px] overflow-y-auto pr-1"
                        : "max-h-[42px] overflow-hidden"
                    }`}
                  >
                    {box.description}
                  </div>
              
                  <button
                    onClick={() => setExpanded(isExpanded ? null : index)}
                    className="mt-2 text-[13px] text-orange-400 hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
              
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </FadeIn>

      </div>
    </section>
  );
}