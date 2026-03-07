"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

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
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, applications.length - 3));
  };

  return (
    <section className="relative px-[16px] sm:px-[40px] lg:px-[100px] py-[60px] sm:py-[75px] lg:py-[90px] overflow-hidden">

      {/* Background Image + Fade */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/about/sliderbg.jpg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-white/85"></div>
      </div>

      {/* Heading */}
      <FadeIn
        direction="up"
        className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6"
      >
        <h2 className="text-[30px] sm:text-[38px] lg:text-[45px] worksans-font font-bold text-[#111]">
          Our Applications
        </h2>

        <p className="text-gray-600 max-w-lg leading-relaxed worksans-font font-[400] text-[16px] sm:text-[18px] lg:text-[20px]">
          FX Acoustics solutions blend performance with aesthetics,
          transforming offices, hospitality, education, and residences.
          From clarity in boardrooms to comfort at home, we craft acoustic
          experiences people truly love.
        </p>
      </FadeIn>

      {/* Cards + Arrows */}
      <div className="relative mt-6 px-0 sm:px-10 lg:px-20">
        <div className="relative overflow-hidden">
          <StaggerContainer
            className="flex gap-6 transition-transform duration-500"
            style={{
              transform: `translateX(-${index * (100 / 3)}%)`,
            }}
          >
            {applications.map((app, i) => (
              <StaggerItem
                key={i}
                direction="up"
                className="min-w-[100%] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] flex-shrink-0"
              >
                <HoverScale>
                  <ApplicationCard
                    title={app.title}
                    subtitle={app.subtitle}
                    image={app.image}
                  />
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          disabled={index === 0}
          className="absolute left-0 sm:left-[-10px] lg:left-[-0px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow flex items-center justify-center hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="Previous"
            width={24}
            height={10}
            className="rotate-180"
          />
        </button>

        <button
          onClick={next}
          disabled={index >= applications.length - 3}
          className="absolute right-0 sm:right-[-10px] lg:right-[-0px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow flex items-center justify-center hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
    <div className="relative h-[260px] sm:h-[300px] lg:h-[320px] overflow-hidden group">
      <Image
        src={image}
        alt={`${title} — acoustic solutions for ${title.toLowerCase()} spaces`}
        fill
        className="object-cover group-hover:scale-105 transition duration-500"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/35"></div>

      {/* Text */}
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
