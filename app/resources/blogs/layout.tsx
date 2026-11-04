import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { SEO_KEYWORDS_BLOG } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title: "Blogs & Articles",
  description:
    "Browse practical articles on acoustic treatment, soundproofing, and interior acoustics from FX Acoustics—written for architects, AV consultants, and facility teams in India.",
  keywords: SEO_KEYWORDS_BLOG,
  alternates: {
    canonical: `${SITE_URL}/resources/blogs`,
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
