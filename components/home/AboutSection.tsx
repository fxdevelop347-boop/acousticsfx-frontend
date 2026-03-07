"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";

const CONTENT_KEYS = [
  "home.about.label",
  "home.about.heading",
  "home.about.body",
  "home.about.ctaLabel",
  "home.about.ctaLink",
  "home.about.image",
  "home.about.backgroundImage",
];

const DEFAULTS: Record<string, string> = {
  "home.about.label": "About Us",
  "home.about.heading": "Creative solutions by professional designers",
  "home.about.body":
    "At Acoustics FX, we transform ordinary spaces into extraordinary experiences. With over 15 years of expertise in acoustic solutions, premium wooden flooring, and advanced soundproofing, we blend science with design to deliver environments that inspire focus, comfort, and performance.",
  "home.about.ctaLabel": "Learn More",
  "home.about.ctaLink": "/about",
  "home.about.image": "/assets/home/rimage.png",
  "home.about.backgroundImage": "/assets/home/bgimage.png",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function AboutSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const bgImage = val(content, "home.about.backgroundImage");
  const image = val(content, "home.about.image");

  return (
    <section
      className="relative w-full overflow-hidden 
      py-14 lg:py-0 lg:min-h-screen"
    >

      {/* ================= Background Image ================= */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover opacity-90"
          priority
        />
      </div>

      {/* ================= Overlay ================= */}
      <div className="absolute inset-0 bg-[#1F6775] opacity-80" />

      {/* ================= Content ================= */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:min-h-screen">
        {/* LEFT CONTENT */}
        <FadeIn
          direction="up"
          duration={0.7}
          className="w-full lg:w-1/2 flex items-center 
          px-6 sm:px-10 lg:pl-[50px] lg:pr-16 
          text-left text-white"
        >
          <div>
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] mb-3 font-bold work-sans">
              {val(content, "home.about.label")}
            </p>

            <h2
              className="text-[26px] sm:text-[32px] lg:text-[38px] 
              font-bold mb-5 lg:mb-6 leading-tight axiforma"
            >
              {val(content, "home.about.heading")}
            </h2>

            <p
              className="text-[15px] sm:text-[16px] lg:text-[18px] 
              text-[#E2D9C8] mb-7 lg:mb-8 leading-relaxed axiforma font-[400]"
            >
              {val(content, "home.about.body")}
            </p>

            <a
              href={val(content, "home.about.ctaLink")}
              className="inline-block bg-orange-500 px-6 py-3 text-white text-[14px] sm:text-[15px] cursor-pointer no-underline hover:opacity-90 transition"
            >
              {val(content, "home.about.ctaLabel")}
            </a>
          </div>
        </FadeIn>

        {/* RIGHT IMAGE */}
        <SlideIn
          direction="right"
          className="w-full lg:w-1/2 flex items-center 
          px-6 sm:px-10 lg:px-0 mt-12 lg:mt-0"
        >
          <div className="relative w-full">
            <Image
              src={image}
              alt="Auditorium"
              width={1019}
              height={679}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </SlideIn>
      </div>
    </section>
  );
}
