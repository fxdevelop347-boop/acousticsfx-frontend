import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoryInnovation from "@/components/about/StoryInnovation";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import LatestBlogs from "@/components/home/LatestBlogs";
import Testimonials from "@/components/home/Testimonials";
import OurAcousticPanels from "@/components/products/OurAcousticPanels";
import ProductContentSection from "@/components/products/ProductContentSection";
import ProductHeroSection from "@/components/products/ProductHeroSection";
import WhyChooseSection from "@/components/products/WhyChooseSection";
import { fetchMergedProduct } from "@/lib/products-data";

type Props = { params: Promise<{ category: string; product: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: productSlug } = await params;
  const product = await fetchMergedProduct(productSlug);
  if (!product) return { title: productSlug, description: "" };
  return {
    title: product.metaTitle || product.title,
    description: (product.metaDescription || product.description)?.slice(0, 160) ?? "",
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, product: productSlug } = await params;
  const product = await fetchMergedProduct(productSlug);

  if (!product) notFound();

  return (
    <>
      <ProductHeroSection
        title={product.title}
        description={product.description}
        heroImage={product.heroImage}
        breadcrumbText={product.title}
      />
      <ProductContentSection
        title={product.title}
        description={product.description}
      />
      <OurAcousticPanels
        productSlug={product.slug}
        categorySlug={category}
      />
      <WhyChooseSection
        title={product.title}
        description={product.description}
      />
      <StoryInnovation />
      <LatestBlogs />
      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
