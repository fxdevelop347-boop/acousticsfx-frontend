import type { SubProduct as ApiSubProduct } from "./products-api";
import {
  fetchProductBySlug as apiFetchProduct,
  fetchSubProduct as apiFetchSubProduct,
} from "./products-api";

// Re-export extended SubProduct from API for detail pages (gridIntro, specs, gallerySlides)
export type { ApiSubProduct as SubProductDetail };
export type { SubProductGridIntro, SubProductGridImage, SubProductSpec, SubProductGallerySlide } from "./products-api";

// Product and Sub-Product data structure (from API only)
export interface SubProduct {
  slug: string;
  title: string;
  description: string;
  image: string;
}

export interface Product {
  slug: string;
  title: string;
  description: string;
  image: string;
  heroImage?: string;
  subProducts: SubProduct[];
  categorySlug?: string;
  panelsSectionTitle?: string;
  panelsSectionDescription?: string;
  shortDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
}

/** Normalize sub-product slug for URL compatibility (e.g. linerlux → linearlux) */
function normalizeSubProductSlug(slug: string): string {
  return slug === "linerlux" ? "linearlux" : slug;
}

// ---------------------------------------------------------------------------
// API-only helpers: no static fallback. Returns undefined when API fails or has no data.
// ---------------------------------------------------------------------------

export async function fetchMergedProduct(slug: string): Promise<Product | undefined> {
  try {
    const apiProduct = await apiFetchProduct(slug);
    if (!apiProduct) return undefined;
    return {
      slug: apiProduct.slug,
      title: apiProduct.title,
      description: apiProduct.description ?? "",
      image: apiProduct.image ?? "",
      heroImage: apiProduct.heroImage,
      subProducts: apiProduct.subProducts ?? [],
      categorySlug: apiProduct.categorySlug,
      panelsSectionTitle: apiProduct.panelsSectionTitle,
      panelsSectionDescription: apiProduct.panelsSectionDescription,
      shortDescription: apiProduct.shortDescription,
      metaTitle: apiProduct.metaTitle,
      metaDescription: apiProduct.metaDescription,
    };
  } catch {
    return undefined;
  }
}

/** Full sub-product for detail page (includes gridIntro, specs, gallerySlides from API) */
export interface SubProductMerged extends SubProduct {
  gridIntro?: ApiSubProduct["gridIntro"];
  gridImages?: ApiSubProduct["gridImages"];
  specDescription?: string;
  specs?: ApiSubProduct["specs"];
  galleryImages?: ApiSubProduct["galleryImages"];
  profilesSection?: ApiSubProduct["profilesSection"];
  substratesSection?: ApiSubProduct["substratesSection"];
  aboutTabs?: ApiSubProduct["aboutTabs"];
  certifications?: ApiSubProduct["certifications"];
  finishesSection?: ApiSubProduct["finishesSection"];
}

export async function fetchMergedSubProduct(
  productSlug: string,
  subProductSlug: string
): Promise<{ product: Product | undefined; subProduct: SubProductMerged | undefined }> {
  const normalizedSubSlug = normalizeSubProductSlug(subProductSlug);
  try {
    const apiResult = await apiFetchSubProduct(productSlug, normalizedSubSlug);
    const sub: SubProductMerged = {
      slug: apiResult.subProduct.slug,
      title: apiResult.subProduct.title,
      description: apiResult.subProduct.description ?? "",
      image: apiResult.subProduct.image ?? "",
      gridIntro: apiResult.subProduct.gridIntro,
      gridImages: apiResult.subProduct.gridImages,
      specDescription: apiResult.subProduct.specDescription,
      specs: apiResult.subProduct.specs,
      galleryImages: apiResult.subProduct.galleryImages,
      profilesSection: apiResult.subProduct.profilesSection,
      substratesSection: apiResult.subProduct.substratesSection,
      aboutTabs: apiResult.subProduct.aboutTabs,
      certifications: apiResult.subProduct.certifications,
      finishesSection: apiResult.subProduct.finishesSection,
    };
    const product: Product = {
      slug: apiResult.product.slug,
      title: apiResult.product.title,
      description: "",
      image: "",
      subProducts: [],
      categorySlug: apiResult.product.categorySlug,
    };
    return { product, subProduct: sub };
  } catch {
    return { product: undefined, subProduct: undefined };
  }
}
