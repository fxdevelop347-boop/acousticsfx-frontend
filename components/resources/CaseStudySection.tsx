import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { FadeIn, SlideIn } from "@/components/animations";
import { CASE_STUDY_PLACEHOLDER } from "./CaseStudyCard";
import type { CaseStudy } from "@/lib/case-studies-api";

type CaseStudySectionProps = {
  study: CaseStudy;
  /** Mirrors the image/text columns, for alternating stacks. */
  reverse?: boolean;
  bgColor?: "white" | "light-blue";
  /** Renders an "Featured case study" eyebrow above the title. */
  eyebrow?: string;
};

/**
 * Full-width image + copy band. Used for the featured case study at the top of
 * the listing page.
 */
export default function CaseStudySection({
  study,
  reverse = false,
  bgColor = "white",
  eyebrow,
}: CaseStudySectionProps) {
  const bgClass = bgColor === "light-blue" ? "bg-[#F4F6FF]" : "bg-white";
  const href = `/resources/casestudy/${study.slug}`;
  const meta = [study.client, study.industry, study.location, study.year]
    .filter(Boolean)
    .join(" · ");
  const metrics = study.metrics?.slice(0, 3) ?? [];

  return (
    <section className={`w-full py-12 sm:py-16 lg:py-20 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`flex flex-col ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } gap-8 lg:gap-10 items-center bg-[#F4F6FF] rounded-2xl p-6 sm:p-8`}
        >
          <SlideIn direction={reverse ? "right" : "left"} className="w-full lg:w-1/2">
            <Link href={href} className="block group">
              <div className="relative w-full h-[220px] sm:h-[300px] rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={study.image || CASE_STUDY_PLACEHOLDER}
                  alt={`FX Acoustics case study: ${study.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={study.image?.startsWith("http")}
                />
              </div>
            </Link>
          </SlideIn>

          <FadeIn direction="up" className="w-full lg:w-1/2">
            {eyebrow && (
              <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                {eyebrow}
              </span>
            )}

            <h2 className="text-[20px] sm:text-[22px] lg:text-[26px] axiforma font-bold mb-2 text-gray-900">
              <Link href={href} className="hover:text-blue-700 transition-colors">
                {study.title}
              </Link>
            </h2>

            {meta && <p className="text-sm text-gray-500 mb-3">{meta}</p>}

            {study.description && (
              <p className="text-[16px] sm:text-[17px] inter-font font-[400] text-gray-600 mb-5 leading-relaxed">
                {study.description}
              </p>
            )}

            {metrics.length > 0 && (
              <dl className="flex flex-wrap gap-x-8 gap-y-3 mb-6">
                {metrics.map((metric, i) => (
                  <div key={i}>
                    <dd className="text-2xl font-bold text-gray-900 leading-tight">
                      {metric.value}
                    </dd>
                    <dt className="text-xs text-gray-500">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            <Link
              href={href}
              className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline cursor-pointer"
            >
              Read the full case study →
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
