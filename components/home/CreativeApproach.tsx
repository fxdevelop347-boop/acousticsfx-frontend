"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, BlurIn, ScaleOnScroll } from "@/components/animations";

const CONTENT_KEYS = [
  "home.creative.mainImage",
  "home.creative.secondaryImage",
];

const DEFAULTS: Record<string, string> = {
  "home.creative.mainImage": "/assets/home/banImage.png",
  "home.creative.secondaryImage": "/assets/home/banTwo.png",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function CreativeApproach() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full px-4 sm:px-8 lg:px-[12.5vw] py-12 lg:py-[6.25vw] bg-[#F5F5F5] overflow-hidden">
      <div className="relative flex flex-col lg:flex-row items-center max-w-[1600px] xl:max-w-none mx-auto">

        {/* LEFT CONTENT CARD */}
        <FadeIn
          direction="left"
          duration={0.7}
  className="
    relative z-30 bg-[#FFF3E8]
    p-6 lg:p-10
    shadow-lg
    w-full
    max-w-[650px]   /* 🔥 MAX WIDTH FIX */
  "
        >
          <p className="text-sm mb-2">#FXacoustic solutions</p>

          <h2 className="text-2xl font-semibold mb-6">
            Creative Approach
          </h2>

          {/* ACCORDION ITEM 1 */}
          <div className="border-t border-gray-300 py-4">
            <button
              onClick={() => toggleAccordion(0)}
              className="flex w-full justify-between items-center font-medium cursor-pointer"
            >
              <span>Story & Concept</span>
              <span className="text-xl">{openIndex === 0 ? "−" : "+"}</span>
            </button>

            {openIndex === 0 && (
              <p className="text-sm text-gray-600 mt-3">
                Read on how we make awesome projects from scratch, through
                several series of testing and refining to make our awesome
                masterclass.
              </p>
            )}
          </div>

          {/* ACCORDION ITEM 2 */}
          <div className="border-t border-gray-300 py-4">
            <button
              onClick={() => toggleAccordion(1)}
              className="flex w-full justify-between items-center font-medium cursor-pointer"
            >
              <span>Design and Testing</span>
              <span className="text-xl">{openIndex === 1 ? "−" : "+"}</span>
            </button>

            {openIndex === 1 && (
              <p className="text-sm text-gray-600 mt-3">
                We test and validate every design to ensure optimal
                performance and acoustic accuracy.
              </p>
            )}
          </div>

          {/* ACCORDION ITEM 3 */}
          <div className="border-t border-b border-gray-300 py-4">
            <button
              onClick={() => toggleAccordion(2)}
              className="flex w-full justify-between items-center font-medium cursor-pointer"
            >
              <span>Revision and Rendering</span>
              <span className="text-xl">{openIndex === 2 ? "−" : "+"}</span>
            </button>

            {openIndex === 2 && (
              <p className="text-sm text-gray-600 mt-3">
                Final revisions and high-quality rendering for
                presentation-ready outputs.
              </p>
            )}
          </div>

          <a
            href="/about"
            className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 text-sm cursor-pointer no-underline hover:opacity-90 transition"
          >
            Learn More
          </a>
        </FadeIn>

        {/* IMAGES WRAPPER */}
        <div
          className="
            relative flex-1 min-w-0 w-full
            mt-10 lg:mt-0
            flex flex-col lg:block items-center
            lg:[height:clamp(700px,56.25vw,900px)]
          "
        >
          {/* SMALL IMAGE */}
          <BlurIn
            className="
              relative lg:absolute
              right-0 lg:top-1/2 lg:-translate-y-1/2
              z-0 hidden sm:block
              mb-6 lg:mb-0
              lg:[width:clamp(350px,31.25vw,500px)]
              lg:[height:clamp(525px,46.875vw,750px)]
            "
          >
            <Image
              src={val(content, "home.creative.secondaryImage")}
              alt="Interior"
              fill
              className="object-cover grayscale"
            />
          </BlurIn>

          {/* BIG IMAGE */}
          <ScaleOnScroll
            className="
              relative lg:absolute z-10
              lg:top-1/2 lg:-translate-y-1/2
              right-0 sm:right-auto
              lg:right-[clamp(180px,16.25vw,260px)]
              lg:[width:clamp(320px,80vw,667px)]
              lg:[height:clamp(420px,90vw,835px)]
            "
          >
            <Image
              src={val(content, "home.creative.mainImage")}
              alt="Creative Space"
              fill
              className="object-cover"
            />
          </ScaleOnScroll>
        </div>

      </div>
    </section>
  );
}
