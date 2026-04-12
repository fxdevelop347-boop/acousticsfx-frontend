/**
 * Builds a same-API-origin URL that streams the image with CORS headers so Three.js
 * can upload it to WebGL without a tainted canvas (remote URLs often block this).
 *
 * The backend route is GET /api/products/texture-proxy?url=...
 */
import { getPublicApiBaseUrl } from "@/lib/public-api-base";

export function getVisualizerTextureLoadUrl(imageUrl: string): string {
  const u = imageUrl.trim();
  if (!u || u.startsWith("data:") || u.startsWith("blob:")) return u;
  if (typeof window !== "undefined") {
    try {
      const parsed = new URL(u);
      if (parsed.origin === window.location.origin) return u;
    } catch {
      return u;
    }
  }
  const base = getPublicApiBaseUrl().replace(/\/$/, "");
  return `${base}/api/products/texture-proxy?url=${encodeURIComponent(u)}`;
}
