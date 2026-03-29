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
    <section className="py-[80px] lg:py-[100px] bg-[#F5F5F5] overflow-hidden">
      <FadeIn direction="up" duration={0.7} className="px-6 sm:px-10 lg:px-[200px] mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="max-w-3xl">
            <p className="text-[16px] mb-3 worksans-font font=[700]">Our Products</p>

            <h2 className="text-[24px] sm:text-[34px] lg:text-[38px] axiforma font-bold leading-tight mb-4">
              We Cut Through Noise to create architects that are thoughtful, timeless &
              Impactful.
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Our inspired solutions have helped shape modern acoustic design. Alluring
              spaces, internationally recognised for their architectural elegance and
              exceptional sound management live here.
            </p>

            <CategoryTabs variant="left" />
          </div>

          <Link
            href="/products"
            className="border px-5 py-2 text-xs h-fit cursor-pointer no-underline text-black hover:bg-gray-100 transition"
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
