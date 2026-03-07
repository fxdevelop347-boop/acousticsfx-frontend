import type { Metadata } from "next";
import ProductHero from "@/components/products/ProductHero";
import AwardsSection from "@/components/products/AwardsSection";
import AcousticSolutions from "@/components/products/AcousticSolutions";
import CaseStudies from "@/components/products/CaseStudies";
import OurPromise from "@/components/products/OurPromise";
import ApplicationsSection from "@/components/shared/ApplicationsSection";
import TrustedBySection from "@/components/contact/TrustedBySection";
import LatestBlogs from "@/components/home/LatestBlogs";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import { fetchCategories } from "@/lib/products-api";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore our full range of acoustic solutions — wood panels, fabric panels, baffles & clouds, wood wool panels, and more. NRC-certified quality.",
};

export default async function ProductsPage() {
  let firstCategorySlug = "acoustic";
  try {
    const { categories } = await fetchCategories();
    if (categories?.length > 0) {
      const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      firstCategorySlug = sorted[0].slug;
    }
  } catch {
    // keep default
  }

  return (
    <>
      <ProductHero />
      <AwardsSection />
      <AcousticSolutions categorySlug={firstCategorySlug} showMasterCategoryTabs />
      <CaseStudies />
      <OurPromise />
      <ApplicationsSection />
      <TrustedBySection />
      <LatestBlogs />
      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
