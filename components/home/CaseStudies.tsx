"use client";

import Image from "next/image";
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

const FALLBACK_STUDIES = [
  { slug: "1", image: "/assets/home/image 5.png", title: "Architecture", description: "The interior of the apartments." },
  { slug: "2", image: "/assets/home/Image.png", title: "Acoustic Design", description: "Custom acoustic panels for offices." },
  { slug: "3", image: "/assets/home/image 6.png", title: "Workspace", description: "Modern workspace noise solutions." },
  { slug: "4", image: "/assets/home/image 5.png", title: "Auditorium", description: "Sound clarity for large auditoriums." },
];

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function CaseStudies() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splideRef = useRef<any>(null);
  const [studies, setStudies] = useState<CaseStudy[]>(FALLBACK_STUDIES);
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchCaseStudies()
      .then((data) => { if (data.length > 0) setStudies(data); })
      .catch(console.error);
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const heading = val(content, "home.caseStudies.heading");

  return (
    <section className="py-[80px] lg:py-[100px] bg-white overflow-hidden">

      {/* TOP CONTENT */}
      <FadeIn direction="up" duration={0.7} className="px-6 sm:px-10 lg:px-[200px] mb-14">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-20">
          <h2 className="text-[34px] sm:text-[44px] lg:text-[60px] font-[400] leading-tight axiforma max-w-xl">
            {heading.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <div className="max-w-md">
            <p className="text-[16px] sm:text-[18px] lg:text-[21px] font-[500] text-gray-600 leading-relaxed mb-6 jakarta">
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
      <div className="relative pl-6 sm:pl-10 lg:pl-[360px]">
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
          {studies.map((item, index) => (
            <SplideSlide key={item.slug}>
              <StaggerContainer>
                <StaggerItem direction="up">
                  <HoverScale className="max-w-[420px]">
                    {/* IMAGE */}
                    <div className="relative h-[220px] sm:h-[240px] lg:h-[260px] w-full mb-4">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* TEXT */}
                    <h3 className="font-semibold text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </HoverScale>
                </StaggerItem>
              </StaggerContainer>
            </SplideSlide>
          ))}
        </Splide>

        {/* CUSTOM IMAGE ARROWS */}
        <div className="flex justify-center gap-8 mt-10">
          <button
            onClick={() => splideRef.current?.splide?.go("<")}
            className="flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/assets/home/Vector.svg"
              alt="Previous"
              width={10}
              height={10}
              className="rotate-180 block"
            />
          </button>

          <button
            onClick={() => splideRef.current?.splide?.go(">")}
            className="flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/assets/home/Vector.svg"
              alt="Next"
              width={10}
              height={10}
              className="block"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
