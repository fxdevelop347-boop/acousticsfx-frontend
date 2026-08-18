import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies-api";

export const CASE_STUDY_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

/** Compact grid card. Optional fields collapse so sparse records still look intentional. */
export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const headlineMetric = study.metrics?.[0];
  const meta = [study.client, study.location].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/resources/casestudy/${study.slug}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-4 flex flex-col"
    >
      <div className="relative w-full h-[180px] sm:h-[200px] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={study.image || CASE_STUDY_PLACEHOLDER}
          fill
          alt={`FX Acoustics case study: ${study.title}`}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={study.image?.startsWith("http")}
        />
      </div>

      {study.industry && (
        <span className="inline-block self-start mt-3 bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-md">
          {study.industry}
        </span>
      )}

      <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 axiforma">
        {study.title}
      </h3>

      {meta && <p className="mt-1 text-sm text-gray-500">{meta}</p>}

      {study.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-3 inter-font">
          {study.description}
        </p>
      )}

      {/* Push the proof row to the bottom so cards of differing length stay aligned. */}
      <div className="mt-auto pt-4 flex items-end justify-between gap-3">
        {headlineMetric ? (
          <span className="leading-tight">
            <span className="block text-xl font-bold text-gray-900">
              {headlineMetric.value}
            </span>
            <span className="block text-xs text-gray-500">{headlineMetric.label}</span>
          </span>
        ) : (
          <span />
        )}
        <span className="text-blue-600 font-medium text-sm group-hover:underline whitespace-nowrap">
          Read case study →
        </span>
      </div>
    </Link>
  );
}
