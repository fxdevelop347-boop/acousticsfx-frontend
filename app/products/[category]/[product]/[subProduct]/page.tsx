import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import Testimonials from "@/components/home/Testimonials";
import AboutProduct from "@/components/products/AboutProduct";
import CertificationsSection from "@/components/products/CertificationsSection";
import FinishesShades from "@/components/products/FinishesShades";
import GallerySection from "@/components/products/GallerySection";
import LinearluxGrid from "@/components/products/LinearluxGrid";
import LinearluxHero from "@/components/products/LinearluxHero";
import ProductSpecification from "@/components/products/ProductSpecification";
import Product3DViewer from "@/components/products/Product3DViewer";
import RelatedProducts from "@/components/products/RelatedProducts";
import SubstratesSection from "@/components/products/SubstratesSection";
import { fetchMergedSubProduct } from "@/lib/products-data";

type Props = {
  params: Promise<{ category: string; product: string; subProduct: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: productSlug, subProduct: subProductSlug } = await params;
  const { product, subProduct } = await fetchMergedSubProduct(
    productSlug,
    subProductSlug
  );
  if (!subProduct) return { title: subProductSlug, description: "" };
  return {
    title: `${subProduct.title} | ${product?.title ?? ""}`.trim(),
    description: subProduct.description?.slice(0, 160) ?? "",
  };
}

export default async function SubProductDetailPage({ params }: Props) {
  const { product: productSlug, subProduct: subProductSlug } = await params;
  const { product, subProduct } = await fetchMergedSubProduct(
    productSlug,
    subProductSlug
  );

  if (!product || !subProduct) notFound();

  return (
    <>
      <LinearluxHero
        productTitle={product.title}
        subProductTitle={subProduct.title}
        description={subProduct.description}
      />
      <LinearluxGrid
        gridIntro={subProduct.gridIntro}
        gridImages={subProduct.gridImages}
      />
      <ProductSpecification
        specDescription={subProduct.specDescription}
        specs={subProduct.specs}
      />
      <GallerySection galleryImages={subProduct.galleryImages} />
      <Product3DViewer profilesSection={subProduct.profilesSection} />
      <SubstratesSection substratesSection={subProduct.substratesSection} />
      <AboutProduct aboutTabs={subProduct.aboutTabs} />
      <CertificationsSection certifications={subProduct.certifications} />
      <FinishesShades finishesSection={subProduct.finishesSection} />
      <Testimonials />
      <RelatedProducts />
      <ConnectWithExperts />
    </>
  );
}
