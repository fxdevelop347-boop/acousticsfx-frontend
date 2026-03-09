"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { SubProductGridIntro, SubProductGridImage } from "@/lib/products-api";

const DEFAULT_GRID_IMAGES = [
  { url: "/assets/product/linearlux-grid-3.png", alt: "Linearlux Wall" },
  { url: "/assets/product/linearlux-grid-2.png", alt: "Linearlux Panel" },
  { url: "/assets/product/linearlux-grid-1.jpg", alt: "Linearlux Ceiling" },
];

interface LinearluxGridProps {
  gridIntro?: SubProductGridIntro | null;
  gridImages?: SubProductGridImage[] | null;
}

export default function LinearluxGrid({ gridIntro, gridImages }: LinearluxGridProps = {}) {
  const title = gridIntro?.title ?? "NEW DESIGNS";
  const subtitle = gridIntro?.subtitle ?? "LINEARLUX";
  const body = gridIntro?.body ?? "A linear grooved acoustic panel is one of the most commonly used multi-groove panels. Suitable for auditoriums, lecture halls, conference rooms, and public buildings, linear grooved acoustic panels provide a warm organic surface effect.";
  const images = (gridImages && gridImages.length >= 3) ? gridImages : DEFAULT_GRID_IMAGES;

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // MOBILE AUTO SLIDE
  useEffect(() => {
    const startInterval = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) return;
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 3500);
    };

    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  return (
    <section className="w-full bg-white px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">

      {/* ================= MOBILE SLIDER ================= */}
      <div className="block lg:hidden overflow-hidden">

        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >

          {images.map((image, i) => (

            <div key={i} className="min-w-full">
              <div className="relative h-[420px] rounded-xl overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          ))}

        </div>

      </div>

      {/* ================= DESKTOP GRID ================= */}
      <div className="hidden lg:block">

        <div className="flex flex-col gap-6">

          {/* ROW 1 */}
          <div className="flex flex-row gap-6">

            <div className="w-[740px] h-[600px] bg-[#1f6773] rounded-xl p-10 text-white flex flex-col justify-center">

              <p className="text-[14px] manrope tracking-widest mb-3">
                {title}
              </p>

              <h2 className="text-[55px] manrope font-bold mb-6">
                {subtitle}
              </h2>

              <p className="text-[28px] axiforma leading-relaxed text-white/90">
                {body}
              </p>

            </div>

            <div className="w-[540px] h-[600px] rounded-xl overflow-hidden relative">
              <Image
                src={images[0]?.url ?? ""}
                alt={images[0]?.alt ?? ""}
                fill
                className="object-cover"
              />
            </div>

          </div>

          {/* ROW 2 */}
          <div className="flex flex-row gap-6">

            <div className="w-[540px] h-[600px] rounded-xl overflow-hidden relative">
              <Image
                src={images[1]?.url ?? ""}
                alt={images[1]?.alt ?? ""}
                fill
                className="object-cover"
              />
            </div>

            <div className="w-[740px] h-[600px] rounded-xl overflow-hidden relative">
              <Image
                src={images[2]?.url ?? ""}
                alt={images[2]?.alt ?? ""}
                fill
                className="object-cover"
              />
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}