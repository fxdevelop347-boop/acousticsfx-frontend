"use client";

import Image from "@/components/shared/SmartImage";
import { useCallback, useEffect, useState } from "react";
import type { CaseStudyGalleryImage } from "@/lib/case-studies-api";

interface GalleryLightboxProps {
  images: CaseStudyGalleryImage[];
  /** Used to build alt text for photos the admin left uncaptioned. */
  title: string;
}

/**
 * Project gallery with a full-screen viewer. Gallery photos are the main proof
 * of the work, and the grid crops them hard, so every tile opens at full size.
 */
export default function GalleryLightbox({ images, title }: GalleryLightboxProps) {
  // The index of the photo being viewed, or null when the grid is closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) => {
        if (current === null) return current;
        // Wraps, so the arrows never dead-end on the first or last photo.
        return (current + delta + images.length) % images.length;
      }),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    // Without this the page scrolls behind the overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (images.length === 0) return null;

  const altFor = (img: CaseStudyGalleryImage, i: number) =>
    img.caption || `${title} — project photo ${i + 1}`;

  const active = openIndex === null ? null : images[openIndex];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {images.map((img, i) => (
          <figure key={i} className="m-0">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View ${altFor(img, i)} full size`}
              className="group relative block w-full h-[220px] sm:h-[240px] rounded-xl overflow-hidden bg-gray-200 cursor-zoom-in p-0 border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <Image
                src={img.url}
                fill
                alt={altFor(img, i)}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized={img.url?.startsWith("http")}
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
            </button>
            {img.caption && (
              <figcaption className="mt-2 text-sm text-gray-500">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {active && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} project gallery`}
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          // Clicking the backdrop closes; clicks on the image itself stop here.
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white/80 text-sm">
            <span>
              {openIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="p-2 -mr-2 text-white/80 hover:text-white bg-transparent border-0 cursor-pointer text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div
            className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-16 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-1 sm:left-4 z-10 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none border-0 cursor-pointer flex items-center justify-center"
              >
                ‹
              </button>
            )}

            <div className="relative w-full h-full">
              <Image
                src={active.url}
                fill
                alt={altFor(active, openIndex)}
                className="object-contain"
                sizes="100vw"
                unoptimized={active.url?.startsWith("http")}
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-1 sm:right-4 z-10 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none border-0 cursor-pointer flex items-center justify-center"
              >
                ›
              </button>
            )}
          </div>

          {active.caption && (
            <p
              className="px-4 sm:px-6 pb-6 text-center text-sm text-white/80 inter-font m-0"
              onClick={(e) => e.stopPropagation()}
            >
              {active.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
