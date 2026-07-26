"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import TrademarkTitle from "@/components/shared/TrademarkTitle";

export interface RelatedProductItem {
  slug: string;
  title: string;
  description: string;
  image: string;
  showTrademark?: boolean;
}

interface RelatedProductsProps {
  products: RelatedProductItem[];
  categorySlug: string;
}

function visibleCardsForWidth(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export default function RelatedProducts({ products, categorySlug }: RelatedProductsProps) {
  const [index, setIndex] = useState(0);
  const [stride, setStride] = useState(0);
  const [perView, setPerView] = useState(1);
  /** Slide width in px — on small screens matches carousel viewport so cards aren’t a narrow strip with empty space beside them */
  const [cellWidth, setCellWidth] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, products.length - perView);

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
      if (vw >= 1024) cardW = 400;
      else if (vw >= 640) cardW = 360;
      else cardW = Math.max(280, viewport.clientWidth);

      setCellWidth(cardW);
      setStride(cardW + (Number.isFinite(gap) ? gap : 24));
      setPerView(visibleCardsForWidth(vw));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [products.length]);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  useEffect(() => {
    if (maxIndex <= 0) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [maxIndex]);

  const translateX = stride > 0 ? -(index * stride) : 0;

  if (!products.length) return null;

  return (
    <section className="w-full bg-[#faf7f2] px-4 sm:px-10 md:px-[60px] lg:px-[100px] py-[60px] sm:py-[75px] lg:py-[90px]">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-10 lg:flex-row lg:gap-0">
        <div className="max-w-3xl">
          <p className="mb-2 text-[14px] font-bold text-gray-400 worksans-font sm:text-[15px] lg:text-[16px]">
            Relevant Products
          </p>
          <h2 className="mb-4 text-[24px] font-bold leading-snug axiforma sm:text-[28px] lg:text-[34px]">
            We Cut Through Noise to create architects <br />
            that are thoughtful, timeless & impactful.
          </h2>
          <p className="text-[13px] text-gray-600 inter-font font-normal sm:text-[14px]">
            Our inspired solutions have helped shape modern acoustic design. Alluring spaces,
            internationally recognised for their architectural elegance and exceptional sound
            management live here.
          </p>
        </div>

        <Link
          href={`/products/${categorySlug}`}
          className="cursor-pointer rounded-full border border-gray-300 px-5 py-2 text-sm text-black no-underline transition hover:bg-gray-100"
        >
          VIEW ALL PRODUCTS →
        </Link>
      </div>

      {/* Products Slider — cell width = viewport width on mobile so cards fill horizontal space */}
      <div ref={viewportRef} className="relative w-full max-w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max max-w-none gap-6 transition-transform duration-500 ease-out sm:gap-8"
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            willChange: "transform",
          }}
        >
          {products.map((item) => (
            <Link
              key={item.slug}
              href={`/products/${categorySlug}/${item.slug}`}
              title={item.description}
              className="flex h-[440px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white no-underline text-inherit shadow-sm ring-1 ring-black/5 transition hover:ring-black/10"
              style={
                cellWidth != null
                  ? { width: cellWidth, flex: "0 0 auto" }
                  : { width: "min(100%, 320px)", flex: "0 0 auto" }
              }
            >
              {/* Fixed image height — same for every card */}
              <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 360px, 400px"
                  className="object-cover object-center"
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-2 p-5 sm:p-6">
                <h3 className="line-clamp-2 text-[18px] font-bold leading-snug text-neutral-900 manrope sm:text-[22px] lg:text-[24px]">
                  <TrademarkTitle title={item.title} showTrademark={item.showTrademark} />
                </h3>
                <p className="line-clamp-4 text-[13px] leading-relaxed text-gray-600 manrope font-normal sm:line-clamp-5 sm:text-[14px] lg:text-[15px]">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {products.length > perView && (
          <div className="mt-6 flex justify-center gap-8 sm:mt-8">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="cursor-pointer transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous products"
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
              aria-label="Next products"
            >
              <Image src="/assets/home/universalvector.svg" alt="" width={34} height={14} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
