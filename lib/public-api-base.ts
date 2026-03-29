/**
 * Base URL for the acousticsfx backend (Express), used by browser and server fetch calls.
 *
 * - Set **NEXT_PUBLIC_API_URL** in `.env.local` and in Vercel (or your host) — required for production.
 * - In **development**, if unset, defaults to `http://localhost:8080` so local backend works without env.
 * - In **production**, if unset, falls back to the same host used by older API modules (override via env).
 */
export function getPublicApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8080";
  }
  return "https://api.themoonlit.in";
}
