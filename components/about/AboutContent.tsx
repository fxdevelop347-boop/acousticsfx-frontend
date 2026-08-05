"use client";

import { useEffect, useState } from "react";
import Image from "@/components/shared/SmartImage";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";

const CONTENT_KEYS = [
  "about.content.storyLabel",
  "about.content.storyHeading",
  "about.content.storyBody1",
  "about.content.storyBody2",
  "about.content.storyImage1",
  "about.content.storyImage2",
  "about.content.craftLabel",
  "about.content.craftHeading",
  "about.content.craftBody1",
  "about.content.craftBody2",
  "about.content.craftImage1",
  "about.content.craftImage2",
];

const DEFAULTS: Record<string, string> = {
  "about.content.storyLabel": "Our Story",
  "about.content.storyHeading": "The Power of Purity Source",
  "about.content.storyBody1":
    "Fx Acoustics Inc. is a premium manufacturer of high-performance solutions, blending cutting-edge sound control with elegant design. From NRC-certified panels to turnkey acoustic interiors, we specialize in transforming spaces across India and beyond.",
  "about.content.storyBody2":
    "Proudly Made in India and globally trusted, we have built our reputation on craftsmanship, reliability, and customer satisfaction.",
  "about.content.storyImage1": "/assets/about/Image (1).png",
  "about.content.storyImage2": "/assets/about/Image (2).png",
  "about.content.craftLabel": "Our Craft",
  "about.content.craftHeading": "Where Science Meets Design",
  "about.content.craftBody1":
    "Every panel we produce undergoes rigorous acoustic testing to meet international NRC standards. Our in-house design team collaborates with architects worldwide to create bespoke solutions that are as beautiful as they are functional.",
  "about.content.craftBody2":
    "From raw material selection to final installation, we maintain complete control over quality \u2014 ensuring every project delivers exceptional acoustic performance and lasting elegance.",
  "about.content.craftImage1": "/assets/about/Image (3).png",
  "about.content.craftImage2": "/assets/about/Image (4).png",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function AboutContent() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  return (
    <section className="px-4 sm:px-[40px] lg:px-[100px] py-6 sm:py-8 lg:py-10 bg-white">

      {/* ================= Section 1 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <FadeIn direction="up">
          <p className="text-xs sm:text-[13px] text-[#ea8e39] font-bold tracking-widest worksans-font uppercase mb-1.5 sm:mb-2">
            {val(content, "about.content.storyLabel")}
          </p>

          <h2 className="text-lg sm:text-2xl lg:text-[26px] text-[#183B56] mb-2 sm:mb-3 axiforma font-medium leading-snug">
            {val(content, "about.content.storyHeading")}
          </h2>

          <p className="text-[#183B56] worksans-font font-normal text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
            {val(content, "about.content.storyBody1")}
          </p>

          <p className="text-[#183B56] worksans-font font-normal text-xs sm:text-sm leading-relaxed mb-3">
            {val(content, "about.content.storyBody2")}
          </p>
        </FadeIn>

        {/* Right Images */}
        <SlideIn direction="right" className="w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] aspect-[16/9]">
            {/* Primary Main Image */}
            <div className="relative w-[78%] h-[82%] rounded-xl overflow-hidden shadow-xl border border-gray-100/80 group">
              <Image
                src={val(content, "about.content.storyImage1")}
                alt="Auditorium with acoustic panels installed"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Secondary Overlap Image */}
            <div className="absolute bottom-0 right-0 w-[54%] h-[60%] rounded-xl overflow-hidden shadow-xl border-4 border-white z-10 transition-transform duration-500 hover:-translate-y-1">
              <Image
                src={val(content, "about.content.storyImage2")}
                alt="Modern hallway with acoustic treatment"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </SlideIn>
      </div>

      {/* ================= Section 2 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12 items-center mt-8 sm:mt-10 lg:mt-12">

        {/* Left Images */}
        <SlideIn direction="left" className="w-full flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] aspect-[16/9]">
            {/* Primary Main Image */}
            <div className="relative ml-auto w-[78%] h-[82%] rounded-xl overflow-hidden shadow-xl border border-gray-100/80 group">
              <Image
                src={val(content, "about.content.craftImage1")}
                alt="Contemporary interior with acoustic design"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Secondary Overlap Image */}
            <div className="absolute bottom-0 left-0 w-[54%] h-[60%] rounded-xl overflow-hidden shadow-xl border-4 border-white z-10 transition-transform duration-500 hover:-translate-y-1">
              <Image
                src={val(content, "about.content.craftImage2")}
                alt="Recording studio with acoustic panels"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </SlideIn>

        {/* Right Content */}
        <FadeIn direction="up">
          <p className="text-xs sm:text-[13px] text-[#ea8e39] font-bold tracking-widest worksans-font uppercase mb-1.5 sm:mb-2">
            {val(content, "about.content.craftLabel")}
          </p>

          <h2 className="text-lg sm:text-2xl lg:text-[26px] text-[#183B56] mb-2 sm:mb-3 axiforma font-medium leading-snug">
            {val(content, "about.content.craftHeading")}
          </h2>

          <p className="text-[#183B56] worksans-font font-normal text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
            {val(content, "about.content.craftBody1")}
          </p>

          <p className="text-[#183B56] worksans-font font-normal text-xs sm:text-sm leading-relaxed mb-3">
            {val(content, "about.content.craftBody2")}
          </p>
        </FadeIn>
      </div>

    </section>
  );
}
