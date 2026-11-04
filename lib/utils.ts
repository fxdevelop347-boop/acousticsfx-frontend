/**
 * CMS link fields are free text, so a value like "/about us" would render a
 * link that 404s. Returns `fallback` unless `value` is a usable link target.
 */
export function safeHref(value: string | undefined, fallback: string): string {
  const href = value?.trim() ?? "";
  if (!href || /\s/.test(href)) return fallback;
  return /^(\/|#|https?:\/\/|mailto:|tel:)/.test(href) ? href : fallback;
}

/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}
