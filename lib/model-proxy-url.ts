/**
 * Builds a same-API-origin URL that streams a GLB/GLTF with CORS headers so Three.js
 * GLTFLoader can fetch remote models from ImageKit or other hosts.
 *
 * The backend route is GET /api/products/model-proxy?url=...
 */
import { getPublicApiBaseUrl } from "@/lib/public-api-base";

export function getVisualizerModelLoadUrl(modelUrl: string): string {
  const u = modelUrl.trim();
  if (!u || u.startsWith("blob:")) return u;
  if (u.startsWith("/")) return u;
  if (typeof window !== "undefined") {
    try {
      const parsed = new URL(u);
      if (parsed.origin === window.location.origin) return u;
    } catch {
      return u;
    }
  }
  const base = getPublicApiBaseUrl().replace(/\/$/, "");
  return `${base}/api/products/model-proxy?url=${encodeURIComponent(u)}`;
}
