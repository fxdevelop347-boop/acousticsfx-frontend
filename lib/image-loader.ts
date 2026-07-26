/**
 * ImageKit loader for `next/image`.
 *
 * ImageKit is already an image CDN, so sending its URLs through the Next.js
 * optimizer costs an extra hop plus a server-side AVIF re-encode per image —
 * which is where "upstream image response timed out" comes from. Pointing
 * `next/image` at ImageKit's own transformations instead keeps the responsive
 * srcset and serves everything from ImageKit's edge (measured: 116KB WebP at
 * w-1080 vs the 709KB original the optimizer was fetching).
 *
 * Only remote ImageKit URLs use this. Local images under /public still go
 * through the built-in optimizer — see components/shared/SmartImage.tsx.
 */

export const IMAGEKIT_HOST = "https://ik.imagekit.io";

/** ImageKit's own default, and what its docs recommend for photographic content. */
const DEFAULT_QUALITY = 80;

export function isImageKitSrc(src: unknown): src is string {
  return typeof src === "string" && src.startsWith(IMAGEKIT_HOST);
}

type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageKitLoader({ src, width, quality }: LoaderArgs): string {
  const [base, existingQuery] = src.split("?");
  // `f-auto` negotiates AVIF/WebP from the Accept header at ImageKit's edge.
  const transform = `tr=w-${width},q-${quality ?? DEFAULT_QUALITY},f-auto`;
  // Preserve params already on the URL (signatures, cache busters).
  return existingQuery ? `${base}?${existingQuery}&${transform}` : `${base}?${transform}`;
}
