"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchTestimonials, type Testimonial } from "@/lib/testimonials-api";
import { useAsyncData } from "@/hooks/useAsyncData";
import Spinner from "@/components/shared/Spinner";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function Testimonials() {
  const { data: testimonials, loading, error } =
    useAsyncData<Testimonial[]>(fetchTestimonials);

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const items = testimonials ?? [];

  // ✅ Detect screen
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const prev = () => {
    setIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const next = () => {
    setIndex((prev) =>
      prev >= items.length - 1 ? items.length - 1 : prev + 1
    );
  };

  if (loading) {
    return (
      <section className="px-6 sm:px-10 lg:px-[100px] py-[80px] lg:py-[100px] bg-white">
        <FadeIn direction="up">
          <h2 className="text-left lg:text-center text-[32px] sm:text-[44px] lg:text-[60px] font-bold mb-12">
            Loved by the world&apos;s best teams
          </h2>
        </FadeIn>
        <div className="flex justify-center py-10">
          <Spinner size="sm" />
        </div>
      </section>
    );
  }

  if (error) return <p className="text-center">{error}</p>;
  if (items.length === 0) return null;

  return (
    <section className="px-6 sm:px-10 lg:px-[100px] py-[80px] lg:py-[100px] bg-white">

      {/* HEADING */}
      <FadeIn direction="up">
        <h2 className="text-left lg:text-center text-[32px] sm:text-[44px] lg:text-[60px] font-bold mb-12 lg:mb-16">
          Loved by the world&apos;s best teams
        </h2>
      </FadeIn>

      {/* SLIDER */}
      <div className="relative overflow-hidden px-4 sm:px-0">
        <div
          className="flex gap-0 sm:gap-8 transition-transform duration-500"
          style={{
            transform: isMobile
              ? `translateX(-${index * 100}%)` // 📱 mobile
              : `translateX(-${index * 420}px)`, // 💻 desktop same
          }}
        >
          <StaggerContainer className="flex gap-0 sm:gap-8">
            {items.map((item) => (
              <StaggerItem
                key={item._id}
                direction="up"
                className="
  w-full sm:w-auto
  max-w-[360px]   /* 🔥 thodi badi */
  sm:min-w-[340px]
  lg:min-w-[380px]
  flex-shrink-0
  border rounded-2xl p-6 sm:p-7 lg:p-8 bg-white
  mx-auto sm:mx-0
"
              >
                {/* LOGO */}
                {item.companyLogo && (
                  <div className="relative w-[160px] sm:w-[180px] lg:w-[200px] h-[60px] sm:h-[70px] lg:h-[80px] mb-6">
                    <Image
                      src={item.companyLogo}
                      alt={item.company}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {/* TEXT */}
                <p className="text-gray-600 mb-10">
                  &quot;{item.text}&quot;
                </p>

                {/* USER */}
                <div className="flex items-center gap-4">
                  {item.avatar && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src={item.avatar} alt={item.name} fill />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* LEFT BUTTON */}
        <button
          onClick={prev}
          disabled={index === 0}
          className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center"
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="prev"
            width={30}
            height={10}
            className="rotate-180"
          />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={next}
          disabled={index === items.length - 1}
          className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-md flex items-center justify-center"
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="next"
            width={30}
            height={10}
            className="invert"
          />
        </button>

      </div>
    </section>
  );
}  