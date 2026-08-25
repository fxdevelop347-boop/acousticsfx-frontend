import { api } from "./api/client";

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudyGalleryImage {
  url: string;
  caption?: string;
}

export interface CaseStudyQuote {
  text: string;
  author?: string;
  role?: string;
}

export interface CaseStudy {
  _id?: string;
  slug: string;
  title: string;
  /** Teaser shown on cards and carousels. */
  description?: string;
  /** Hero image. */
  image: string;
  order?: number;

  client?: string;
  industry?: string;
  location?: string;
  year?: string;

  challenge?: string;
  solution?: string;
  results?: string;

  metrics?: CaseStudyMetric[];
  gallery?: CaseStudyGalleryImage[];
  productsUsed?: string[];
  quote?: CaseStudyQuote;

  isFeatured?: boolean;
  metaDescription?: string;
}

interface ResourcesResponse {
  caseStudies: CaseStudy[];
}

interface CaseStudyListResponse {
  success: boolean;
  caseStudies: CaseStudy[];
}

/**
 * Case studies from the combined resources payload. Used by the home and product
 * carousels, which only need slug/title/description/image.
 */
export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  const data = await api.get<ResourcesResponse>("/api/resources");
  return data.caseStudies ?? [];
}

/** Full published list, featured first. Optionally exclude one slug (for "related"). */
export async function fetchCaseStudyList(options?: {
  limit?: number;
  excludeSlug?: string;
}): Promise<CaseStudy[]> {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.excludeSlug) params.set("excludeSlug", options.excludeSlug);
  const query = params.toString();

  const data = await api.get<CaseStudyListResponse>(
    `/api/resources/case-studies${query ? `?${query}` : ""}`
  );
  return data.caseStudies ?? [];
}

export async function fetchCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const data = await api.get<{ success: boolean; caseStudy: CaseStudy }>(
    `/api/resources/case-studies/slug/${encodeURIComponent(slug)}`
  );
  return data.success && data.caseStudy ? data.caseStudy : null;
}
