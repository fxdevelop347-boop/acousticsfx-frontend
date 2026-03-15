"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface RelatedProductItem {
  slug: string;
  title: string;
  description: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProductItem[];
  categorySlug: string;
}

export default function RelatedProducts({ products, categorySlug }: RelatedProductsProps) {
  const [index, setIndex] = useState(0);

  if (!products.length) return null;

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, products.length - 3));
  };

  return (
    <section className="w-full bg-[#faf7f2] pl-[24px] sm:pl-[40px] md:pl-[60px] lg:pl-[100px] pr-0 py-[60px] sm:py-[75px] lg:py-[90px]">

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-0 mb-8 sm:mb-10">
        <div className="max-w-3xl">
          <p className="text-[14px] sm:text-[15px] lg:text-[16px] font-bold worksans-font text-gray-400 mb-2">
            Relevant Products
          </p>
          <h2 className="text-[24px] sm:text-[28px] lg:text-[34px] font-bold axiforma leading-snug mb-4">
            We Cut Through Noise to create architects <br />
            that are thoughtful, timeless & impactful.
          </h2>
          <p className="text-[13px] sm:text-[14px] inter-font font-[400] text-gray-600">
            Our inspired solutions have helped shape modern acoustic design.
            Alluring spaces, internationally recognised for their architectural
            elegance and exceptional sound management live here.
          </p>
        </div>

        <Link href={`/products/${categorySlug}`} className="border border-gray-300 px-5 py-2 rounded-full text-sm hover:bg-gray-100 transition cursor-pointer no-underline text-black">
          VIEW ALL PRODUCTS →
        </Link>
      </div>

      {/* Products Slider */}
      <div className="relative overflow-hidden">
        <div
          className="flex gap-6 sm:gap-8 transition-transform duration-500"
          style={{
            transform: `translateX(-${index * 416}px)`,
          }}
        >
          {products.map((item) => (
            <Link
              key={item.slug}
              href={`/products/${categorySlug}/${item.slug}`}
              className="min-w-[320px] sm:min-w-[360px] lg:min-w-[400px] h-[480px] sm:h-[520px] lg:h-[550px] bg-white rounded-2xl overflow-hidden flex flex-col no-underline text-inherit"
            >
              {/* Image */}
              <div className="h-[240px] sm:h-[280px] lg:h-[320px] relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col">
                <h3 className="text-[22px] sm:text-[26px] lg:text-[30px] manrope font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] manrope font-[400] text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        {products.length > 3 && (
          <div className="flex justify-center gap-8 mt-6 sm:mt-8">
            <button
              onClick={prev}
              disabled={index === 0}
              className="hover:opacity-70 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Image
                src="/assets/home/universalvector.svg"
                alt="Previous"
                width={34}
                height={14}
                className="rotate-180"
              />
            </button>
            <button
              onClick={next}
              disabled={index >= products.length - 3}
              className="hover:opacity-70 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Image
                src="/assets/home/universalvector.svg"
                alt="Next"
                width={34}
                height={14}
              />
            </button>
          </div>
        )}
      </div>

    </section>
  );
}
