"use client";

import Image from "@/components/shared/SmartImage";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import "swiper/css";
import "swiper/css/pagination";

const CONTENT_KEYS = [
  "home.hero.title",
  "home.hero.subtitle",
  "home.hero.button1Label",
  "home.hero.button2Label",
  "home.hero.backgroundVideo",
  "home.hero.featureBoxes",
];

const DEFAULTS: Record<string, string> = {
  "home.hero.title":
    "We take pride in building stylish and featured acoustic solution.",
  "home.hero.subtitle":
    "Our solutions are engineered for clarity, comfort, and visual harmony. Whether it's a studio, auditorium or workspace, we bring together design precision and acoustic mastery to elevate every square foot.",
  "home.hero.button1Label": "Get Quote →",
  "home.hero.button2Label": "Connect With Us →",
  "home.hero.backgroundVideo": "/assets/home/hero.mp4",
};

interface FeatureBox {
  title: string;
  description: string;
  /** Shorter copy for mobile carousel (full text, no “Read more”) */
  mobileDescription: string;
  image: string;
  accentColor: string;
}

const DEFAULT_FEATURE_BOXES: FeatureBox[] = [
  {
    title: "Acoustic Solution",
    description:
      "Premium acoustical solutions crafted to enhance clarity, reduce echo and elevate the ambience of any space. Ideal for offices, hotels, residences, studios, auditoriums and wellness environments, our panels blend design with performance to create interiors that sound as refined as they look.",
    mobileDescription:
      "Premium panels for clarity and less echo—offices, hotels, studios and homes. Design-led acoustics that look as refined as they sound.",
    image: "/assets/home/fi_11062015.png",
    accentColor: "yellow-400",
  },
  {
    title: "Hard wood Flooring",
    description:
      "Timeless, elegant and crafted for durability, our hardwood flooring brings natural warmth and architectural luxury to any interior. Designed for high-end homes, hospitality spaces, offices and premium commercial environments, Fx Acoustics' real wooden flooring delivers refined aesthetics with exceptional performance and long-lasting comfort.",
    mobileDescription:
      "Natural wood warmth and durability for high-end homes, hospitality and premium commercial spaces—lasting comfort with refined aesthetics.",
    image: "/assets/home/fi_7821525.png",
    accentColor: "orange-400",
  },
  {
    title: "Soundproofing",
    description:
      "Advanced sound-isolation systems engineered to block external noise and ensure complete privacy. Perfect for homes, corporate cabins, studios, hospitality spaces, healthcare rooms and industrial zones, our solutions deliver silence, comfort and absolute acoustic control.",
    mobileDescription:
      "Isolation systems that block outside noise and add privacy—homes, offices, studios, healthcare and quiet zones.",
    image: "/assets/home/fi_17991697.png",
    accentColor: "blue-400",
  },
];

const ACCENT_MAP: Record<string, { border: string; text: string }> = {
  "yellow-400": { border: "bg-yellow-400", text: "text-yellow-400" },
  "orange-400": { border: "bg-orange-400", text: "text-orange-400" },
  "blue-400": { border: "bg-blue-400", text: "text-blue-400" },
};


