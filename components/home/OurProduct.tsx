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
    <section className="bg-[#F5F5F5] overflow-hidden py-14 sm:py-16 lg:py-[100px]">
      <FadeIn direction="up" duration={0.7} className="mb-10 px-6 sm:px-10 lg:mb-12 lg:px-[200px]">
        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-[16px] worksans-font font-bold">Our Products</p>

            <h2 className="text-[24px] sm:text-[34px] lg:text-[38px] axiforma font-bold leading-tight mb-4">
              We Cut Through Noise to create architects that are thoughtful, timeless &
              Impactful.
            </h2>

            <p className="mb-6 text-sm text-gray-600">
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
