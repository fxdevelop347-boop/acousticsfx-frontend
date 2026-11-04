import type { Metadata } from "next";
import ResourcesPageClient from "./ResourcesPageClient";
import { SITE_URL } from "@/lib/site-url";
import { SEO_KEYWORDS_RESOURCES } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title:
    "Acoustic Resources, Blogs & Case Studies",
  description:
    "Read FX Acoustics articles on soundproofing, studio design, and acoustic treatment—plus project stories and technical guidance for architects and facility teams in India.",
  keywords: SEO_KEYWORDS_RESOURCES,
  alternates: {
    canonical: `${SITE_URL}/resources`,
  },
};

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}
