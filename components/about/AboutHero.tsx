"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn } from "@/components/animations";

const CONTENT_KEYS = [
  "about.hero.heading",
  "about.hero.subtitle",
  "about.hero.backgroundImage",
];

const DEFAULTS: Record<string, string> = {
  "about.hero.heading": "Partner in Future Readiness",
  "about.hero.subtitle":
    "Empowering tomorrow\u2019s spaces with acoustic solutions that blend precision, elegance, and performance.",
  "about.hero.backgroundImage":
    "/assets/about/empty-flat-interrior-with-elements-decoration 1 (1).png",
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
    <section className="relative w-full min-h-[65vh] sm:min-h-[72vh] lg:min-h-[80vh]">
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
          px-[16px] sm:px-[40px] lg:px-[100px]
          py-[60px] sm:py-[80px] lg:py-[100px]
          flex flex-col
          items-center justify-center
          text-white text-center
        "
      >
        {/* Heading */}
        <h1 className="text-[36px] sm:text-[56px] md:text-[72px] lg:text-[90px] font-bold leading-tight max-w-9xl playfair-display">
          {val(content, "about.hero.heading")}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] poppins-font font-[400] max-w-2xl text-white/90">
          {val(content, "about.hero.subtitle")}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contactus"
            className="border border-white px-6 py-3 text-[16px] sm:text-[18px] poppins-font font-[400] hover:bg-white hover:text-black transition cursor-pointer"
          >
            Get Quote &rarr;
          </Link>

          <Link
            href="/contactus"
            className="bg-orange-500 px-6 py-3 text-[16px] sm:text-[18px] poppins-font font-[400] hover:bg-orange-600 transition cursor-pointer inline-block"
          >
            Connect With Us &rarr;
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
