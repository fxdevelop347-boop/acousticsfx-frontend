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
      "Ideal for auditoriums, studios, and performance spaces where sound precision is non-negotiable.",
    image: "/assets/home/fi_11062015.png",
    accentColor: "yellow-400",
  },
  {
    title: "Floor Solution",
    description:
      "Perfect for gyms, halls, and high-traffic zones — combining aesthetics with acoustic synergy.",
    image: "/assets/home/fi_7821525.png",
    accentColor: "orange-400",
  },
  {
    title: "Sound Proofing",
    description:
      "Custom solutions for homes, offices, and commercial spaces that demand quiet confidence.",
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

function parseFeatureBoxes(content: ContentMap): FeatureBox[] {
  const raw = content["home.hero.featureBoxes"]?.value;
  if (!raw) return DEFAULT_FEATURE_BOXES;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FEATURE_BOXES;
  } catch {
    return DEFAULT_FEATURE_BOXES;
  }
}

export default function HomeHero() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const bgImage = val(content, "home.hero.backgroundImage");
  const featureBoxes = parseFeatureBoxes(content);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-[110px] sm:pt-[130px] lg:pt-[143px] text-center text-white">
        {/* Main Text */}
        <FadeIn direction="up" duration={0.7} className="w-full flex flex-col items-center">
          <h1
            className="max-w-7xl leading-[42px] sm:leading-[60px] lg:leading-[85px]
          text-[28px] sm:text-[40px] md:text-5xl lg:text-[76px] font-bold playfair-display"
          >
            {val(content, "home.hero.title")}
          </h1>

          <FadeIn direction="up" delay={0.1} duration={0.7} className="w-full flex justify-center">
            <p className="mt-6 max-w-2xl text-[14px] sm:text-[15px] md:text-base font-[400] text-gray-200 poppins-font">
              {val(content, "home.hero.subtitle")}
            </p>
          </FadeIn>
        </FadeIn>

        {/* Buttons */}
        <FadeIn direction="up" delay={0.25} duration={0.7}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contactus"
              className="border poppins-font font-[400] border-white px-6 py-3 text-[16px] sm:text-[18px] transition hover:bg-white hover:text-black cursor-pointer"
            >
              {val(content, "home.hero.button1Label")}
            </Link>

            <Link
              href="/contactus"
              className="bg-[#EA8E39] px-6 py-3 text-[16px] sm:text-[18px] poppins-font font-[400] transition hover:bg-orange-600 cursor-pointer"
            >
              {val(content, "home.hero.button2Label")}
            </Link>
          </div>
        </FadeIn>

        {/* Spacer */}
        <div className="h-[40px] sm:h-[50px] lg:h-[60px]" />

        {/* Feature Boxes */}
        <FadeIn direction="up" delay={0.3} duration={0.7} className="mb-[80px] sm:mb-[100px] lg:mb-[120px] w-full">
          <StaggerContainer className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-6">
            {featureBoxes.map((box) => {
              const accent =
                ACCENT_MAP[box.accentColor] ?? ACCENT_MAP["yellow-400"];
              return (
                <StaggerItem
                  key={box.title}
                  direction="up"
                  className="relative h-[230px] sm:h-[250px] w-full sm:w-[360px] bg-black/50 px-6 py-6"
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

                  <p className="text-[14px] font-[400] poppins-font text-left text-gray-300">
                    {box.description}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </FadeIn>
      </div>
    </section>
  );
}
