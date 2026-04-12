/**
 * Products API client – fetches categories and products from the backend.
 * Base URL: {@link getPublicApiBaseUrl}
 */

import { getPublicApiBaseUrl } from "@/lib/public-api-base";

export interface SubProductSpec {
  label: string;
  value: string;
}

export interface VisualizerTexture {
  name: string;
  image: string;
}

export interface VisualizerDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface SubProductGallerySlide {
  large: string;
  small: string;
}

export interface SubProductGalleryImage {
  url: string;
  alt?: string;
}

export interface SubProductProfile {
  id?: string;
  name: string;
  size?: string;
  description?: string;
  image?: string;
}

export interface SubProductProfilesSection {
  title?: string;
  description?: string;
  profiles?: SubProductProfile[];
}

export interface SubProductSubstrateItem {
  name: string;
  thickness?: string;
  description?: string;
  image?: string;
}

export interface SubProductSubstratesSection {
  title?: string;
  description?: string;
  items?: SubProductSubstrateItem[];
}

export interface SubProductAboutTab {
  key: string;
  title: string;
  rows: string[];
}

export interface SubProductCertification {
  name: string;
  image: string;
  description?: string;
}

export interface SubProductFinishShade {
  name: string;
  description?: string;
  image: string;
}

export interface SubProductFinishesSection {
  title?: string;
  description?: string;
  items?: SubProductFinishShade[];
}

/** Flat product: listing + full detail page (no nested sub-products). */
export interface Product {
  slug: string;
  title: string;
  description: string;
  image: string;
  heroImage?: string;
  categorySlug?: string;
  showTrademark?: boolean;
  shortDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  specSectionTitle?: string;
  specDescription?: string;
  specs?: SubProductSpec[];
  gallerySlides?: SubProductGallerySlide[];
  galleryImages?: SubProductGalleryImage[];
  profilesSection?: SubProductProfilesSection;
  substratesSection?: SubProductSubstratesSection;
  aboutTabs?: SubProductAboutTab[];
  certificationsSectionTitle?: string;
  certificationsSectionDescription?: string;
  certifications?: SubProductCertification[];
  finishesSection?: SubProductFinishesSection;
  visualizerTextures?: VisualizerTexture[];
  visualizerDimensions?: VisualizerDimensions;
}

export interface ProductCategory {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  order?: number;
  tagline?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const getBaseUrl = (): string => getPublicApiBaseUrl();

async function request<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...(typeof window === 'undefined'
      ? { next: { revalidate: 120 } }
      : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

/** GET /api/products/categories */
export function fetchCategories(): Promise<{ categories: ProductCategory[] }> {
  return request<{ categories: ProductCategory[] }>('/api/products/categories');
}

/** GET /api/products/categories/:categorySlug */
export function fetchCategoryBySlug(categorySlug: string): Promise<{
  category: ProductCategory;
  products: Product[];
}> {
  return request(`/api/products/categories/${encodeURIComponent(categorySlug)}`);
}

/** GET /api/products?category=acoustic (optional) */
export function fetchProducts(categorySlug?: string): Promise<{ products: Product[] }> {
  const qs = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : '';
  return request<{ products: Product[] }>(`/api/products${qs}`);
}

/** GET /api/products/slug/:productSlug — full product detail */
export function fetchProductBySlug(productSlug: string): Promise<Product> {
  return request<Product>(`/api/products/slug/${encodeURIComponent(productSlug)}`);
}

/** True when the product has at least one 3D visualizer texture URL (server- or client-safe). */
export function hasVisualizerTextures(textures?: VisualizerTexture[] | null): boolean {
  return Boolean(textures?.some((t) => typeof t.image === "string" && t.image.trim().length > 0));
}
