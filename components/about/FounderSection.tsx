"use client";

import { useEffect, useState } from "react";
import Image from "@/components/shared/SmartImage";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";

const CONTENT_KEYS = [
  "about.founder.label",
  "about.founder.heading",
  "about.founder.body1",
  "about.founder.body2",
  "about.founder.body3",
  "about.founder.quoteName",
  "about.founder.badgeNumber",
  "about.founder.badgeTitle",
  "about.founder.image",
];

const DEFAULTS: Record<string, string> = {
  "about.founder.label": "Meet our founder",
  "about.founder.heading":
    "Creating harmony between Innovation and Integrity shaping spaces that inspire trust.",
  "about.founder.body1":
    "At FX Acoustics, our journey began with a simple belief: sound has the power to shape how we live, work, and feel. Every panel, every design, and every solution we create is driven by a commitment to clarity, elegance, and impact.",
  "about.founder.body2":
    "We don't just build acoustic products \u2014 we craft experiences. Experiences that empower architects, designers, and businesses to imagine spaces that are thoughtful, timeless, and future-ready. Our promise is rooted in integrity, innovation, and collaboration.",
  "about.founder.body3":
    "As we continue to grow, our vision remains unchanged: to cut through the noise and deliver solutions that inspire trust, elevate design, and leave a lasting impression.",
  "about.founder.quoteName": "\u2014 Rahul, Founder & Creative Lead",
  "about.founder.badgeNumber": "#1",
  "about.founder.badgeTitle": "Best Award 2023",
  "about.founder.image": "/assets/about/Image (5).png",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function FounderSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const founderImage = val(content, "about.founder.image");

  return (
    <section className="px-4 sm:px-[40px] lg:px-[100px] py-8 sm:py-12 lg:py-16 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">

        {/* ================= Left Image ================= */}
        <SlideIn direction="left" className="relative">
          <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[420px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={founderImage}
              alt="Founder of FX Acoustics"
              fill
              className="object-cover"
            />
          </div>

          {/* Award Badge */}
          <div className="absolute -bottom-6 right-2 sm:-bottom-8 sm:right-4 lg:-bottom-8 lg:right-6 z-10">
            <div
              className="
                w-[130px] sm:w-[190px] lg:w-[229px]
                h-[130px] sm:h-[190px] lg:h-[229px]
                rounded-full 
                bg-[#1F6775] 
                border-4 
                border-white 
                flex 
                flex-col 
                items-center 
                justify-center 
                gap-1 sm:gap-2
                text-white 
                shadow-lg
                px-2 text-center
              "
            >
              {/* Icon / Image */}
              <div className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#F2F5F629] flex items-center justify-center p-2">
                <div className="w-4 h-4 sm:w-6 sm:h-6 relative">
                  <Image
                    src="/assets/about/Vector.svg"
                    alt="Award Icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Badge Number */}
              <span className="text-[1.25rem] sm:text-[38px] lg:text-[45px] leading-none lato font-bold">
                {val(content, "about.founder.badgeNumber")}
              </span>

              {/* Badge Title */}
              <span className="text-[12px] sm:text-[15px] lg:text-[16px] lato font-bold leading-tight">
                {val(content, "about.founder.badgeTitle")}
              </span>
            </div>
          </div>
        </SlideIn>

        {/* ================= Right Content ================= */}
        <FadeIn direction="up">
          <p className="text-xs sm:text-[15px] text-gray-500 worksans-font font-bold mb-2 sm:mb-4">
            {val(content, "about.founder.label")}
          </p>

          <h2 className="text-lg sm:text-[26px] lg:text-[30px] axiforma font-bold text-[#111] leading-snug mb-4 sm:mb-6">
            {val(content, "about.founder.heading")}
          </h2>

          <p className="text-gray-600 lato font-normal text-sm sm:text-[18px] lg:text-[20px] leading-relaxed mb-3 sm:mb-4">
            {val(content, "about.founder.body1")}
          </p>

          <p className="text-gray-600 lato font-normal text-sm sm:text-[18px] lg:text-[20px] leading-relaxed mb-3 sm:mb-4">
            {val(content, "about.founder.body2")}
          </p>

          <p className="text-gray-600 lato font-normal text-sm sm:text-[18px] lg:text-[20px] leading-relaxed mb-4 sm:mb-6">
            {val(content, "about.founder.body3")}
          </p>

          <p className="text-sm text-[#EA8E39] font-medium lato italic sm:text-[18px] lg:text-[20px]">
            {val(content, "about.founder.quoteName")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
