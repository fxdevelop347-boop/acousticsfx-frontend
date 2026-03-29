import type { Product as ApiProduct } from "./products-api";
import {
  fetchProductBySlug as apiFetchProduct,
  fetchProducts as apiFetchProducts,
} from "./products-api";

export type { SubProductSpec, SubProductGallerySlide } from "./products-api";

/** Public product model (flat); matches API. */
export type Product = ApiProduct;

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
    return [];
  }
}

/** Full product for detail page — API only. */
export async function fetchMergedProduct(slug: string): Promise<Product | undefined> {
  const normalized = slug === "linerlux" ? "linearlux" : slug;
  try {
    return await apiFetchProduct(normalized);
  } catch {
    return undefined;
  }
}
