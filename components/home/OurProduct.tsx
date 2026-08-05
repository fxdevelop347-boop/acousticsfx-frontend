"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations";
import {
  CategoryProductsProvider,
  CategoryTabs,
  CategoryProductCarousel,
  useCategoryProductsExplorer,
} from "@/components/products/category-products-explorer";

function OurProductContent() {
  const { categories, categoriesLoading } = useCategoryProductsExplorer();
  if (categoriesLoading || categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F5F5F5] overflow-hidden py-6 sm:py-8 lg:py-10">
      <FadeIn direction="up" duration={0.7} className="mb-4 sm:mb-6 px-4 sm:px-10 lg:mb-8 lg:px-[100px]">
        <div className="flex flex-col gap-3 sm:gap-5 md:gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-1.5 sm:mb-2 text-xs sm:text-[14px] worksans-font font-bold uppercase tracking-wider">Our Products</p>

            <h2 className="text-base sm:text-2xl lg:text-[26px] axiforma font-bold leading-snug sm:leading-tight mb-2 sm:mb-3">
              We Cut Through Noise to create architects that are thoughtful, timeless &
              Impactful.
            </h2>

            <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our inspired solutions have helped shape modern acoustic design. Alluring
              spaces, internationally recognised for their architectural elegance and
              exceptional sound management live here.
            </p>

            <CategoryTabs variant="left" />
          </div>

          <Link
            href="/products"
            className="h-fit w-full border px-5 py-2 text-center text-xs text-black no-underline transition hover:bg-gray-100 sm:w-auto"
          >
            VIEW ALL PRODUCTS →
          </Link>
        </div>
      </FadeIn>

      <CategoryProductCarousel layout="home" />
    </section>
  );
}

export default function ProductsSection() {
  return (
    <CategoryProductsProvider initialCategorySlug="">
      <OurProductContent />
    </CategoryProductsProvider>
  );
}
