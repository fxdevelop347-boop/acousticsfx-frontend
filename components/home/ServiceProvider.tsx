"use client";

import Image from "next/image";
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
    "Manufacturers",
    "Designers of Silence",
    "Consultants",
    "Facades Design to execution",
    "Project Managers",
  ];

  // Fetch CMS Content
  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  // Animation Logic
  useEffect(() => {
    let index = 0;
    let animationTimer: gsap.core.Tween | null = null;

    const animate = () => {
      if (!textRef.current) return;

      gsap.to(textRef.current, {
        duration: 1.2, // Consistent duration for all words
        scrambleText: {
          text: words[index],
          chars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
          revealDelay: 0.1,
          speed: 0.5,       // Uniform shuffle speed
          tweenLength: true, // Crucial: maintains visual flow during length changes
        },
        ease: "power2.out",
        onComplete: () => {
          index = (index + 1) % words.length;
          // Use delayedCall instead of setTimeout for better React/GSAP sync
          animationTimer = gsap.delayedCall(1.5, animate);
        },
      });
    };

    // Start the loop
    animate();

    // Cleanup to prevent "doubling up" or ghost animations
    return () => {
      if (textRef.current) gsap.killTweensOf(textRef.current);
      if (animationTimer) animationTimer.kill();
    };
  }, []);

  const image = val(content, "home.services.image");
  const subtitle = val(content, "home.services.subtitle");
  const description = val(content, "home.services.description");
  const ctaText = val(content, "home.services.ctaText");
  const ctaLink = val(content, "home.services.ctaLink");

  return (
    <section className="px-6 sm:px-10 lg:px-[100px] py-[80px] lg:py-[100px]">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        
        {/* Left Side: Image */}
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

        {/* Right Side: Content */}
        <FadeIn direction="right" delay={0.1} className="w-full lg:w-[60%] text-left">
          <p className="text-[15px] uppercase mb-2 worksans-font text-black font-bold">
            {subtitle}
          </p>

          <h2 className="text-[19px] sm:text-[34px] lg:text-[40px] worksans-font text-black font-bold mb-4 leading-[28px] sm:leading-[46px] lg:leading-[55px]">
            We are{" "}
            <span ref={textRef} className="text-[#EA8E39]">
              Manufacturers
            </span>
          </h2>

          <p className="text-[15px] font-[400] worksans-font leading-[25px] mb-6 text-[#4F4F4F]">
            {description}
          </p>

          <a
            href={ctaLink}
            className="inline-block bg-[#EA8E39] text-white px-4 py-2 worksans-font font-semibold text-[16px] cursor-pointer no-underline hover:opacity-90 transition"
          >
            {ctaText}
          </a>
        </FadeIn>

      </div>
    </section>
  );
}