function MobileFeatureCarousel({ boxes }: { boxes: FeatureBox[] }) {
  const paginationRef = useRef<HTMLDivElement>(null);

  const paginationClassName = [
    "flex w-full flex-wrap items-center justify-center gap-0",
    "[&_.swiper-pagination-bullet]:mx-0.5 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/25! [&_.swiper-pagination-bullet]:opacity-100!",
    "[&_.swiper-pagination-bullet-active]:w-6! [&_.swiper-pagination-bullet-active]:rounded-full! [&_.swiper-pagination-bullet-active]:bg-amber-500!",
  ].join(" ");

  return (
    <div className="flex w-full flex-col-reverse gap-4">
      {/* Mount first so ref exists when Swiper onBeforeInit runs; flex-col-reverse keeps card above dots visually. */}
      <div ref={paginationRef} className={paginationClassName} />
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        autoHeight
        loop={boxes.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        onBeforeInit={(swiper) => {
          const p = swiper.params.pagination;
          if (paginationRef.current && p && typeof p === "object") {
            p.el = paginationRef.current;
          }
        }}
        className="w-full overflow-visible"
      >
        {boxes.map((box) => {
          const accent = ACCENT_MAP[box.accentColor];
          return (
            <SwiperSlide key={box.title} className="h-auto!">
              <div className="relative w-full rounded-lg border border-white/10 bg-black/40 px-4 py-4">
                <span
                  className={`absolute left-0 top-0 h-full w-[3px] rounded-l-lg ${accent.border}`}
                />
                <div className="flex items-center gap-3">
                  <Image
                    src={box.image}
                    alt={box.title}
                    width={44}
                    height={44}
                    sizes="44px"
                    quality={80}
                    className="size-[44px] shrink-0 object-contain"
                  />
                  <h3
                    className={`min-w-0 flex-1 text-left text-[15px] font-bold leading-tight poppins-font ${accent.text}`}
                  >
                    {box.title}
                  </h3>
                </div>
                <p className="mt-3 text-left text-[14px] leading-relaxed font-normal poppins-font text-gray-300">
                  {box.mobileDescription}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

function val(content: ContentMap, key: string) {
  return content[key]?.value ?? DEFAULTS[key] ?? "";
}

const HERO_POSTER = "/assets/home/hero-poster.jpg";

/** Skip the heavy hero video on data-saver mode or slow (2G/3G) connections. */
function prefersLightHero(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return ["slow-2g", "2g", "3g"].includes(conn.effectiveType ?? "");
}

function HeroBackgroundVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Start with no video source; only attach it when we decide to load (fast connection + in view).
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    // Low-bandwidth / data-saver users keep the lightweight poster only.
    if (prefersLightHero()) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVideoSrc(src);
          io.disconnect();
        }
      },
      { rootMargin: "320px 0px 0px 0px", threshold: 0 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    if (videoSrc) videoRef.current?.play().catch(() => {});
  }, [videoSrc]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${HERO_POSTER})` }}
    >
      {videoSrc && (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          poster={HERO_POSTER}
          loop
          muted
          playsInline
          preload="none"
          className="h-full w-full object-cover brightness-125 contrast-105"
        />
      )}
    </div>
  );
}

export default function HomeHero() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const bgVideo = val(content, "home.hero.backgroundVideo");

  return (
    <section className="relative flex w-full flex-col overflow-hidden md:min-h-[58vh] lg:min-h-[64vh]">
      {/* Background video: 55vh on mobile (clear view), full-bleed on md+ */}
      <div className="absolute left-0 right-0 top-0 z-0 h-[55vh] md:inset-0 md:h-auto md:min-h-[58vh] lg:min-h-[64vh]">
        <HeroBackgroundVideo src={bgVideo} />
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 bottom-0 z-1 h-full w-full bg-black/40" />

      {/* Heading: centered in mobile; desktop top-aligned with refined padding */}
      <div className="relative z-10 flex h-[55vh] flex-col items-center justify-center px-4 pb-4 pt-4 text-center text-white md:h-auto md:min-h-[58vh] lg:min-h-[64vh] md:justify-start md:px-4 md:pb-8 md:pt-[60px] lg:pt-[72px]">
        <FadeIn direction="up">
          <h1 className="max-w-5xl text-xl leading-tight sm:text-[30px] lg:text-[44px] font-bold playfair-display">
            {val(content, "home.hero.title")}
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-center text-xs text-gray-200 leading-relaxed sm:mt-3 sm:text-xs">
            {val(content, "home.hero.subtitle")}
          </p>
        </FadeIn>

        {/* Desktop / tablet: feature cards on the video */}
        <FadeIn className="mt-4 hidden w-full sm:mt-6 md:block">
          <StaggerContainer className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-4 sm:gap-6">
            {DEFAULT_FEATURE_BOXES.map((box, index) => {
              const accent = ACCENT_MAP[box.accentColor];

              return (
                <StaggerItem
                  key={box.title}
                  direction="up"
                  className="relative w-full bg-black/50 px-4 py-4 sm:w-[360px] sm:px-6 sm:py-5"
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-[3px] ${accent.border}`}
                  />

                  <Image
                    src={box.image}
                    alt={box.title}
                    width={40}
                    height={40}
                    sizes="40px"
                    quality={80}
                    loading="lazy"
                    className="mb-3"
                  />

                  <h3
                    className={`mb-2 text-left text-[13px] font-bold poppins-font ${accent.text}`}
                  >
                    {box.title}
                  </h3>

                  <p className="text-left text-[12px] font-normal poppins-font text-gray-300 leading-relaxed line-clamp-3">
                    {box.mobileDescription}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </FadeIn>
      </div>

      {/* Mobile only: carousel below the video with short full copy */}
      <div className="relative z-10 border-t border-white/5 bg-[#121212] px-4 py-8 md:hidden">
        <MobileFeatureCarousel boxes={DEFAULT_FEATURE_BOXES} />
      </div>
    </section>
  );
}