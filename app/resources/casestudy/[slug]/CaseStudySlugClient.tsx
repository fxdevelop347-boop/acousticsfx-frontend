"use client";

import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import Spinner from "@/components/shared/Spinner";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

interface CaseStudy {
  _id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  order?: number;
}

interface CaseStudySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default function CaseStudySlugClient({ params }: CaseStudySlugPageProps) {
  const { slug } = use(params);
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<{ success: boolean; caseStudy: CaseStudy }>(
          `/api/resources/case-studies/slug/${encodeURIComponent(slug)}`
        );
        if (response.success && response.caseStudy) {
          setCaseStudy(response.caseStudy);
        } else {
          setError("Case study not found");
        }
      } catch (err) {
        console.error("Failed to fetch case study:", err);
        setError("Failed to load case study");
        setCaseStudy(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-3">
        <Spinner size="sm" />
        <span className="text-gray-500">Loading…</span>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-600 mb-6">{error ?? "Case study not found."}</p>
        <Link
          href="/resources/casestudy"
          className="text-blue-600 font-medium hover:underline"
        >
          ← Back to Case Studies
        </Link>
      </div>
    );
  }

  const heroAlt = `FX Acoustics case study: ${caseStudy.title}`;

  return (
    <>
      <section className="w-full bg-gray-900 text-white">
        <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px]">
          <Image
            src={caseStudy.image || PLACEHOLDER_IMAGE}
            fill
            alt={heroAlt}
            className="object-cover opacity-90"
            priority
            sizes="100vw"
            unoptimized={caseStudy.image?.startsWith("http")}
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
              <Link
                href="/resources/casestudy"
                className="text-sm text-white/90 hover:text-white mb-2 inline-block"
              >
                ← Case Studies
              </Link>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{caseStudy.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-10 sm:py-14 md:py-18">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
            {caseStudy.description}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link
              href="/resources/casestudy"
              className="text-blue-600 font-medium hover:underline"
            >
              ← Back to all Case Studies
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
