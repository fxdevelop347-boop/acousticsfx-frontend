import Link from "next/link";

/**
 * Shown where case study cards would be when there are none to show, or when the
 * list fails to load. The waveform is the site's own visual language (see
 * VoicePlug) rather than a stock empty-folder glyph: bars sitting quiet read as
 * a room with nothing recorded in it yet.
 */

/** Resting heights in px. Asymmetric, so the row reads as a signal, not a chart. */
const BARS = [10, 18, 30, 46, 64, 44, 26, 16, 9];

/** The two bars at the peak carry the accent; the rest stay quiet around them. */
const ACCENT_INDEXES = new Set([3, 4, 5]);

interface CaseStudiesEmptyStateProps {
  title: string;
  message: string;
  /** Error copy shouldn't invite the reader to keep browsing as if nothing happened. */
  tone?: "empty" | "error";
}

export default function CaseStudiesEmptyState({
  title,
  message,
  tone = "empty",
}: CaseStudiesEmptyStateProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white shadow-sm px-6 sm:px-10 py-12 sm:py-14 text-center">
        <div
          className="flex items-end justify-center gap-[6px] h-16 mb-8"
          aria-hidden="true"
        >
          {BARS.map((height, i) => (
            <span
              key={i}
              className={`cs-wave-bar w-[6px] rounded-full ${
                ACCENT_INDEXES.has(i) ? "bg-[#EA8E39]" : "bg-gray-200"
              }`}
              style={{
                height: `${height}px`,
                // Offsetting each bar turns nine identical pulses into one travelling wave.
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>

        <h2 className="axiforma text-[22px] sm:text-[26px] font-bold text-gray-900 mb-3">
          {title}
        </h2>

        <p className="inter-font text-[15px] sm:text-base text-gray-600 leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-[#EA8E39] text-white px-6 py-3 text-sm font-medium transition hover:bg-[#d97f2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA8E39]"
          >
            Browse products
          </Link>
          <Link
            href="/contactus"
            className="inline-flex items-center justify-center border border-gray-300 text-gray-900 px-6 py-3 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            {tone === "error" ? "Get in touch" : "Talk to our team"}
          </Link>
        </div>
      </div>
    </div>
  );
}
