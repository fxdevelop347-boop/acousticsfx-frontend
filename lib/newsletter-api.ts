/**
 * Newsletter signup API. Submits to POST /api/newsletter
 */

const getBaseUrl = () =>
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'https://api.themoonlit.in';

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
