"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Rocket,
  Users,
  HeartHandshake,
  Leaf,
  Star,
} from "lucide-react";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

const CONTENT_KEYS = [
  "about.values.label",
  "about.values.heading",
  "about.values.val1Title",
  "about.values.val1Text",
  "about.values.val2Title",
  "about.values.val2Text",
  "about.values.val3Title",
  "about.values.val3Text",
  "about.values.val4Title",
  "about.values.val4Text",
  "about.values.val5Title",
  "about.values.val5Text",
  "about.values.val6Title",
  "about.values.val6Text",
];

const DEFAULTS: Record<string, string> = {
  "about.values.label": "Our Values",
  "about.values.heading": "We Build Values That Are Timeless, Thoughtful & Impactful.",
  "about.values.val1Title": "Integrity",
  "about.values.val1Text": "We uphold the highest standards of honesty and transparency, ensuring trust in every solution we deliver.",
  "about.values.val2Title": "Innovation",
  "about.values.val2Text": "We constantly push boundaries, blending advanced acoustics with design thinking to deliver future-ready solutions.",
  "about.values.val3Title": "Collaboration",
  "about.values.val3Text": "We work hand-in-hand with architects, designers, and clients, creating solutions that thrive on shared vision.",
  "about.values.val4Title": "Customer-centric",
  "about.values.val4Text": "We place our clients at the heart of every solution, designing experiences that reflect their needs and aspirations.",
  "about.values.val5Title": "Sustainability",
  "about.values.val5Text": "We design solutions that respect the environment, balancing performance with responsibility for a greener future.",
  "about.values.val6Title": "Excellence",
  "about.values.val6Text": "We strive for the highest standards in every detail, delivering acoustic solutions that set benchmarks in quality and design.",
};

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function ValuesSection() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  const valueCards = [
    {
      icon: <ShieldCheck size={24} strokeWidth={1.75} />,
      title: val(content, "about.values.val1Title"),
      text: val(content, "about.values.val1Text"),
    },
    {
      icon: <Rocket size={24} strokeWidth={1.75} />,
      title: val(content, "about.values.val2Title"),
      text: val(content, "about.values.val2Text"),
    },
    {
      icon: <Users size={24} strokeWidth={1.75} />,
      title: val(content, "about.values.val3Title"),
      text: val(content, "about.values.val3Text"),
    },
    {
      icon: <HeartHandshake size={24} strokeWidth={1.75} />,
      title: val(content, "about.values.val4Title"),
      text: val(content, "about.values.val4Text"),
    },
    {
      icon: <Leaf size={24} strokeWidth={1.75} />,
      title: val(content, "about.values.val5Title"),
      text: val(content, "about.values.val5Text"),
    },
    {
      icon: <Star size={24} strokeWidth={1.75} />,
      title: val(content, "about.values.val6Title"),
      text: val(content, "about.values.val6Text"),
    },
  ];

  return (
    <section className="px-4 sm:px-[40px] lg:px-[100px] py-8 sm:py-12 lg:py-16 bg-white">

      {/* ================= Heading ================= */}
      <FadeIn direction="up" className="max-w-3xl mb-6 sm:mb-10 lg:mb-12">
        <p className="text-xs sm:text-[14px] font-bold mb-1.5 sm:mb-2 worksans-font text-[#ea8e39]">
          {val(content, "about.values.label")}
        </p>

        <h2 className="text-[1.125rem] sm:text-[26px] lg:text-[30px] axiforma font-bold leading-snug sm:leading-tight text-[#111]">
          {val(content, "about.values.heading")}
        </h2>
      </FadeIn>

      {/* ================= Values Grid ================= */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 sm:gap-y-16 lg:gap-y-20 gap-x-6 sm:gap-x-12 lg:gap-x-16">
        {valueCards.map((card, idx) => (
          <StaggerItem key={idx}>
            <HoverScale>
              <ValueCard
                icon={card.icon}
                title={card.title}
                text={card.text}
              />
            </HoverScale>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

/* ================= Reusable Card ================= */
function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-3 sm:px-6">
      <div className="text-orange-500 mb-3 sm:mb-4">
        {icon}
      </div>

      <h3 className="text-lg sm:text-[25px] lg:text-[26px] font-medium inter-font text-[#1B152B] mb-2 sm:mb-3">
        {title}
      </h3>

      <p className="text-sm sm:text-[16px] lg:text-[17px] manrope font-normal text-[#1F6775] leading-relaxed max-w-xs">
        {text}
      </p>
    </div>
  );
}
