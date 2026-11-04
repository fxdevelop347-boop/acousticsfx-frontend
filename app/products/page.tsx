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
import { SITE_URL } from "@/lib/site-url";
import { SEO_KEYWORDS_PRODUCTS } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title:
    "Acoustic Panels, Soundproofing & Flooring Products",
  description:
    "Browse FX Acoustics products—wood and fabric acoustic panels, baffles, clouds, soundproofing systems, and hardwood flooring—with NRC-rated performance for Indian commercial and residential spaces.",
  keywords: SEO_KEYWORDS_PRODUCTS,
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
};

export default async function ProductsPage() {
  let firstCategorySlug = "";
  try {
    const { categories } = await fetchCategories();
    if (categories?.length) {
      const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      firstCategorySlug = sorted[0].slug;
    }
  } catch {
    firstCategorySlug = "";
  }

  return (
    <>
      <ProductHero
        breadcrumbItems={[
          { name: "Home", href: "/" },
          { name: "Our Products", href: "/products" },
        ]}
      />
      <AwardsSection />
      {firstCategorySlug ? (
        <AcousticSolutions categorySlug={firstCategorySlug} showMasterCategoryTabs />
      ) : null}
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
