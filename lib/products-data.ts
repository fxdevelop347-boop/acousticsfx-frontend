import type { Product as ApiProduct } from "./products-api";
import {
  fetchProductBySlug as apiFetchProduct,
  fetchProducts as apiFetchProducts,
} from "./products-api";

export type { SubProductSpec, SubProductGallerySlide } from "./products-api";

/** Public product model (flat); matches API + static fallback. */
export type Product = ApiProduct;

// Static fallback when API is unavailable (minimal listing + one rich demo).
export const products: Product[] = [
  {
    slug: "linearlux",
    title: "Linearlux",
    description:
      "Linearlux panels transform sound into an experience. With precision grooves and natural textures, they bring warmth and clarity to auditoriums, lecture halls, and public spaces—balancing technical performance with architectural elegance.",
    shortDescription:
      "Linear grooved wood acoustic panels with multiple profile options and premium finishes.",
    image: "/assets/panels/linerlux.png",
    heroImage: "/assets/product/product-hero.png",
    categorySlug: "acoustic",
    specDescription:
      "High-end, high-efficiency acoustic lining system with a range of design and performance options.",
    galleryImages: [
      { url: "/assets/product/gallery-image-1.jpg" },
      { url: "/assets/product/linearlux-grid-1.jpg" },
    ],
  },
  {
    slug: "acoperf",
    title: "Acoperf",
    description:
      "Acoperf panels feature precision perforations that enhance acoustic performance while maintaining elegant aesthetics.",
    image: "/assets/panels/acoperf.png",
    categorySlug: "acoustic",
  },
  {
    slug: "microatlas",
    title: "Microatlas",
    description:
      "Microatlas panels utilize micro-perforation technology for superior sound absorption.",
    image: "/assets/panels/microatlas.png",
    categorySlug: "acoustic",
  },
  {
    slug: "acoslots",
    title: "Acoslots",
    description:
      "Acoslots panels feature strategic slot patterns that create distinctive visual textures while optimizing acoustic performance.",
    image: "/assets/panels/acoslots.png",
    categorySlug: "acoustic",
  },
  {
    slug: "perfomax",
    title: "Perfomax",
    description:
      "Perfomax panels maximize acoustic performance through advanced perforation patterns.",
    image: "/assets/panels/perfomax.png",
    categorySlug: "acoustic",
  },
  {
    slug: "fabric-acoustic-panel",
    title: "Fabric Acoustic Panel",
    description:
      "Fabric acoustic panels provide excellent sound absorption and aesthetic appeal.",
    image: "/assets/product/product-card-2.png",
    categorySlug: "acoustic",
  },
  {
    slug: "baffle-clouds",
    title: "Baffle & Clouds",
    description:
      "Baffle and cloud acoustic solutions provide effective sound absorption for large spaces.",
    image: "/assets/product/product-card-3.png",
    categorySlug: "acoustic",
  },
  {
    slug: "wood-wool-acoustic-panel",
    title: "Wood Wool Acoustic Panel",
    description:
      "Wood wool acoustic panels combine natural wood fibers with excellent sound absorption properties.",
    image: "/assets/product/product-card-7.png",
    categorySlug: "acoustic",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  const normalized = slug === "linerlux" ? "linearlux" : slug;
  return products.find((product) => product.slug === normalized);
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

/** Same shape as `RelatedProductItem` in components/products/RelatedProducts.tsx */
export interface RelatedProductListItem {
  slug: string;
  title: string;
  description: string;
  image: string;
  showTrademark?: boolean;
}

/** Other products in the category for the “Related products” strip (excludes current slug). */
export async function fetchRelatedProductsForCategory(
  categorySlug: string,
  excludeProductSlug: string
): Promise<RelatedProductListItem[]> {
  const toItem = (p: ApiProduct): RelatedProductListItem => ({
    slug: p.slug,
    title: p.title,
    description: p.shortDescription || p.description,
    image: p.image,
    showTrademark: p.showTrademark === true,
  });
  try {
    const { products: apiProducts } = await apiFetchProducts(categorySlug);
    return apiProducts.filter((p) => p.slug !== excludeProductSlug).map(toItem);
  } catch {
    return products
      .filter((p) => p.slug !== excludeProductSlug)
      .map(toItem);
  }
}

export async function fetchMergedProduct(slug: string): Promise<Product | undefined> {
  const normalized = slug === "linerlux" ? "linearlux" : slug;
  const staticProduct = getProductBySlug(normalized);
  try {
    const apiProduct = await apiFetchProduct(normalized);
    if (!apiProduct) return staticProduct;
    return {
      ...(staticProduct ?? {}),
      ...apiProduct,
    } as Product;
  } catch {
    return staticProduct;
  }
}
