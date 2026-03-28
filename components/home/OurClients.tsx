"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchClients, type ClientLogo } from "@/lib/clients-api";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const CONTENT_KEYS = ["home.clients.title", "home.clients.backgroundImage"];

const DEFAULTS: Record<string, string> = {
  "home.clients.title": "Our Valuable Clients",
  "home.clients.backgroundImage": "/assets/home/mask.jpg",
};

const FALLBACK_LOGOS = [
  "/assets/home/client_1.svg",
  "/assets/home/client_1 (1).svg",
  "/assets/home/client_1 (2).svg",
  "/assets/home/client_1 (3).svg",
  "/assets/home/client_1 (4).svg",
  "/assets/home/client_1 (5).svg",
  "/assets/home/client_1 (6).svg",
  "/assets/home/client_1 (7).svg",
  "/assets/home/client_1 (4).svg",
];

function val(content: ContentMap, key: string) {
  return content[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function OurClients() {
  const [content, setContent] = useState<ContentMap>({});
  const [logos, setLogos] = useState<string[]>(FALLBACK_LOGOS);

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
    fetchClients()
      .then((clients) => {
        if (clients.length > 0) {
          setLogos(clients.map((c) => c.logo));
        }
      })
      .catch(console.error);
  }, []);

  const bgImage = val(content, "home.clients.backgroundImage");
  const title = val(content, "home.clients.title");

  return (
    <section className="relative h-[420px] sm:h-[500px] lg:h-[580px] overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Clients Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-[#1d4a77]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-white/10" />

      {/* CONTENT */}
      <div className="relative z-10 h-full px-6 sm:px-10 lg:px-16 xl:px-24 flex flex-col justify-center">
        <FadeIn direction="up">
          <h2 className="text-center text-white text-2xl font-semibold mb-10 sm:mb-14 lg:mb-16">
            {title}
          </h2>
        </FadeIn>

        {/* ================= DESKTOP (STATIC) ================= */}
{/* ================= DESKTOP (ANIMATED) ================= */}
<div className="hidden lg:flex flex-col items-center gap-[91px] overflow-hidden">
  
  {/* ROW 1 (Left → Right) */}
  <div className="overflow-hidden w-full">
    <div className="flex w-max animate-marquee-left gap-[91px]">
      {[...logos.slice(0, Math.ceil(logos.length / 2)), ...logos.slice(0, Math.ceil(logos.length / 2))].map((logo, index) => (
        <LogoCard key={index} logo={logo} />
      ))}
    </div>
  </div>

  {/* ROW 2 (Right → Left) */}
  <div className="overflow-hidden w-full">
    <div className="flex w-max animate-marquee-right gap-[91px]">
      {[...logos.slice(Math.ceil(logos.length / 2)), ...logos.slice(Math.ceil(logos.length / 2))].map((logo, index) => (
        <LogoCard key={index} logo={logo} />
      ))}
    </div>
  </div>

</div>

        {/* ================= MOBILE / TABLET (DOUBLE SLIDER) ================= */}
        <div className="lg:hidden overflow-hidden space-y-6">
          {/* ROW 1 (Left → Right) */}
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee-left gap-6">
              {[...logos, ...logos].map((logo, index) => (
                <LogoCard key={index} logo={logo} small />
              ))}
            </div>
          </div>

          {/* ROW 2 (Right → Left) */}
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee-right gap-6">
              {[...logos, ...logos].map((logo, index) => (
                <LogoCard key={index} logo={logo} small />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCard({ logo, small }: { logo: string; small?: boolean }) {
  return (
    <div
      className="bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0"
      style={{
        width: small ? "120px" : "185px",   // 🔥 aur chhota
height: small ? "60px" : "90px",
        padding: "12px",
      }}
    >
      <div className="relative w-full h-full">
        <Image src={logo} alt="Client Logo" fill className="object-contain" />
      </div>
    </div>
  );
}