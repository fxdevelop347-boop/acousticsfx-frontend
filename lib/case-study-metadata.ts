import type { Metadata } from "next";
import { api } from "@/lib/api/client";
import { SITE_URL } from "@/lib/site-url";
import { SEO_KEYWORDS_CASE_STUDY_POST } from "@/lib/seo-keywords";

export async function buildCaseStudySlugMetadata(slug: string): Promise<Metadata> {
  const canonical = `${SITE_URL}/resources/casestudy/${encodeURIComponent(slug)}`;

  try {
    const res = await api.get<{
      success: boolean;
      caseStudy: {
        title: string;
        description?: string;
        image?: string;
        metaDescription?: string;
      };
    }>(`/api/resources/case-studies/slug/${encodeURIComponent(slug)}`);

    if (!res.success || !res.caseStudy) {
      return { title: "Case Study", alternates: { canonical } };
    }

    const { title, description, image, metaDescription } = res.caseStudy;
    // Author-written meta copy wins; the card teaser is the fallback.
    const source = metaDescription?.trim() || description?.trim();
    const desc =
      source && source.length > 0
        ? source.replace(/\s+/g, " ").slice(0, 160)
        : `${title} — FX Acoustics acoustic project case study in India.`.slice(
            0,
            160
          );

    return {
      title: `${title} | Case Study`,
      description: desc,
      keywords: SEO_KEYWORDS_CASE_STUDY_POST,
      alternates: { canonical },
      openGraph: {
        title,
        description: desc,
        url: canonical,
        type: "article",
        ...(image ? { images: [{ url: image }] } : {}),
      },
    };
  } catch {
    return { title: "Case Study", alternates: { canonical } };
  }
}
