"use client";

import Image from "@/components/shared/SmartImage";
import { FadeIn, HoverScale } from "@/components/animations";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const applications = [
  {
    title: "OFFICES",
    subtitle: "Workplaces that work better",
    image: "/assets/about/Rectangle 59.png",
  },
  {
    title: "EDUCATION",
    subtitle: "Create spaces to inspire",
    image: "/assets/about/6d475af8e833a39bf05332dcf051bd2d05e4d822.png",
  },
  {
    title: "RETAIL",
    subtitle: "Workplaces that work better",
    image: "/assets/about/90c93904193b3102144eed3522817c9a15dbd531.png",
  },
  {
    title: "HOSPITALITY",
    subtitle: "Spaces that welcome and inspire",
    image: "/assets/about/Rectangle 59.png",
  },
  {
    title: "HEALTHCARE",
    subtitle: "Quiet environments for healing",
    image: "/assets/about/6d475af8e833a39bf05332dcf051bd2d05e4d822.png",
  },
];

export default function ApplicationsSection() {

  return (
    <section className="relative px-4 sm:px-[40px] lg:px-[100px] py-10 sm:py-[75px] lg:py-[90px] overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/about/sliderbg.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/85"></div>
      </div>

      {/* Heading */}
      <FadeIn
        direction="up"
        className="flex flex-col lg:flex-row justify-between items-start mb-6 sm:mb-8 gap-4 sm:gap-6"
      >

        <h2 className="text-xl sm:text-[38px] lg:text-[45px] worksans-font font-bold text-[#111] leading-snug">
          Our Applications
        </h2>

        <p className="text-gray-600 max-w-lg leading-relaxed worksans-font font-normal text-sm sm:text-[18px] lg:text-[20px]">
          FX Acoustics solutions blend performance with aesthetics,
          transforming offices, hospitality, education, and residences.
          From clarity in boardrooms to comfort at home, we craft acoustic
          experiences people truly love.
        </p>

      </FadeIn>

      {/* SLIDER */}
      <div className="relative mt-4 sm:mt-6">

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".applications-next",
            prevEl: ".applications-prev",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={24}
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

          {applications.map((app, i) => (

            <SwiperSlide key={i}>

              <HoverScale>

                <ApplicationCard
                  title={app.title}
                  subtitle={app.subtitle}
                  image={app.image}
                />

              </HoverScale>

            </SwiperSlide>

          ))}

        </Swiper>

        {/* LEFT ARROW (desktop only) */}
        <button
          className="
          applications-prev
          hidden sm:flex
          absolute
          left-0
          top-1/2
          -translate-y-1/2
          w-10
          h-10
          bg-white/90
          shadow
          items-center
          justify-center
          z-10
          "
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="Previous"
            width={24}
            height={10}
            className="rotate-180"
          />
        </button>

        {/* RIGHT ARROW (desktop only) */}
        <button
          className="
          applications-next
          hidden sm:flex
          absolute
          right-0
          top-1/2
          -translate-y-1/2
          w-10
          h-10
          bg-white/90
          shadow
          items-center
          justify-center
          z-10
          "
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="Next"
            width={24}
            height={10}
          />
        </button>

      </div>
    </section>
  );
}

function ApplicationCard({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {

  return (
    <div className="relative h-[220px] sm:h-[300px] lg:h-[320px] overflow-hidden group">

      <Image
        src={image}
        alt={`${title} acoustic solutions`}
        fill
        className="object-cover group-hover:scale-105 transition duration-500"
      />

      <div className="absolute inset-0 bg-black/35"></div>

      <div className="absolute bottom-5 left-5 text-white">

        <h3 className="text-lg font-semibold tracking-wide">
          {title}
        </h3>

        <p className="text-xs text-white/80 mt-1">
          {subtitle}
        </p>

      </div>

    </div>
  );
}