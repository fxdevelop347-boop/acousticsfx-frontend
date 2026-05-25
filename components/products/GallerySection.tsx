"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SubProductGalleryImage } from "@/lib/products-api";

const DEFAULT_GALLERY: SubProductGalleryImage[] = [
  { url: "/assets/product/gallery-image-2.png", alt: "Gallery image" },
  { url: "/assets/product/gallery-image-1.jpg", alt: "Gallery image" },
  { url: "/assets/product/gallery-image-2.png", alt: "Gallery image" },
  { url: "/assets/product/gallery-image-1.jpg", alt: "Gallery image" },
];

interface GallerySectionProps {
  galleryImages?: SubProductGalleryImage[] | null;
  brochureUrl?: string;
}

export default function GallerySection({ galleryImages, brochureUrl }: GallerySectionProps = {}) {
  const images = galleryImages && galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY;
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta > 0) prev();
    else next();
  };

  const current = images[currentIndex];

  return (
    <section className="w-full bg-white px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
        <h2 className="text-[28px] font-bold manrope sm:text-[32px] lg:text-[35px]">
          Gallery
        </h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
          <Link
            href="/contactus"
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm transition hover:bg-gray-100 sm:w-auto sm:flex-none"
          >
            Get Quote
            <Image
              src="/assets/home/universalvector.svg"
              alt=""
              width={34}
              height={14}
              aria-hidden
            />
          </Link>
          {brochureUrl?.trim() ? (
            <a
              href={brochureUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-amber-500/60 bg-white/5 px-5 py-2 text-xs font-medium text-amber-400 transition-colors hover:border-amber-400 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 sm:w-auto sm:flex-none sm:text-sm"
            >
              Download brochure
            </a>
          ) : null}
        </div>
      </div>

      {/* Single-image carousel */}
      <div className="relative mx-auto max-w-6xl">
        <div
          className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:aspect-video lg:aspect-auto lg:h-[min(56vw,520px)] lg:max-h-[520px]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            key={current?.url + currentIndex}
            src={current?.url ?? ""}
            alt={current?.alt ?? "Gallery"}
            fill
            sizes="(max-width: 1024px) 100vw, min(1152px, 90vw)"
            className="object-cover object-center transition-opacity duration-300"
            priority={currentIndex === 0}
          />

          {/* Edge arrows (desktop + large tap targets on mobile) */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white sm:left-4 sm:h-11 sm:w-11"
          >
            <Image
              src="/assets/home/universalvector.svg"
              alt=""
              width={20}
              height={10}
              className="rotate-180"
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white sm:right-4 sm:h-11 sm:w-11"
          >
            <Image
              src="/assets/home/universalvector.svg"
              alt=""
              width={20}
              height={10}
              aria-hidden
            />
          </button>
        </div>

        {/* Dots + slide counter (arrows are on the image) */}
        <div className="mt-5 flex flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex items-center justify-center gap-2">
            {images.map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === currentIndex}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-8 bg-[#1F6775]" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <p className="text-sm tabular-nums text-gray-600">
            {currentIndex + 1} / {total}
          </p>
        </div>
      </div>
    </section>
  );
}
