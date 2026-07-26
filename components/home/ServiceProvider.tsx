"use client";

import Image from "@/components/shared/SmartImage";
import { useEffect, useRef, useState } from "react";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

// Register the plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrambleTextPlugin);
}

const CONTENT_KEYS = [
  "home.services.image",
  "home.services.subtitle",
  "home.services.description",
  "home.services.ctaText",
  "home.services.ctaLink",
];

const DEFAULTS: Record<string, string> = {
  "home.services.image": "/assets/home/image 1.png",
  "home.services.subtitle": "Services Provided by us",
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
  const textRef = useRef<HTMLSpanElement>(null);

  const words = [
    " Manufacturers",
    " Consultants",
    " Designers of Silence",
    " Project Managers",
  ];

  // Fetch CMS Content
  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  // Animation Logic
  // Animation Logic (Clean Text Change Like Video)
  // Animation Logic (Instant Text Change Like Video)
  useEffect(() => {
    let index = 0;
    let animationTimer: gsap.core.Tween | null = null;

    const animate = () => {
      if (!textRef.current) return;

      // Direct instant change (no transition)
      textRef.current.textContent = words[index];

      index = (index + 1) % words.length;

      animationTimer = gsap.delayedCall(1.5, animate);
    };

    animate();

    return () => {
      if (animationTimer) animationTimer.kill();
    };
  }, []);

  const image = val(content, "home.services.image");
  const subtitle = val(content, "home.services.subtitle");
  const description = val(content, "home.services.description");
  const ctaText = val(content, "home.services.ctaText");
  const ctaLink = val(content, "home.services.ctaLink");

  return (
    <section className="px-4 sm:px-10 lg:px-[100px] py-10 sm:py-16 lg:py-[100px]">
      <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10">

        {/* Left Side: Image */}
        <SlideIn direction="left" className="w-full lg:w-1/2">
          {image.startsWith("http://") || image.startsWith("https://") ? (
            // eslint-disable-next-line @next/next/no-img-element -- CMS URLs may be any host
            <img
              src={image}
              alt="Library"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
            />
          ) : (
            <Image
              src={image}
              alt="Library"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          )}
        </SlideIn>

        {/* Right Side: Content */}
        <FadeIn direction="right" delay={0.1} className="w-full lg:w-[60%] text-left">
          <p className="text-xs sm:text-[15px] uppercase mb-1.5 sm:mb-2 worksans-font text-black font-bold tracking-wide sm:tracking-normal">
            {subtitle}
          </p>

          <h2 className="text-[1.0625rem] sm:text-[34px] lg:text-[40px] worksans-font text-black font-bold mb-3 sm:mb-4 leading-snug sm:leading-[46px] lg:leading-[55px]">
            We are{" "}
            <span ref={textRef} className="text-[#EA8E39]">
              Manufacturers
            </span>
          </h2>

          <p className="text-sm sm:text-[15px] font-normal worksans-font leading-relaxed sm:leading-[25px] mb-4 sm:mb-6 text-[#4F4F4F]">
            {description}
          </p>

          <a
            href={ctaLink}
            className="inline-block bg-[#EA8E39] text-white px-4 py-2 worksans-font font-semibold text-sm sm:text-[16px] cursor-pointer no-underline hover:opacity-90 transition"
          >
            {ctaText}
          </a>
        </FadeIn>

      </div>
    </section>
  );
}