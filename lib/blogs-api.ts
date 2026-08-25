import { api } from "./api/client";

/**
 * Legacy structured body. Older posts stored an ordered block array; the admin
 * editor now writes HTML, so both shapes have to render.
 */
export interface BlogContentBlock {
  type: "paragraph" | "image" | "heading";
  content: string;
  caption?: string;
  order: number;
}

/** Card-sized projection: what listings and carousels need, nothing more. */
export interface BlogSummary {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  heroImage: string;
  authorName?: string;
  authorImage?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
}

/** Full record, including the body. Returned by the by-slug endpoint. */
export interface Blog extends BlogSummary {
  authorName: string;
  authorEmail?: string;
  /** HTML from the admin editor, or a legacy block array. Sanitized server-side on write. */
  content: string | BlogContentBlock[];
  views?: number;
}

interface BlogsResponse {
  success: boolean;
  blogs: BlogSummary[];
}

/** Published posts, newest first. */
export async function fetchBlogs(limit?: number): Promise<BlogSummary[]> {
  const query = limit ? `?limit=${limit}` : "";
  const data = await api.get<BlogsResponse>(`/api/blogs${query}`);
  return data.blogs ?? [];
}

export function fetchLatestBlogs(limit = 3): Promise<BlogSummary[]> {
  return fetchBlogs(limit);
}

/** Sidebar list on a post, with the post being read left out. */
export async function fetchRecentBlogs(
  excludeSlug: string,
  limit = 5
): Promise<BlogSummary[]> {
  const data = await api.get<BlogsResponse>(
    `/api/blogs?recent=true&limit=${limit}&excludeSlug=${encodeURIComponent(excludeSlug)}`
  );
  return data.blogs ?? [];
}

/** One post by slug. Returns null when the slug matches nothing published. */
export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  const data = await api.get<{ success: boolean; blog: Blog }>(
    `/api/blogs/slug/${encodeURIComponent(slug)}`
  );
  return data.success && data.blog ? data.blog : null;
}
