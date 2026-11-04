import type { MetadataRoute } from "next";
import { getPublicApiBaseUrl } from "@/lib/public-api-base";
import { SITE_URL } from "@/lib/site-url";

type BlogRow = { slug?: string };
type CaseStudyRow = { slug?: string };
type ProductRow = { slug?: string; categorySlug?: string };

async function fetchJson<T>(path: string): Promise<T | null> {
  const base = getPublicApiBaseUrl();
  try {
    const res = await fetch(`${base}${path}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contactus`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/resources/casestudy`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/resources/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const blogsPayload = await fetchJson<{ blogs?: BlogRow[] }>("/api/blogs?limit=500");
  const blogs = blogsPayload?.blogs ?? [];
  const blogUrls: MetadataRoute.Sitemap = blogs
    .map((b) => (typeof b.slug === "string" && b.slug ? b.slug : null))
    .filter((s): s is string => !!s)
    .map((slug) => ({
      url: `${SITE_URL}/resources/blogs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const casePayload = await fetchJson<{ caseStudies?: CaseStudyRow[] }>(
    "/api/resources/case-studies"
  );
  const cases = casePayload?.caseStudies ?? [];
  const caseUrls: MetadataRoute.Sitemap = cases
    .map((c) => (typeof c.slug === "string" && c.slug ? c.slug : null))
    .filter((s): s is string => !!s)
    .map((slug) => ({
      url: `${SITE_URL}/resources/casestudy/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  const productsPayload = await fetchJson<{ products?: ProductRow[] }>("/api/products");
  const products = productsPayload?.products ?? [];
  const productUrls: MetadataRoute.Sitemap = products
    .filter((p) => p.slug && p.categorySlug)
    .map((p) => ({
      url: `${SITE_URL}/products/${p.categorySlug}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const categoriesPayload = await fetchJson<{ categories?: { slug: string }[] }>(
    "/api/products/categories"
  );
  const categories = categoriesPayload?.categories ?? [];
  const categoryUrls: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug && c.slug !== "acoustic")
    .map((c) => ({
      url: `${SITE_URL}/products/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  return [...staticRoutes, ...categoryUrls, ...productUrls, ...blogUrls, ...caseUrls];
}
