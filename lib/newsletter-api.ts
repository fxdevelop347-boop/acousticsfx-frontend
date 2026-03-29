/**
 * Newsletter signup API. Submits to POST /api/newsletter
 */

import { getPublicApiBaseUrl } from "@/lib/public-api-base";

const getBaseUrl = () => getPublicApiBaseUrl();

export async function subscribeNewsletter(email: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to subscribe');
  }
}
