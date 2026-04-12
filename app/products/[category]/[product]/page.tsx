import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import Testimonials from "@/components/home/Testimonials";
import AboutProduct from "@/components/products/AboutProduct";
import CertificationsSection from "@/components/products/CertificationsSection";
import FinishesShades from "@/components/products/FinishesShades";
import GallerySection from "@/components/products/GallerySection";
import LinearluxHero from "@/components/products/LinearluxHero";
import ProductSpecification from "@/components/products/ProductSpecification";
import Product3DViewer from "@/components/products/Product3DViewer";
import { hasVisualizerTextures } from "@/lib/products-api";
import RelatedProducts from "@/components/products/RelatedProducts";
import SubstratesSection from "@/components/products/SubstratesSection";
import { fetchMergedProduct, fetchRelatedProductsForCategory } from "@/lib/products-data";
import { SITE_URL } from "@/lib/site-url";
import { SEO_KEYWORDS_PRODUCT_DETAIL } from "@/lib/seo-keywords";

type Props = { params: Promise<{ category: string; product: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: productSlug, category } = await params;
  const product = await fetchMergedProduct(productSlug);
  if (!product) return { title: productSlug, description: "" };
  const canonicalCategory = product.categorySlug ?? category;
  const canonical = `${SITE_URL}/products/${canonicalCategory}/${product.slug}`;
  return {
    title: product.metaTitle || product.title,
    description:
      (product.metaDescription || product.description)?.slice(0, 160) ?? "",
    keywords: [
      product.title,
      `${product.title} India`,
      ...(product.categorySlug
        ? [`${product.categorySlug} acoustic India`, "FX Acoustics"]
        : ["FX Acoustics"]),
      ...SEO_KEYWORDS_PRODUCT_DETAIL,
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title: product.metaTitle || product.title,
      description:
        (product.metaDescription || product.description)?.slice(0, 160) ?? "",
      url: canonical,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, product: productSlug } = await params;
  const product = await fetchMergedProduct(productSlug);

  if (!product) notFound();

  const canonicalCategory = product.categorySlug;
  if (canonicalCategory && canonicalCategory !== category) {
    permanentRedirect(`/products/${canonicalCategory}/${product.slug}`);
  }

  const relatedProducts = await fetchRelatedProductsForCategory(
    canonicalCategory ?? category,
    product.slug
  );

  return (
    <>
      <LinearluxHero
        title={product.title}
        showTrademark={product.showTrademark === true}
        description={product.description}
      />
      <ProductSpecification
        sectionTitle={product.specSectionTitle}
        specDescription={product.specDescription}
        specs={product.specs}
      />
      <GallerySection galleryImages={product.galleryImages} />
      {hasVisualizerTextures(product.visualizerTextures) ? (
        <Product3DViewer
          visualizerTextures={product.visualizerTextures}
          visualizerDimensions={product.visualizerDimensions}
        />
      ) : null}
      <SubstratesSection substratesSection={product.substratesSection} />
      <AboutProduct aboutTabs={product.aboutTabs} />
      <CertificationsSection
        certifications={product.certifications}
        sectionTitle={product.certificationsSectionTitle}
        sectionDescription={product.certificationsSectionDescription}
      />
      <FinishesShades finishesSection={product.finishesSection} />
      <Testimonials />
      <RelatedProducts products={relatedProducts} categorySlug={canonicalCategory ?? category} />
      <ConnectWithExperts />
    </>
  );
}
