"use client";

import { useState } from "react";
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
}

export default function GallerySection({ galleryImages }: GallerySectionProps = {}) {
  const images = (galleryImages && galleryImages.length > 0) ? galleryImages : DEFAULT_GALLERY;
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const large = images[currentIndex];
  const small = images[(currentIndex + 1) % total] ?? large;

  return (
    <section className="w-full bg-white px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-[28px] sm:text-[32px] lg:text-[35px] manrope font-bold">
          Gallery
        </h2>

        <Link href="/contactus" className="flex items-center gap-2 border border-gray-300 px-5 py-2 rounded-full text-sm hover:bg-gray-100 transition cursor-pointer">
          Get Quote
          <Image
            src="/assets/home/universalvector.svg"
            alt="Arrow"
            width={34}
            height={14}
          />
        </Link>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Big Image (Left) */}
        <div className="col-span-1 sm:col-span-2 h-[280px] sm:h-[380px] lg:h-[480px] rounded-2xl overflow-hidden relative">
          <Image
            src={large?.url ?? ""}
            alt={large?.alt ?? "Gallery"}
            fill
            className="object-cover"
          />
        </div>

        {/* Right Tall Image */}
        <div className="h-[280px] sm:h-[380px] lg:h-[480px] rounded-2xl overflow-hidden relative">
          <Image
            src={small?.url ?? ""}
            alt={small?.alt ?? "Gallery"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-6 mt-6 sm:mt-8 text-sm text-gray-500">
        <button
          onClick={prev}
          className="hover:opacity-70 transition cursor-pointer"
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="Previous"
            width={34}
            height={14}
            className="rotate-180"
          />
        </button>
        <span>{currentIndex + 1} / {total}</span>
        <button
          onClick={next}
          className="hover:opacity-70 transition cursor-pointer"
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="Next"
            width={34}
            height={14}
          />
        </button>
      </div>

    </section>
  );
}
