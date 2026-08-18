"use client";

import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { useState, useEffect } from "react";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import CaseStudyCard, {
  CASE_STUDY_PLACEHOLDER,
} from "@/components/resources/CaseStudyCard";
import { FadeIn } from "@/components/animations";
import { fetchCaseStudyList, type CaseStudy } from "@/lib/case-studies-api";

interface CaseStudySlugPageProps {
  /** Resolved on the server, so the page renders fully on first paint. */
  caseStudy: CaseStudy;
  slug: string;
}

/** Long-form text block. Paragraph breaks in the admin textarea become paragraphs. */
function StoryBlock({ title, body }: { title: string; body: string }) {
  const paragraphs = body.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <FadeIn direction="up" className="mb-10 sm:mb-12">
      <h2 className="text-[22px] sm:text-[26px] axiforma font-bold text-gray-900 mb-3">
        {title}
      </h2>
      <div className="space-y-4">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-[16px] sm:text-[17px] inter-font text-gray-600 leading-relaxed whitespace-pre-line"
          >
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </FadeIn>
  );
}

/** Tagged with the slug it belongs to, so navigating between case studies never
 *  shows the previous one's related list while the next is loading. */
interface RelatedState {
  slug: string;
  items: CaseStudy[];
}

export default function CaseStudySlugClient({
  caseStudy,
  slug,
}: CaseStudySlugPageProps) {
  const [relatedState, setRelatedState] = useState<RelatedState | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    // Supplementary content — a failure here must not break the page.
    fetchCaseStudyList({ excludeSlug: slug, limit: 3 })
      .then((data) => {
        if (!cancelled) setRelatedState({ slug, items: data });
      })
      .catch(() => {
        if (!cancelled) setRelatedState({ slug, items: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const related = relatedState?.slug === slug ? relatedState.items : [];

  const heroAlt = `FX Acoustics case study: ${caseStudy.title}`;
  const metaItems = [
    { label: "Client", value: caseStudy.client },
    { label: "Industry", value: caseStudy.industry },
    { label: "Location", value: caseStudy.location },
    { label: "Year", value: caseStudy.year },
  ].filter((item) => !!item.value);

  const metrics = caseStudy.metrics ?? [];
  const gallery = caseStudy.gallery ?? [];
  const productsUsed = caseStudy.productsUsed ?? [];
  const hasStory = !!(caseStudy.challenge || caseStudy.solution || caseStudy.results);

  return (
    <>
      {/* Hero */}
      <section className="w-full bg-gray-900 text-white">
        <div className="relative w-full h-[280px] sm:h-[360px] md:h-[440px]">
          <Image
            src={caseStudy.image || CASE_STUDY_PLACEHOLDER}
            fill
            alt={heroAlt}
            className="object-cover opacity-90"
            priority
            sizes="100vw"
            unoptimized={caseStudy.image?.startsWith("http")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-10">
              <Link
                href="/resources/casestudy"
                className="text-sm text-white/90 hover:text-white mb-3 inline-block"
              >
                ← Case Studies
              </Link>
              {caseStudy.industry && (
                <span className="block mb-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
                  {caseStudy.industry}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold axiforma max-w-4xl">
                {caseStudy.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Project facts */}
      {metaItems.length > 0 && (
        <section className="w-full border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metaItems.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                    {item.label}
                  </dt>
                  <dd className="text-sm sm:text-base font-medium text-gray-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Headline outcomes */}
      {metrics.length > 0 && (
        <section className="w-full bg-[#F4F6FF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <dl
              className={`grid gap-6 sm:gap-8 grid-cols-2 ${
                metrics.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
            >
              {metrics.map((metric, i) => (
                <div key={i} className="text-center sm:text-left">
                  <dd className="text-3xl sm:text-4xl font-bold text-gray-900 axiforma leading-tight">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 text-sm text-gray-600 inter-font">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Narrative */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Summary leads only when there are story sections beneath it; otherwise
              it is the whole body and needs no separate heading. */}
          {caseStudy.description && (
            <p className="text-[18px] sm:text-[20px] inter-font text-gray-700 leading-relaxed mb-10 whitespace-pre-line">
              {caseStudy.description}
            </p>
          )}

          {caseStudy.challenge && (
            <StoryBlock title="The challenge" body={caseStudy.challenge} />
          )}
          {caseStudy.solution && (
            <StoryBlock title="Our solution" body={caseStudy.solution} />
          )}
          {caseStudy.results && (
            <StoryBlock title="The results" body={caseStudy.results} />
          )}

          {!hasStory && !caseStudy.description && (
            <p className="text-gray-500">
              Details for this project are being written up.
            </p>
          )}

          {productsUsed.length > 0 && (
            <FadeIn direction="up" className="mt-2">
              <h2 className="text-[18px] sm:text-[20px] axiforma font-bold text-gray-900 mb-3">
                Products used
              </h2>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {productsUsed.map((product) => (
                  <li
                    key={product}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full"
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="w-full bg-[#FAFAFA] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-[22px] sm:text-[26px] axiforma font-bold text-gray-900 mb-6">
              Project gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {gallery.map((img, i) => (
                <figure key={i} className="m-0">
                  <div className="relative w-full h-[220px] sm:h-[240px] rounded-xl overflow-hidden bg-gray-200">
                    <Image
                      src={img.url}
                      fill
                      alt={img.caption || `${caseStudy.title} — project photo ${i + 1}`}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={img.url?.startsWith("http")}
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="mt-2 text-sm text-gray-500">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client quote */}
      {caseStudy.quote?.text && (
        <section className="w-full bg-[#1a1a2e] text-white py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <blockquote className="text-[20px] sm:text-[26px] axiforma font-medium leading-relaxed m-0">
              “{caseStudy.quote.text}”
            </blockquote>
            {(caseStudy.quote.author || caseStudy.quote.role) && (
              <p className="mt-6 text-sm text-gray-300 inter-font">
                {caseStudy.quote.author}
                {caseStudy.quote.author && caseStudy.quote.role && " · "}
                {caseStudy.quote.role}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="w-full py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-[22px] sm:text-[26px] axiforma font-bold text-gray-900 m-0">
                More case studies
              </h2>
              <Link
                href="/resources/casestudy"
                className="text-blue-600 font-medium text-sm hover:underline whitespace-nowrap"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {related.map((study) => (
                <CaseStudyCard key={study.slug} study={study} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
