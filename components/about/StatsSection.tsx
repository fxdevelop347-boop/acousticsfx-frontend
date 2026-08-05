"use client";

import { useEffect, useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { fetchContent, type ContentMap } from "@/lib/content-api";

const CONTENT_KEYS = [
  "about.stats.title",
  "about.stats.subtitle",
  "about.stats.stat1Value",
  "about.stats.stat1Label",
  "about.stats.stat2Value",
  "about.stats.stat2Label",
  "about.stats.stat3Value",
  "about.stats.stat3Label",
  "about.stats.stat4Value",
  "about.stats.stat4Label",
];

const DEFAULTS: Record<string, string> = {
  "about.stats.title": "This is Our result",
  "about.stats.subtitle": "How capable we are at work shines through in every endeavor.",
  "about.stats.stat1Value": "321+",
  "about.stats.stat1Label": "Acoustic Products",
  "about.stats.stat2Value": "13K+",
  "about.stats.stat2Label": "Sq. Ft. Delivered",
  "about.stats.stat3Value": "25+",
  "about.stats.stat3Label": "Industry Awards",
  "about.stats.stat4Value": "15+",
  "about.stats.stat4Label": "Years Experience",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function StatsSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const statsList = [
    {
      val: val(content, "about.stats.stat1Value"),
      label: val(content, "about.stats.stat1Label"),
    },
    {
      val: val(content, "about.stats.stat2Value"),
      label: val(content, "about.stats.stat2Label"),
    },
    {
      val: val(content, "about.stats.stat3Value"),
      label: val(content, "about.stats.stat3Label"),
    },
    {
      val: val(content, "about.stats.stat4Value"),
      label: val(content, "about.stats.stat4Label"),
    },
  ];

  return (
    <section className="bg-[#1F6775] text-white px-4 sm:px-[40px] lg:px-[100px] py-3 sm:py-6">
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-2 sm:gap-x-6 sm:gap-y-3 lg:gap-6 items-start lg:items-center">
        {/* Intro */}
        <FadeIn
          direction="up"
          className="col-span-2 lg:col-span-1 w-full pb-1 lg:pb-0"
        >
          <h3 className="font-bold poppins-font text-sm sm:text-xl lg:text-2xl leading-snug">
            {val(content, "about.stats.title")}
          </h3>
          <p className="text-[11px] sm:text-xs lg:text-sm text-white/80 poppins-font font-normal mt-0.5 sm:mt-1 leading-snug max-w-md">
            {val(content, "about.stats.subtitle")}
          </p>
        </FadeIn>

        {statsList.map((s, idx) => (
          <StaggerItem key={idx}>
            <div className="min-w-0">
              <p className="font-bold poppins-font text-xl sm:text-3xl lg:text-4xl leading-none tracking-tight">
                {s.val}
              </p>
              <p className="text-[10px] sm:text-xs lg:text-sm text-white/80 poppins-font font-normal mt-0.5 leading-tight">
                {s.label}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
