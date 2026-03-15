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
  let categories: Array<{ slug: string; name: string; order?: number }> = [];
  try {
    const res = await fetchCategories();
    categories = res.categories ?? [];
  } catch {
    // leave empty
  }
  const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const firstCategorySlug = sorted.length > 0 ? sorted[0].slug : null;

  return (
    <>
      <ProductHero />
      <AwardsSection />
      {firstCategorySlug ? (
        <AcousticSolutions categorySlug={firstCategorySlug} showMasterCategoryTabs />
      ) : (
        <section className="w-full bg-white px-6 py-16 sm:py-24 text-center">
          <p className="text-gray-500 text-lg">No product categories yet. Check back later.</p>
        </section>
      )}
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
