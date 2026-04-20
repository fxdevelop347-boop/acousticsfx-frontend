"use client";

import Image from "next/image";
import { fetchTestimonials, type Testimonial } from "@/lib/testimonials-api";
import { useAsyncData } from "@/hooks/useAsyncData";
import Spinner from "@/components/shared/Spinner";
import { FadeIn } from "@/components/animations";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function Testimonials() {

  const { data: testimonials, loading, error } =
    useAsyncData<Testimonial[]>(fetchTestimonials);

  const items = testimonials ?? [];

  if (loading) {
    return (
      <section className="px-4 sm:px-10 lg:px-[100px] py-10 sm:py-16 lg:py-[100px] bg-white">
        <FadeIn direction="up">
          <h2 className="text-left lg:text-center text-[1.375rem] sm:text-[44px] lg:text-[60px] font-bold mb-8 sm:mb-12 leading-tight">
            Loved by the world&apos;s best teams
          </h2>
        </FadeIn>

        <div className="flex justify-center py-6 sm:py-10">
          <Spinner size="sm" />
        </div>
      </section>
    );
  }

  if (error) return <p className="text-center">{error}</p>;
  if (items.length === 0) return null;

  return (
    <section className="px-4 sm:px-10 lg:px-[100px] py-8 sm:py-12 lg:py-[100px] bg-white">

      {/* HEADING */}
      <FadeIn direction="up">
        <h2 className="text-left lg:text-center text-[1.375rem] sm:text-[44px] lg:text-[60px] font-bold mb-8 sm:mb-12 lg:mb-16 leading-tight">
          Loved by the world&apos;s best teams
        </h2>
      </FadeIn>

      <div className="relative">

        {/* SLIDER */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
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
              p-4
              sm:p-7
              lg:p-8
              bg-white
              h-full
              ">

                {/* LOGO */}
                {item.companyLogo && (
                  <div className="relative w-[140px] sm:w-[180px] lg:w-[200px] h-[52px] sm:h-[70px] lg:h-[80px] mb-4 sm:mb-6">
                    <Image
                      src={item.companyLogo}
                      alt={item.company}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {/* TEXT */}
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-10 leading-relaxed">
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