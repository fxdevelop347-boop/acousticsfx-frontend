"use client";

import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { fetchCaseStudies, type CaseStudy } from "@/lib/case-studies-api";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, HoverScale, StaggerContainer, StaggerItem } from "@/components/animations";

const CONTENT_KEYS = [
  "home.caseStudies.heading",
  "home.caseStudies.subheading",
  "home.caseStudies.ctaLabel",
];

const DEFAULTS: Record<string, string> = {
  "home.caseStudies.heading": "CASE STUDIES THAT \nINSPIRE US",
  "home.caseStudies.subheading":
    "A premium workspace faced disruptive noise and poor sound clarity. We designed and installed bespoke acoustic panels tailored to their architecture. The result: enhanced productivity, elegant aesthetics, and a healthier environment.",
  "home.caseStudies.ctaLabel": "VIEW ALL CASESTUDIES →",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function CaseStudies() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splideRef = useRef<any>(null);
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  // Until the fetch settles there is nothing truthful to show, so the section
  // stays out of the page rather than flashing placeholder cards.
  const [resolved, setResolved] = useState(false);
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchCaseStudies()
      .then(setStudies)
      .catch(console.error)
      .finally(() => setResolved(true));
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  // No published case studies means no case studies section. An empty band under
  // a "case studies that inspire us" heading is worse than the section's absence,
  // and inventing sample projects would put fiction on the homepage.
  if (!resolved || studies.length === 0) return null;

  const heading = val(content, "home.caseStudies.heading");

  return (
    <section className="py-10 sm:py-16 lg:py-[100px] bg-white overflow-hidden">

      {/* TOP CONTENT */}
      <FadeIn direction="up" duration={0.7} className="px-4 sm:px-10 lg:px-[200px] mb-8 sm:mb-14">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-10 lg:gap-20">
          <h2 className="text-[1.625rem] sm:text-[44px] lg:text-[60px] font-normal leading-tight axiforma max-w-xl">
            {heading.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <div className="max-w-md">
            <p className="text-sm sm:text-[18px] lg:text-[21px] font-medium text-gray-600 leading-relaxed mb-4 sm:mb-6 jakarta">
              {val(content, "home.caseStudies.subheading")}
            </p>

            <Link
              href="/resources/casestudy"
              className="border px-4 py-2 text-xs cursor-pointer"
            >
              {val(content, "home.caseStudies.ctaLabel")}
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* SLIDER */}
      <div className="relative pl-4 sm:pl-10 lg:pl-[360px]">
        <Splide
          options={{
            type: "loop",
            perPage: 3,
            perMove: 1,
            gap: "24px",
            arrows: false,
            pagination: false,
            drag: true,
            breakpoints: {
              1024: { perPage: 2 },
              640: { perPage: 1 },
            },
          }}
          ref={splideRef}
        >
          {studies.map((item) => {
            const card = (
              <>
                {/* IMAGE */}
                <div className="relative h-[180px] sm:h-[240px] lg:h-[260px] w-full mb-3 sm:mb-4 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* TEXT — clamped because `description` is the full summary the
                    admin wrote, which can run to many paragraphs. Unclamped it
                    stretches the slide, and Splide sizes every slide to the
                    tallest one. */}
                <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.description}
                </p>
              </>
            );

            return (
              <SplideSlide key={item.slug}>
                <StaggerContainer>
                  <StaggerItem direction="up">
                    <HoverScale className="max-w-[420px]">
                      <Link
                        href={`/resources/casestudy/${item.slug}`}
                        className="block cursor-pointer"
                      >
                        {card}
                      </Link>
                    </HoverScale>
                  </StaggerItem>
                </StaggerContainer>
              </SplideSlide>
            );
          })}
        </Splide>

        {/* CUSTOM IMAGE ARROWS */}
        <div className="flex justify-center gap-8 mt-6 sm:mt-10">
          <button
            type="button"
            onClick={() => splideRef.current?.splide?.go("<")}
            className="flex items-center justify-center cursor-pointer"
            aria-label="Show previous case studies"
          >
            <Image
              src="/assets/home/Vector.svg"
              alt=""
              width={10}
              height={10}
              className="rotate-180 block"
              aria-hidden
            />
          </button>

          <button
            type="button"
            onClick={() => splideRef.current?.splide?.go(">")}
            className="flex items-center justify-center cursor-pointer"
            aria-label="Show next case studies"
          >
            <Image
              src="/assets/home/Vector.svg"
              alt=""
              width={10}
              height={10}
              className="block"
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>
  );
}
