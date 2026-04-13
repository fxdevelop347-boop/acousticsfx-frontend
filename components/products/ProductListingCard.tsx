import Image from "next/image";
import Link from "next/link";
import TrademarkTitle from "@/components/shared/TrademarkTitle";

export function ProductListingCard({
  href,
  title,
  description,
  image,
  showTrademark,
  specs,
  className = "",
  variant = "default",
  compactOnMobile = false,
}: {
  href: string;
  title: string;
  description: string;
  image: string;
  showTrademark?: boolean;
  specs?: Array<{ label: string; value: string }>;
  /** e.g. min-width for carousel slides */
  className?: string;
  /** Compact typography for 3-column category grids */
  variant?: "default" | "grid";
  /** Reduce card density on small screens while keeping desktop unchanged */
  compactOnMobile?: boolean;
}) {
  const isGrid = variant === "grid";
  const isCompactMobile = compactOnMobile && !isGrid;
  const imageSizes = isGrid
    ? "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
    : isCompactMobile
      ? "(max-width: 639px) 84vw, (max-width: 1023px) 68vw, 50vw"
      : "(max-width: 1024px) 100vw, 50vw";

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white text-inherit no-underline shadow-[0_4px_24px_rgba(15,23,42,0.055)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#1F6775]/30 hover:shadow-[0_16px_48px_rgba(15,23,42,0.12)] ${className}`}
    >
      <div
        className={`relative overflow-hidden bg-neutral-100 ${
          isCompactMobile ? "aspect-2/1 sm:aspect-16/10" : "aspect-16/10"
        }`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes={imageSizes}
          quality={78}
          loading="lazy"
          decoding="async"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.045]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div
        className={`flex flex-1 flex-col ${
          isGrid
            ? "p-4 sm:p-5 lg:p-5 xl:p-6"
            : isCompactMobile
              ? "p-4 sm:p-6 lg:p-7"
              : "p-5 sm:p-6 lg:p-7"
        }`}
      >
        <div className={`mb-2 flex items-center gap-2.5 ${isGrid ? "sm:mb-2.5" : "mb-3"}`}>
          <span className="h-px w-7 bg-[#EA8E39]" aria-hidden />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1F6775]">
            Product
          </span>
        </div>

        <h3
          className={`mb-2 font-semibold leading-snug tracking-tight text-neutral-900 manrope sm:mb-3 ${
            isGrid
              ? "line-clamp-2 text-[17px] sm:text-lg lg:text-[1.05rem] xl:text-xl"
              : isCompactMobile
                ? "text-lg sm:text-2xl lg:text-[1.65rem]"
                : "text-xl sm:text-2xl lg:text-[1.65rem]"
          }`}
        >
          <TrademarkTitle
            title={title}
            showTrademark={showTrademark}
            className="inline"
          />
        </h3>

        <p
          className={`flex-1 leading-relaxed text-neutral-600 ${
            isGrid
              ? "line-clamp-3 text-[13px] sm:text-sm"
              : isCompactMobile
                ? "line-clamp-2 sm:line-clamp-3 text-[13px] sm:text-[15px]"
                : "line-clamp-3 text-sm sm:text-[15px]"
          }`}
        >
          {description}
        </p>

        {specs && specs.length > 0 && (
          <div
            className={
              isGrid
                ? "mb-3 mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-100 pt-4"
                : isCompactMobile
                  ? "mb-4 mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-100 pt-4 sm:mb-5 sm:mt-5 sm:gap-x-6 sm:gap-y-3 sm:pt-5"
                  : "mb-5 mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-neutral-100 pt-5"
            }
          >
            {specs.slice(0, 3).map((spec) => (
              <div key={`${spec.label}-${spec.value}`}>
                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                  {spec.label}
                </p>
                <p className="text-xs font-semibold text-neutral-800">{spec.value}</p>
              </div>
            ))}
          </div>
        )}

        <span
          className={`inline-flex items-center gap-2 font-semibold text-[#1F6775] transition-colors group-hover:text-[#EA8E39] ${
            isGrid
              ? "mt-4 text-xs sm:text-sm"
              : isCompactMobile
                ? "mt-4 text-sm sm:mt-6"
                : "mt-6 text-sm"
          }`}
        >
          View details
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
