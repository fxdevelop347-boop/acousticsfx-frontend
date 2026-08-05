"use client";

import { useEffect, useState } from "react";
import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn } from "@/components/animations";

const CONTENT_KEYS = [
  "about.hero.heading",
  "about.hero.subtitle",
  "about.hero.backgroundImage",
  "about.hero.cta1Label",
  "about.hero.cta1Link",
  "about.hero.cta2Label",
  "about.hero.cta2Link",
];

const DEFAULTS: Record<string, string> = {
  "about.hero.heading": "Partner in Future Readiness",
  "about.hero.subtitle":
    "Empowering tomorrow\u2019s spaces with acoustic solutions that blend precision, elegance, and performance.",
  "about.hero.backgroundImage":
    "/assets/about/empty-flat-interrior-with-elements-decoration 1 (1).png",
  "about.hero.cta1Label": "Get Quote \u2192",
  "about.hero.cta1Link": "/contactus",
  "about.hero.cta2Label": "Connect With Us \u2192",
  "about.hero.cta2Link": "/contactus",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function AboutHero() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const bgImage = val(content, "about.hero.backgroundImage");

  return (
    <section className="relative w-full min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="About hero background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <FadeIn
        direction="up"
        duration={0.7}
        className="
          relative z-10
          px-4 sm:px-8 lg:px-16
          py-6 sm:py-10 lg:py-12
          flex flex-col
          items-center justify-center
          text-white text-center
          w-full
        "
      >
        {/* Heading */}
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight max-w-4xl playfair-display">
          {val(content, "about.hero.heading")}
        </h1>

        {/* Subtitle */}
        <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm md:text-base poppins-font font-normal max-w-xl text-white/90 leading-relaxed">
          {val(content, "about.hero.subtitle")}
        </p>

        {/* Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 justify-center w-full max-w-xs sm:max-w-none">
          <Link
            href={val(content, "about.hero.cta1Link")}
            className="border border-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm poppins-font font-medium hover:bg-white hover:text-black transition cursor-pointer text-center rounded-sm"
          >
            {val(content, "about.hero.cta1Label")}
          </Link>

          <Link
            href={val(content, "about.hero.cta2Link")}
            className="bg-orange-500 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm poppins-font font-medium hover:bg-orange-600 transition cursor-pointer inline-block text-center rounded-sm"
          >
            {val(content, "about.hero.cta2Label")}
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
