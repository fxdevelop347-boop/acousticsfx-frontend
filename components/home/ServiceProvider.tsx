"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";

const CONTENT_KEYS = [
  "home.services.image",
  "home.services.subtitle",
  "home.services.title",
  "home.services.description",
  "home.services.ctaText",
  "home.services.ctaLink",
];

const DEFAULTS: Record<string, string> = {
  "home.services.image": "/assets/home/image 1.png",
  "home.services.subtitle": "Services Provided by us",
  "home.services.title": "Engineered for Performance.\nDesigned for Impact.",
  "home.services.description":
    "From sports arenas to studios, our acoustic and flooring solutions transform spaces into high-functioning, visually striking environments.",
  "home.services.ctaText": "Learn More",
  "home.services.ctaLink": "/about",
};

function val(content: ContentMap, key: string) {
  return content[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function ServiceProvider() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const image = val(content, "home.services.image");
  const subtitle = val(content, "home.services.subtitle");
  const title = val(content, "home.services.title");
  const description = val(content, "home.services.description");
  const ctaText = val(content, "home.services.ctaText");
  const ctaLink = val(content, "home.services.ctaLink");

  return (
    <section className="px-6 sm:px-10 lg:px-[100px] py-[80px] lg:py-[100px]">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Left Image */}
        <SlideIn direction="left" className="w-full lg:w-1/2">
          <Image
            src={image}
            alt="Library"
            width={800}
            height={500}
            className="w-full h-auto object-cover"
            priority
          />
        </SlideIn>

        {/* Right Content */}
        <FadeIn direction="right" delay={0.1} className="w-full lg:w-[60%] text-center lg:text-left">
          <p className="text-[15px] uppercase mb-2 worksans-font text-black font-bold">
            {subtitle}
          </p>

          <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] worksans-font text-black font-bold mb-4 leading-[38px] sm:leading-[46px] lg:leading-[55px]">
            {title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p className="text-[15px] font-[400] worksans-font leading-[25px] mb-6 text-[#4F4F4F]">
            {description}
          </p>

          <a
            href={ctaLink}
            className="inline-block bg-[#EA8E39] text-white px-6 py-3 worksans-font font-semibold text-[19px] cursor-pointer no-underline hover:opacity-90 transition"
          >
            {ctaText}
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
