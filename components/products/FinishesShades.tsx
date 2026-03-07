"use client";

import { useState } from "react";
import Image from "next/image";
import type { SubProductFinishesSection } from "@/lib/products-api";

const finishes = [
  {
    img: "/assets/product/finish-shade-1.jpg",
    code: "31559",
    name: "Natural Teak",
    desc: "The natural look for your surface. Our versatile real wood options.",
  },
  {
    img: "/assets/product/finish-shade-3.jpg",
    code: "31608",
    name: "Douglas Pine",
    desc: "The serene texture you can rely on. Choose the ideal individuality.",
  },
  {
    img: "/assets/product/finish-shade-2.jpg",
    code: "31458",
    name: "Sonoma Oak Light",
    desc: "Continuous pressure laminate is extremely resistant to scratches.",
  },
  {
    img: "/assets/product/finish-shade-1.jpg",
    code: "31458",
    name: "Walnut Dark",
    desc: "Rich, deep tones for premium architectural interiors.",
  },
  {
    img: "/assets/product/finish-shade-3.jpg",
    code: "31560",
    name: "Cherry Wood",
    desc: "Warm, elegant finish for sophisticated spaces.",
  },
];
export default function FinishesShades({
  finishesSection,
}: {
  finishesSection?: SubProductFinishesSection | null;
}) {
  const [index, setIndex] = useState(0);
  const items =
    finishesSection?.items?.length
      ? finishesSection.items.map((f) => ({
          img: f.image,
          code: "",
          name: f.name,
          desc: f.description ?? "",
        }))
      : finishes;
  const title = finishesSection?.title ?? "Finishes & Shades";
  const description =
    finishesSection?.description ??
    "Our inspired solutions have helped shape modern acoustic design. Alluring spaces, internationally recognised for their architectural elegance and exceptional sound management live here.";

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, items.length - 4));
  };

  return (
    <section className="w-full bg-[#faf7f2] pl-[24px] sm:pl-[40px] md:pl-[60px] lg:pl-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">
      
      <div className="flex flex-col lg:flex-row gap-10 sm:gap-14 lg:gap-20">
        
        {/* Left Content */}
        <div className="max-w-xs">
          <h2 className="text-[28px] sm:text-[30px] lg:text-[34px] inter-font font-medium mb-4">
            {title}
          </h2>
          <p className="text-[15px] sm:text-[16px] inter-font font-[500] text-gray-600 mb-8">
            {description}
          </p>
        </div>

        {/* Slider */}
        <div className="flex-1 relative overflow-hidden">
          <div
            className="flex gap-6 sm:gap-8 transition-transform duration-500"
            style={{
              transform: `translateX(-${index * 208}px)`,
            }}
          >
            {items.map((item, idx) => (
              <div key={idx} className="min-w-[200px]">
                
                {/* Slide Image */}
                <div className="w-[200px] h-[200px] rounded-lg overflow-hidden mb-4 relative bg-white">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Text */}
                {item.code ? (
                  <p className="text-[22px] sm:text-[24px] inter-font font-[400] text-gray-400 mb-1">
                    {item.code}
                  </p>
                ) : null}
                <p className="text-[22px] sm:text-[24px] inter-font font-[400] mb-1">
                  {item.name}
                </p>
                <p className="text-[14px] sm:text-[15px] inter-font font-[500] text-gray-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Centered Below */}
          <div className="flex justify-center gap-6 items-center mt-8">
            <button
              onClick={prev}
              disabled={index === 0}
              className="hover:opacity-70 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Image
                src="/assets/home/universalvector.svg"
                alt="Previous"
                width={34}
                height={14}
                className="rotate-180"
              />
            </button>
            <button
              onClick={next}
              disabled={index >= items.length - 4}
              className="hover:opacity-70 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Image
                src="/assets/home/universalvector.svg"
                alt="Next"
                width={34}
                height={14}
              />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
