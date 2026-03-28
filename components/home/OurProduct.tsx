"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "@/components/animations";

const CONTENT_KEYS = [
  "home.ourProduct.product1Image",
  "home.ourProduct.product1Title",
  "home.ourProduct.product2Image",
  "home.ourProduct.product2Title",
  "home.ourProduct.product3Image",
  "home.ourProduct.product3Title",
];

const DEFAULT_PRODUCTS = [
  { id: 1, title: "Slat", image: "/assets/home/homeone.png" },
  { id: 2, title: "Wave Panel", image: "/assets/home/hometwo.png" },
  { id: 3, title: "Groove Panel", image: "/assets/home/homethree.png" },
];

export default function ProductsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<ContentMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current) return;
  
      const container = sliderRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
  
      if (container.scrollLeft >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 600, behavior: "smooth" });
      }
    }, 2000);
  
    return () => clearInterval(interval);
  }, []);

  const products = DEFAULT_PRODUCTS.map((p, i) => ({
    ...p,
    image: content[`home.ourProduct.product${i + 1}Image`]?.value ?? p.image,
    title: content[`home.ourProduct.product${i + 1}Title`]?.value ?? p.title,
  }));

  // Desktop: free scroll
  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -600, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 600, behavior: "smooth" });
  };

  // Mobile: snap to index
  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, products.length - 1));
    setCurrentIndex(clamped);
    const container = sliderRef.current;
    if (!container) return;
    const child = container.children[clamped] as HTMLElement;
    if (child) {
      container.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    // On mobile use snap, on desktop use free scroll
    if (window.innerWidth < 1024) {
      scrollToIndex(currentIndex - 1);
    } else {
      scrollLeft();
    }
  };

  const handleScrollRight = () => {
    if (window.innerWidth < 1024) {
      scrollToIndex(currentIndex + 1);
    } else {
      scrollRight();
    }
  };

  // Update currentIndex on scroll (mobile)
  const handleScroll = () => {
    const container = sliderRef.current;
    if (!container || window.innerWidth >= 1024) return;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const index = Math.round(scrollLeft / containerWidth);
    setCurrentIndex(index);
  };

  return (
    <section className="py-[80px] lg:py-[100px] bg-[#F5F5F5] overflow-hidden">
      {/* TOP CONTENT */}
      <FadeIn direction="up" duration={0.7} className="px-6 sm:px-10 lg:px-[200px] mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="max-w-3xl">
            <p className="text-[16px] mb-3 worksans-font font=[700]">
              Our Products
            </p>

            <h2 className="text-[24px] sm:text-[34px] lg:text-[38px] axiforma font-bold leading-tight mb-4">
              We Cut Through Noise to create architects
        
              that are thoughtful, timeless & Impactful.
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Our inspired solutions have helped shape modern acoustic design.
              Alluring spaces, internationally recognised for their architectural
              elegance and exceptional sound management live here.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products/acoustic"
                className="bg-[#1F6775] axiforma font-bold text-white px-4 py-2 text-[10px] cursor-pointer no-underline"
              >
                ACOUSTIC SOLUTION
              </Link>
              <Link
                href="/products"
                className="bg-[#fff] px-4 py-2 text-[10px] axiforma font-bold cursor-pointer no-underline text-black"
              >
                FLOORING SOLUTION
              </Link>
              <Link
                href="/products"
                className="bg-[#fff] px-4 py-2 text-[10px] axiforma font-bold cursor-pointer no-underline text-black"
              >
                SOUND PROOFING SOLUTION
              </Link>
            </div>
          </div>

          <Link
            href="/products"
            className="border px-5 py-2 text-xs h-fit cursor-pointer no-underline text-black hover:bg-gray-100 transition"
          >
            VIEW ALL PRODUCTS →
          </Link>
        </div>
      </FadeIn>

      {/* SLIDER */}
      <div className="relative pl-6 sm:pl-10 lg:pl-[200px]">
        {/* TRACK */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto scroll-smooth no-scrollbar
            lg:snap-none
            snap-x snap-mandatory"
        >
          {products.map((product) => (
            <StaggerItem
              key={product.id}
              direction="up"
              className="
                snap-start
                min-w-[calc(100vw-48px)] sm:min-w-[calc(100vw-80px)]
                lg:min-w-[575px]
                bg-white
              "
            >
              <HoverScale className="h-full">
                {/* IMAGE */}
                <div className="relative w-full h-[220px] sm:h-[300px] lg:w-[575px] lg:h-[392px]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="pt-6 text-center px-6">
                  <h3 className="text-[20px] lg:text-[24px] axiforma font-bold mb-3 text-left">
                    {product.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-6 max-w-[520px] text-left">
                    Acoustic wall panels made of wood stops reverberation and
                    spreading sound waves better than panels made of steel and
                    glass or concrete.
                  </p>

                  <div className="flex justify-center gap-6 sm:gap-10 mb-6 text-xs text-gray-600">
                    <div>
                      <p className="uppercase text-[10px] mb-1">Category</p>
                      <p className="font-medium">Slats</p>
                    </div>

                    <div>
                      <p className="uppercase text-[10px] mb-1">Fire Rating</p>
                      <p className="font-medium">Group 1, 2 or 3</p>
                    </div>

                    <div>
                      <p className="uppercase text-[10px] mb-1">Sound Profile</p>
                      <p className="font-medium">NRC – 0.75</p>
                    </div>
                  </div>

                  <Link
                    href="/products/acoustic"
                    className="inline-block border border-orange-500 text-orange-500 px-6 py-2 text-sm mb-4 cursor-pointer hover:bg-orange-50 transition no-underline"
                  >
                    View Details
                  </Link>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </div>

{/* ARROWS */}
<div className="hidden lg:flex justify-center gap-8 mt-10">
  <button onClick={handleScrollLeft} className="cursor-pointer">
    <Image
      src="/assets/home/Vector.svg"
      alt="Previous"
      width={10}
      height={10}
      className="rotate-180"
    />
  </button>

  <button onClick={handleScrollRight} className="cursor-pointer">
    <Image
      src="/assets/home/Vector.svg"
      alt="Next"
      width={10}
      height={10}
    />
  </button>
</div>

        {/* MOBILE DOT INDICATORS */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-[#1F6775] w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}