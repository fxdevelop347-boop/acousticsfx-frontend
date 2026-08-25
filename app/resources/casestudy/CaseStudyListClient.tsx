"use client";

import { useEffect, useMemo, useState } from "react";
import CaseStudySection from "@/components/resources/CaseStudySection";
import CaseStudyCard from "@/components/resources/CaseStudyCard";
import ResourceEmptyState from "@/components/resources/ResourceEmptyState";
import Spinner from "@/components/shared/Spinner";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { fetchCaseStudyList, type CaseStudy } from "@/lib/case-studies-api";

const ALL = "All";

export default function CaseStudyListClient() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string>(ALL);

  useEffect(() => {
    let cancelled = false;

    fetchCaseStudyList()
      .then((data) => {
        if (cancelled) return;
        setStudies(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to fetch case studies:", err);
        setError("We couldn't load the case studies just now. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Derived from the loaded records rather than fetched separately: the chips must
  // never offer an industry that has nothing behind it on this page.
  const industries = useMemo(() => {
    const seen = new Set<string>();
    for (const study of studies) {
      if (study.industry?.trim()) seen.add(study.industry.trim());
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [studies]);

  // The API sorts featured first, so the first record is the one to highlight.
  const featured = studies.find((s) => s.isFeatured) ?? studies[0];

  // Everything below the featured band, before filtering. The grid section is
  // gated on this so that filtering to an empty result keeps the chips on screen.
  const rest = useMemo(
    () => (featured ? studies.filter((s) => s.slug !== featured.slug) : studies),
    [studies, featured]
  );

  const visible = useMemo(
    () =>
      activeIndustry === ALL
        ? rest
        : rest.filter((s) => s.industry === activeIndustry),
    [rest, activeIndustry]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-3 py-24">
        <Spinner size="sm" />
        <span className="text-sm text-gray-500">Loading case studies…</span>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ResourceEmptyState
          tone="error"
          title="We couldn't load the case studies"
          message="Something went wrong on our side. Refresh the page to try again, or contact us and we'll send the projects over directly."
        />
        <ConnectWithExperts />
      </>
    );
  }

  if (studies.length === 0) {
    return (
      <>
        <ResourceEmptyState
          title="Case studies are on the way"
          message="We're documenting our recent acoustic installations. In the meantime, explore the panels and systems behind them, or tell us about your space."
        />
        <ConnectWithExperts />
      </>
    );
  }

  return (
    <>
      {featured && (
        <CaseStudySection
          study={featured}
          bgColor="white"
          eyebrow="Featured case study"
        />
      )}

      {rest.length > 0 && (
        <section className="w-full py-12 sm:py-16 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] axiforma font-bold text-gray-900 mb-6">
              More projects
            </h2>

            {industries.length > 1 && (
              <div
                className="flex flex-wrap gap-2 mb-8"
                role="group"
                aria-label="Filter case studies by industry"
              >
                {[ALL, ...industries].map((industry) => {
                  const active = activeIndustry === industry;
                  return (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => setActiveIndustry(industry)}
                      aria-pressed={active}
                      className={`px-4 py-1.5 text-sm rounded-full border transition cursor-pointer ${
                        active
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {industry}
                    </button>
                  );
                })}
              </div>
            )}

            {visible.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {visible.map((study) => (
                  <StaggerItem key={study.slug}>
                    <CaseStudyCard study={study} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-600 mb-3">
                  No case studies in this category yet.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveIndustry(ALL)}
                  className="text-sm font-medium text-[#EA8E39] hover:underline cursor-pointer"
                >
                  Show all case studies
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
