/**
 * Public testimonials API (home page).
 * Fetches from GET /api/testimonials
 */

const getBaseUrl = () =>
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'https://api.themoonlit.in';

export interface Testimonial {
  _id: string;
  company: string;
  companyLogo: string;
  text: string;
  name: string;
  role: string;
  avatar: string;
  order?: number;
}

export interface TestimonialsResponse {
  testimonials: Testimonial[];
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${getBaseUrl()}/api/testimonials`);
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  const data: TestimonialsResponse = await res.json();
  return data.testimonials ?? [];
}
