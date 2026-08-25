import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import CaseStudySlugClient from "./CaseStudySlugClient";
import { buildCaseStudySlugMetadata } from "@/lib/case-study-metadata";
import { fetchCaseStudyBySlug, type CaseStudy } from "@/lib/case-studies-api";
import { ApiClientError } from "@/lib/api/client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildCaseStudySlugMetadata(slug);
}

export default async function CaseStudySlugPage({ params }: Props) {
  const { slug } = await params;

  // Resolve on the server so a missing or unpublished case study returns a real
  // 404 rather than a 200 page that says "not found".
  let caseStudy: CaseStudy | null = null;
  try {
    caseStudy = await fetchCaseStudyBySlug(slug);
  } catch (err) {
    // Only a genuine "no such case study" is a 404. A transient API failure must
    // surface as a 500 so search engines retry instead of deindexing the page.
    if (err instanceof ApiClientError && err.status === 404) notFound();
    throw err;
  }

  if (!caseStudy) notFound();

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Resources", href: "/resources" },
            { name: "Case Studies", href: "/resources/casestudy" },
            { name: caseStudy.title, href: `/resources/casestudy/${slug}` },
          ]}
        />
      </section>
      <CaseStudySlugClient slug={slug} caseStudy={caseStudy} />
    </>
  );
}
