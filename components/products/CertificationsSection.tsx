"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SubProductCertification } from "@/lib/products-api";

export default function CertificationsSection({
  certifications: apiCerts,
  sectionTitle,
  sectionDescription,
}: {
  certifications?: SubProductCertification[] | null;
  sectionTitle?: string | null;
  sectionDescription?: string | null;
}) {
  const list =
    apiCerts?.filter((c) => c.name?.trim() && c.image?.trim()) ?? [];

  const [index, setIndex] = useState(0);
  const [stride, setStride] = useState(0);
  const [cellWidth, setCellWidth] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, list.length - 1);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const vw = window.innerWidth;
      const gapRaw = getComputedStyle(track).gap || getComputedStyle(track).columnGap;
      const gapParsed = gapRaw ? parseFloat(gapRaw) : NaN;
      const gap = Number.isFinite(gapParsed) ? gapParsed : vw >= 640 ? 32 : 24;

      let cardW: number;
      if (vw >= 1024) cardW = 300;
      else if (vw >= 640) cardW = 280;
      else cardW = Math.max(260, viewport.clientWidth);

      setCellWidth(cardW);
      setStride(cardW + (Number.isFinite(gap) ? gap : 24));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list.length]);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [list.length, maxIndex]);

  if (list.length === 0) {
    return null;
  }

  const title = (sectionTitle?.trim() || "Certifications").trim();
  const description = sectionDescription?.trim() ?? "";

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const translateX = stride > 0 ? -(index * stride) : 0;

  return (
    <section className="w-full bg-white px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">
      <div className="max-w-2xl mb-8 sm:mb-10">
        <h2 className="text-[28px] sm:text-[30px] lg:text-[34px] font-bold axiforma mb-3">
          {title}
        </h2>
        {description ? (
          <p className="text-[14px] sm:text-[15px] inter-font font-[400] text-gray-600">
            {description}
          </p>
        ) : null}
      </div>

      <div ref={viewportRef} className="relative w-full max-w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max max-w-none gap-6 transition-transform duration-500 ease-out sm:gap-8"
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            willChange: "transform",
          }}
        >
          {list.map((item, i) => (
            <div
              key={`${item.image}-${i}`}
              className="flex shrink-0 flex-col items-center"
              style={
                cellWidth != null
                  ? { width: cellWidth, flex: "0 0 auto" }
                  : { width: "min(100%, 260px)", flex: "0 0 auto" }
              }
            >
              <div className="flex h-[260px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white p-4 sm:h-[280px] lg:h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS URLs may be any host */}
                <img
                  src={item.image}
                  alt={item.name}
                  width={260}
                  height={260}
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </div>
              <p className="mt-4 text-center text-[16px] font-[400] tracking-wide text-gray-500 inter-font sm:text-[18px]">
                {item.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>

        {list.length > 1 && (
          <div className="mt-6 flex justify-center gap-8 sm:mt-8">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="cursor-pointer transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous certifications"
            >
              <Image
                src="/assets/home/universalvector.svg"
                alt=""
                width={34}
                height={14}
                className="rotate-180"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index >= maxIndex}
              className="cursor-pointer transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next certifications"
            >
              <Image
                src="/assets/home/universalvector.svg"
                alt=""
                width={34}
                height={14}
                aria-hidden
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
