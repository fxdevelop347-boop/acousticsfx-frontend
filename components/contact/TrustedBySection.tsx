"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchTrustedPartners, type TrustedPartner } from "@/lib/trusted-partners-api";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, HoverScale } from "@/components/animations";

const CONTENT_KEYS = ["contact.trustedBy.title", "contact.trustedBy.description"];

const DEFAULTS: Record<string, string> = {
  "contact.trustedBy.title": "Trusted By Industry Leaders",
  "contact.trustedBy.description":
    "Join our roster of satisfied clients and experience the exceptional results and service that have earned us the trust of industry leaders worldwide.",
};

const FALLBACK_LOGOS: { name: string; logo: string }[] = [
  { name: "REET Global Advisors", logo: "/assets/about/image 7.png" },
  { name: "Pidilite", logo: "/assets/about/image 5 (1).png" },
  { name: "Goldman Sachs", logo: "/assets/about/image 3.png" },
  { name: "Norwest Venture Partners", logo: "/assets/about/image 1 (1).png" },
  { name: "BI", logo: "/assets/about/image 2.png" },
];

function val(content: ContentMap, key: string) {
  return content[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function TrustedBySection() {
  const [content, setContent] = useState<ContentMap>({});
  const [partners, setPartners] = useState(FALLBACK_LOGOS);

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
    fetchTrustedPartners()
      .then((data) => {
        if (data.length > 0) {
          setPartners(data.map((p) => ({ name: p.name, logo: p.logo })));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="px-[16px] sm:px-[40px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] bg-white text-center">

      <FadeIn direction="up">
        <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#111] mb-4 poppins">
          {val(content, "contact.trustedBy.title")}
        </h2>

        <p className="text-gray-500 max-w-2xl worksans-font font-[400] text-[16px] sm:text-[18px] lg:text-[20px] mx-auto mb-10 sm:mb-12 lg:mb-14 leading-relaxed">
          {val(content, "contact.trustedBy.description")}
        </p>
      </FadeIn>

      {/* Animated Logos */}
      <div className="overflow-hidden w-full">
        <div className="flex w-max animate-marquee-left items-center gap-8 sm:gap-10 lg:gap-12">
          {[...partners, ...partners].map((p, i) => (
            <HoverScale key={i}>
              <LogoItem src={p.logo} alt={p.name} />
            </HoverScale>
          ))}
        </div>
      </div>

    </section>
  );
}

function LogoItem({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center justify-center transition relative h-12 sm:h-14 lg:h-16 w-[120px] sm:w-[140px] lg:w-[160px] shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
      />
    </div>
  );
}