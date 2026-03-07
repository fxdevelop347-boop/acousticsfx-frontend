"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";

const CONTENT_KEYS = ["about.founder.image"];

const DEFAULT_IMAGE = "/assets/about/Image (5).png";

export default function FounderSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const founderImage = content["about.founder.image"]?.value ?? DEFAULT_IMAGE;

  return (
    <section className="px-[16px] sm:px-[40px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">

        {/* ================= Left Image ================= */}
        <SlideIn direction="left" className="relative">
          <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[520px] rounded-lg overflow-hidden">
            <Image
              src={founderImage}
              alt="Rahul, Founder & Creative Lead of FX Acoustics"
              fill
              className="object-cover"
            />
          </div>

          {/* Award Badge */}
          <div className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-10 -right-4 sm:-right-6 lg:-right-10">
            <div
              className="
                w-[160px] sm:w-[190px] lg:w-[229px]
                h-[160px] sm:h-[190px] lg:h-[229px]
                rounded-full 
                bg-[#1F6775] 
                border-4 
                border-white 
                flex 
                flex-col 
                items-center 
                justify-center 
                gap-2
                text-white 
                shadow-lg
              "
            >
              {/* Icon / Image */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#F2F5F629] flex items-center justify-center p-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
                  <Image
                    src="/assets/about/Vector.svg"
                    alt="Award Icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* #1 */}
              <span className="text-[32px] sm:text-[38px] lg:text-[45px] leading-none lato font-bold">
                #1
              </span>

              {/* Text */}
              <span className="text-[14px] sm:text-[15px] lg:text-[16px] lato font-bold leading-tight">
                Best Award
              </span>

              <span className="text-[14px] sm:text-[15px] lg:text-[16px] lato font-bold leading-tight">
                2023
              </span>
            </div>
          </div>
        </SlideIn>

        {/* ================= Right Content ================= */}
        <FadeIn direction="up">
          <p className="text-[15px] text-gray-500 worksans-font font-bold mb-4">
            Meet our founder
          </p>

          <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] axiforma font-bold text-[#111] leading-snug mb-6">
            Creating harmony between{" "}
            <span className="text-teal-700">
              Innovation and Integrity shaping spaces that
              inspire trust.
            </span>
          </h2>

          <p className="text-gray-600 lato font-[400] text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed mb-4">
            At FX Acoustics, our journey began with a simple belief: sound has
            the power to shape how we live, work, and feel. Every panel, every
            design, and every solution we create is driven by a commitment to
            clarity, elegance, and impact.
          </p>

          <p className="text-gray-600 lato font-[400] text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed mb-4">
            We don&apos;t just build acoustic products &mdash; we craft experiences.
            Experiences that empower architects, designers, and businesses to
            imagine spaces that are thoughtful, timeless, and future-ready.
            Our promise is rooted in integrity, innovation, and collaboration.
          </p>

          <p className="text-gray-600 lato font-[400] text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed mb-6">
            As we continue to grow, our vision remains unchanged: to cut through
            the noise and deliver solutions that inspire trust, elevate design,
            and leave a lasting impression.
          </p>

          <p className="text-sm text-[#EA8E39] font-medium lato font-[400] text-[16px] sm:text-[18px] lg:text-[20px] italic">
            &mdash; Rahul, Founder &amp; Creative Lead
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
