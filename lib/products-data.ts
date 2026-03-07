import type { SubProduct as ApiSubProduct } from "./products-api";
import {
  fetchProductBySlug as apiFetchProduct,
  fetchSubProduct as apiFetchSubProduct,
} from "./products-api";

// Re-export extended SubProduct from API for detail pages (gridIntro, specs, gallerySlides)
export type { ApiSubProduct as SubProductDetail };
export type { SubProductGridIntro, SubProductGridImage, SubProductSpec, SubProductGallerySlide } from "./products-api";

// Product and Sub-Product Data Structure (basic for lists; detail from API)
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

// Main Products Data
export const products: Product[] = [
  {
    slug: "wood-acoustic-panel",
    title: "Wood Acoustic Panel",
    description: "Acoustic wall panels made of wood stops reverberation and spreading sound waves better than panels made of steel and glass or concrete. The acoustic wood panel is used for sound insulation and acoustic arrangements. Acoustic wood panels eliminate echo problems. In order to maximize sound quality, the panel provides a premium acoustic arrangement.",
    image: "/assets/product/product-card-1.png",
    heroImage: "/assets/product/product-hero.png",
    subProducts: [
      {
        slug: "linearlux",
        title: "Linerlux",
        description: "Linearlux panels transform sound into an experience. With precision grooves and natural textures, they bring warmth and clarity to auditoriums, lecture halls, and public spaces—balancing technical performance with architectural elegance.",
        image: "/assets/panels/linerlux.png",
      },
      {
        slug: "acoperf",
        title: "Acoperf",
        description: "Acoperf panels feature precision perforations that enhance acoustic performance while maintaining elegant aesthetics. Perfect for modern spaces requiring both sound control and visual appeal.",
        image: "/assets/panels/acoperf.png",
      },
      {
        slug: "microatlas",
        title: "Microatlas",
        description: "Microatlas panels utilize micro-perforation technology for superior sound absorption. These advanced panels deliver exceptional acoustic performance with minimal visual impact, ideal for sophisticated architectural environments.",
        image: "/assets/panels/microatlas.png",
      },
      {
        slug: "acoslots",
        title: "Acoslots",
        description: "Acoslots panels feature strategic slot patterns that create distinctive visual textures while optimizing acoustic performance. These panels combine form and function for contemporary architectural applications.",
        image: "/assets/panels/acoslots.png",
      },
      {
        slug: "perfomax",
        title: "Perfomax",
        description: "Perfomax panels maximize acoustic performance through advanced perforation patterns. These high-performance panels deliver exceptional sound absorption while maintaining elegant design aesthetics for premium architectural projects.",
        image: "/assets/panels/perfomax.png",
      },
    ],
  },
  {
    slug: "fabric-acoustic-panel",
    title: "Fabric Acoustic Panel",
    description: "Fabric acoustic panels provide excellent sound absorption and aesthetic appeal. These versatile panels offer superior acoustic performance with customizable design options, making them ideal for modern spaces requiring both sound control and visual elegance.",
    image: "/assets/product/product-card-2.png",
    heroImage: "/assets/product/product-hero.png",
    subProducts: [],
  },
  {
    slug: "baffle-clouds",
    title: "Baffle & Clouds",
    description: "Baffle and cloud acoustic solutions provide effective sound absorption for large spaces. These suspended panels create stunning visual impact while delivering superior acoustic performance in auditoriums, offices, and commercial environments.",
    image: "/assets/product/product-card-3.png",
    heroImage: "/assets/product/product-hero.png",
    subProducts: [],
  },
  {
    slug: "wood-wool-acoustic-panel",
    title: "Wood Wool Acoustic Panel",
    description: "Wood wool acoustic panels combine natural wood fibers with excellent sound absorption properties. These eco-friendly panels provide sustainable acoustic solutions with natural aesthetics for modern architectural spaces.",
    image: "/assets/product/product-card-7.png",
    heroImage: "/assets/product/product-hero.png",
    subProducts: [],
  },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Normalize sub-product slug (e.g. linerlux → linearlux) */
function normalizeSubProductSlug(slug: string): string {
  return slug === "linerlux" ? "linearlux" : slug;
}

export function getSubProductBySlug(
  productSlug: string,
  subProductSlug: string
): SubProduct | undefined {
  const normalized = normalizeSubProductSlug(subProductSlug);
  const product = getProductBySlug(productSlug);
  if (!product) return undefined;
  return product.subProducts.find((sub) => sub.slug === normalized);
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

export function getAllSubProductSlugs(productSlug: string): { productId: string; insideProduct: string }[] {
  const product = getProductBySlug(productSlug);
  if (!product) return [];
  return product.subProducts.map((sub) => ({
    productId: productSlug,
    insideProduct: sub.slug,
  }));
}

// Default sub-products shown in UI for all products
const defaultSubProducts: SubProduct[] = [
  {
    slug: "linearlux",
    title: "Linerlux",
    description: "Linearlux panels transform sound into an experience. With precision grooves and natural textures, they bring warmth and clarity to auditoriums, lecture halls, and public spaces—balancing technical performance with architectural elegance.",
    image: "/assets/panels/linerlux.png",
  },
  {
    slug: "acoperf",
    title: "Acoperf",
    description: "Acoperf panels feature precision perforations that enhance acoustic performance while maintaining elegant aesthetics. Perfect for modern spaces requiring both sound control and visual appeal.",
    image: "/assets/panels/acoperf.png",
  },
  {
    slug: "microatlas",
    title: "Microatlas",
    description: "Microatlas panels utilize micro-perforation technology for superior sound absorption. These advanced panels deliver exceptional acoustic performance with minimal visual impact, ideal for sophisticated architectural environments.",
    image: "/assets/panels/microatlas.png",
  },
  {
    slug: "acoslots",
    title: "Acoslots",
    description: "Acoslots panels feature strategic slot patterns that create distinctive visual textures while optimizing acoustic performance. These panels combine form and function for contemporary architectural applications.",
    image: "/assets/panels/acoslots.png",
  },
  {
    slug: "perfomax",
    title: "Perfomax",
    description: "Perfomax panels maximize acoustic performance through advanced perforation patterns. These high-performance panels deliver exceptional sound absorption while maintaining elegant design aesthetics for premium architectural projects.",
    image: "/assets/panels/perfomax.png",
  },
];

// Get sub-product data - first from product's subProducts, then from defaults
export function getSubProductData(
  productSlug: string,
  subProductSlug: string
): SubProduct | undefined {
  const normalized = normalizeSubProductSlug(subProductSlug);
  const product = getProductBySlug(productSlug);
  if (!product) return undefined;

  const subProduct = product.subProducts.find((sub) => sub.slug === normalized);
  if (subProduct) return subProduct;
  return defaultSubProducts.find((sub) => sub.slug === normalized);
}

// ---------------------------------------------------------------------------
// Async API-aware helpers: fetch from backend, merge with static data.
// Admin-uploaded images (ImageKit URLs) override the static defaults.
// ---------------------------------------------------------------------------

export async function fetchMergedProduct(
  slug: string
): Promise<Product | undefined> {
  const staticProduct = getProductBySlug(slug);
  try {
    const apiProduct = await apiFetchProduct(slug);
    if (!apiProduct) return staticProduct;
    return {
      slug: apiProduct.slug,
      title: apiProduct.title || staticProduct?.title || "",
      description: apiProduct.description || staticProduct?.description || "",
      image: apiProduct.image || staticProduct?.image || "",
      heroImage: apiProduct.heroImage || staticProduct?.heroImage,
      subProducts:
        apiProduct.subProducts?.length > 0
          ? apiProduct.subProducts
          : staticProduct?.subProducts ?? [],
      categorySlug: apiProduct.categorySlug ?? staticProduct?.categorySlug,
      panelsSectionTitle: apiProduct.panelsSectionTitle ?? staticProduct?.panelsSectionTitle,
      panelsSectionDescription: apiProduct.panelsSectionDescription ?? staticProduct?.panelsSectionDescription,
      shortDescription: apiProduct.shortDescription ?? staticProduct?.shortDescription,
      metaTitle: apiProduct.metaTitle ?? staticProduct?.metaTitle,
      metaDescription: apiProduct.metaDescription ?? staticProduct?.metaDescription,
    };
  } catch {
    return staticProduct;
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
  const staticProduct = getProductBySlug(productSlug);
  const staticSub = getSubProductData(productSlug, subProductSlug);
  try {
    const apiResult = await apiFetchSubProduct(productSlug, normalizedSubSlug);
    const mergedSub: SubProductMerged = {
      slug: apiResult.subProduct.slug,
      title: apiResult.subProduct.title || staticSub?.title || "",
      description: apiResult.subProduct.description || staticSub?.description || "",
      image: apiResult.subProduct.image || staticSub?.image || "",
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
    const product = staticProduct
      ? { ...staticProduct, categorySlug: apiResult.product?.categorySlug ?? staticProduct.categorySlug }
      : {
          slug: apiResult.product.slug,
          title: apiResult.product.title,
          description: "",
          image: "",
          subProducts: [],
          categorySlug: apiResult.product.categorySlug,
        };
    return { product, subProduct: mergedSub };
  } catch {
    const sub = staticSub
      ? ({ ...staticSub } as SubProductMerged)
      : undefined;
    return { product: staticProduct, subProduct: sub };
  }
}
