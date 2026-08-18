import type { Metadata } from "next";
import CaseStudySlugClient from "./CaseStudySlugClient";
import { buildCaseStudySlugMetadata } from "@/lib/case-study-metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildCaseStudySlugMetadata(slug);
}

export default function CaseStudySlugPage({ params }: Props) {
  return <CaseStudySlugClient params={params} />;
}
