"use client";

import Image from "next/image";
import { fetchTestimonials, type Testimonial } from "@/lib/testimonials-api";
import { useAsyncData } from "@/hooks/useAsyncData";
import Spinner from "@/components/shared/Spinner";
import { FadeIn } from "@/components/animations";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function Testimonials() {

  const { data: testimonials, loading, error } =
    useAsyncData<Testimonial[]>(fetchTestimonials);

  const items = testimonials ?? [];

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
    <section className="px-6 sm:px-10 lg:px-[100px] py-[50px] lg:py-[100px] bg-white">

      {/* HEADING */}
      <FadeIn direction="up">
        <h2 className="text-left lg:text-center text-[27px] sm:text-[44px] lg:text-[60px] font-bold mb-12 lg:mb-16">
          Loved by the world&apos;s best teams
        </h2>
      </FadeIn>

      <div className="relative">

        {/* SLIDER */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
          }}
          spaceBetween={30}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              slidesPerGroup: 1,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 1,
            },
          }}
        >

          {items.map((item) => (
            <SwiperSlide key={item._id}>

              <div className="
              border
              rounded-2xl
              p-6
              sm:p-7
              lg:p-8
              bg-white
              h-full
              ">

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

              </div>

            </SwiperSlide>
          ))}

        </Swiper>

        {/* LEFT BUTTON */}
        <button
          className="
  testimonial-prev
  hidden lg:flex
  absolute
  left-0
  top-1/2
  -translate-y-1/2
  w-10
  h-10
  bg-gray-300
  hover:bg-black
  rounded-md
  items-center
  justify-center
  transition
  duration-300
  group
  z-10
  "
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="prev"
            width={30}
            height={10}
            className="rotate-180 group-hover:invert"
          />
        </button>

        {/* RIGHT BUTTON */}
        <button
          className="
  testimonial-next
  hidden lg:flex
  absolute
  right-0
  top-1/2
  -translate-y-1/2
  w-10
  h-10
  bg-gray-300
  hover:bg-black
  rounded-md
  items-center
  justify-center
  transition
  duration-300
  group
  z-10
  "
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="next"
            width={30}
            height={10}
            className="group-hover:invert"
          />
        </button>

      </div>
    </section>
  );
}