import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductHero from "@/components/products/ProductHero";
import AwardsSection from "@/components/products/AwardsSection";
import AcousticSolutions from "@/components/products/AcousticSolutions";
import AcousticWhyChooseUs from "@/components/products/AcousticWhyChooseUs";
import StoryInnovation from "@/components/about/StoryInnovation";
import TrustedBySection from "@/components/contact/TrustedBySection";
import LatestBlogs from "@/components/home/LatestBlogs";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import { fetchCategoryBySlug } from "@/lib/products-api";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  try {
    const { category: cat } = await fetchCategoryBySlug(category);
    return {
      title: cat.metaTitle || cat.name,
      description:
        cat.metaDescription ??
        cat.description ??
        `Browse our complete range of ${cat.name.toLowerCase()} — products for every space.`,
    };
  } catch {
    return { title: category, description: "" };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  let exists = false;
  try {
    await fetchCategoryBySlug(category);
    exists = true;
  } catch {
    exists = false;
  }
  if (!exists) notFound();

  return (
    <>
      <ProductHero />
      <AwardsSection />
      <AcousticSolutions categorySlug={category} showMasterCategoryTabs={false} />
      <StoryInnovation />
      <AcousticWhyChooseUs />
      <TrustedBySection />
      <LatestBlogs />
      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
