"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";

const CONTENT_KEYS = [
  "about.content.storyImage1",
  "about.content.storyImage2",
  "about.content.craftImage1",
  "about.content.craftImage2",
];

const DEFAULTS: Record<string, string> = {
  "about.content.storyImage1": "/assets/about/Image (1).png",
  "about.content.storyImage2": "/assets/about/Image (2).png",
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
    <section className="px-[16px] sm:px-[40px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] bg-white">

      {/* ================= Section 1 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
        {/* Left Content */}
        <FadeIn direction="up">
          <p className="text-[15px] text-[#183B56] font-[700] tracking-widest text-gray-500 worksans-font uppercase mb-4">
            Our Story
          </p>

          <h2 className="text-[32px] sm:text-[36px] lg:text-[40px] text-[#183B56] mb-6 axiforma font-[500]">
            The Power of Purity Source
          </h2>

          <p className="text-[#183B56] worksans-font font-[400] text-[16px] leading-relaxed mb-4">
            Fx Acoustics Inc. is a premium manufacturer of high-performance
            solutions, blending cutting-edge sound control with elegant design.
            From NRC-certified panels to turnkey acoustic interiors, we
            specialize in transforming spaces across India and beyond.
          </p>

          <p className="text-[#183B56] worksans-font font-[400] text-[16px] leading-relaxed mb-4">
            Proudly Made in India and globally trusted, we have built our
            reputation on craftsmanship, reliability, and customer
            satisfaction.
          </p>
        </FadeIn>

        {/* Right Images */}
        <SlideIn direction="right" className="relative flex justify-center lg:justify-end">
          {/* Big Image */}
          <div className="relative z-10 lg:left-[-200px] w-[320px] sm:w-[420px] lg:w-[525px] h-[566px]">
            <Image
              src={val(content, "about.content.storyImage1")}
              alt="Auditorium with acoustic panels installed"
              fill
              className="object-cover"
            />
          </div>

          {/* Small Overlap Image */}
          <div className="absolute -bottom-12 sm:-bottom-16 right-2 w-[260px] sm:w-[320px] lg:w-[400px] h-[500px]">
            <Image
              src={val(content, "about.content.storyImage2")}
              alt="Modern hallway with acoustic treatment"
              fill
              className="object-cover"
            />
          </div>
        </SlideIn>
      </div>

      {/* ================= Section 2 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center mt-24 sm:mt-32 lg:mt-40">

        {/* Left Images */}
        <SlideIn direction="left" className="relative flex justify-center lg:justify-start">
          {/* Big Image */}
          <div className="relative z-10 w-[300px] sm:w-[420px] lg:w-[505px] h-[466px]">
            <Image
              src={val(content, "about.content.craftImage1")}
              alt="Contemporary interior with acoustic design"
              fill
              className="object-cover"
            />
          </div>

          {/* Small Overlap Image */}
          <div className="absolute -bottom-12 sm:-bottom-16 left-[40px] sm:left-[80px] lg:left-[100px] w-[240px] sm:w-[300px] lg:w-[350px] h-[400px]">
            <Image
              src={val(content, "about.content.craftImage2")}
              alt="Recording studio with acoustic panels"
              fill
              className="object-cover"
            />
          </div>
        </SlideIn>

        {/* Right Content */}
        <FadeIn direction="up">
          <p className="text-[15px] text-[#183B56] font-[700] tracking-widest text-gray-500 worksans-font uppercase mb-4">
            Our Craft
          </p>

          <h2 className="text-[32px] sm:text-[36px] lg:text-[40px] text-[#183B56] mb-6 axiforma font-[500]">
            Where Science Meets Design
          </h2>

          <p className="text-[#183B56] worksans-font font-[400] text-[16px] leading-relaxed mb-4">
            Every panel we produce undergoes rigorous acoustic testing to meet
            international NRC standards. Our in-house design team collaborates
            with architects worldwide to create bespoke solutions that are as
            beautiful as they are functional.
          </p>

          <p className="text-[#183B56] worksans-font font-[400] text-[16px] leading-relaxed mb-4">
            From raw material selection to final installation, we maintain
            complete control over quality &mdash; ensuring every project delivers
            exceptional acoustic performance and lasting elegance.
          </p>
        </FadeIn>
      </div>

    </section>
  );
}
