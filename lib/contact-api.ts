/**
 * Contact form API. Submits to POST /api/contact
 */

import { getPublicApiBaseUrl } from "@/lib/public-api-base";

const getBaseUrl = () => getPublicApiBaseUrl();

export const CONTACT_SUBJECTS = [
  'General Inquiry',
  'Help & Support',
  'Become Partner',
  'Other',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      subject: data.subject,
      message: data.message.trim() || '',
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to send message');
  }
}
