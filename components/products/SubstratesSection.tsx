"use client";

import { useState } from "react";
import Image from "next/image";
import type { SubProductSubstratesSection } from "@/lib/products-api";

const substrates = [
  {
    img: "/assets/product/substrate-1.png",
    size: "12, 16, 18MM",
    title: "MOISTURE RESISTANT MDF",
  },
  {
    img: "/assets/product/substrate-2.png",
    size: "12, 18MM",
    title: "FR CHARCORE MDF",
  },
  {
    img: "/assets/product/substrate-3.png",
    size: "12, 16, 18MM",
    title: "BLACK CORE MDF",
  },
  {
    img: "/assets/product/substrate-1.png",
    size: "12, 16, 18MM",
    title: "STANDARD MDF",
  },
  {
    img: "/assets/product/substrate-2.png",
    size: "12, 18MM",
    title: "FIRE RETARDANT MDF",
  },
];

export default function SubstratesSection({
  substratesSection,
}: {
  substratesSection?: SubProductSubstratesSection | null;
}) {
  const [index, setIndex] = useState(0);
  const items =
    substratesSection?.items?.length
      ? substratesSection.items.map((i) => ({
          img: i.image || "/assets/product/substrate-1.png",
          size: (i.thickness || "").toUpperCase(),
          title: i.name.toUpperCase(),
        }))
      : substrates;
  const title = substratesSection?.title ?? "Substrates";
  const description =
    substratesSection?.description ??
    "Our inspired solutions have helped shape modern acoustic design. Alluring spaces, internationally recognised for their architectural elegance and exceptional sound management live here.";

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, items.length - 3));
  };

  return (
    <section className="w-full bg-white pl-[24px] sm:pl-[40px] md:pl-[60px] lg:pl-[100px] py-[60px] sm:py-[70px] lg:py-[80px]">

      {/* Header */}
      <div className="max-w-2xl mb-8 sm:mb-10">
        <h2 className="text-[28px] sm:text-[32px] lg:text-[38px] font-bold axiforma mb-3">
          {title}
        </h2>
        <p className="text-[14px] sm:text-[15px] inter-font font-[400] text-gray-600">
          {description}
        </p>
      </div>

      {/* Cards Slider */}
      <div className="relative overflow-hidden">
        <div
          className="flex gap-6 sm:gap-8 lg:gap-10 transition-transform duration-500"
          style={{
            transform: `translateX(-${index * 360}px)`,
          }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="min-w-[260px] sm:min-w-[300px] lg:min-w-[350px]">

              {/* Image */}
              <div className="h-[260px] sm:h-[300px] lg:h-[350px] rounded-xl overflow-hidden mb-4 relative">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <p className="text-[18px] sm:text-[19px] lg:text-[20px] inter-font font-[400] text-gray-400 mb-1">
                {item.size}
              </p>
              <p className="text-[18px] sm:text-[19px] lg:text-[20px] inter-font font-[400] tracking-wide">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-8 mt-6 sm:mt-8 items-center">
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
          disabled={index >= items.length - 3}
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

    </section>
  );
}
