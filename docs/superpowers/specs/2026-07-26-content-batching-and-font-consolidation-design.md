# Server-Side Data Loading & Font Consolidation — Design

**Date:** 2026-07-26
**Status:** Awaiting review
**Scope:** Workstreams **C** (move all page data loading server-side) and **A** (10 font families → 3)

---

## Context

The client raised three complaints: too many fonts on a page, oversized images, and too much
scrolling between sections. A separate ask is to finish making Home and About content
CMS-driven, and to improve overall performance.

An audit found these are five independent workstreams:

| | Workstream | Depends on |
|---|---|---|
| **A** | Fonts 10 → 3 | — |
| **B** | Image pipeline: convert + resize to WebP | — |
| **C** | Move all page data loading server-side | — |
| **D** | Finish dynamic content for Home + About | **C** |
| **E** | Section density + mobile pass | touches same files as **D** |

**This spec covers A and C only.** B, D, and E get their own specs.

**Ordering rationale:** D must not precede C. Today every section fetches its own data from a
`useEffect`; adding dynamic content to the remaining sections under that pattern would add more
post-hydration round-trips, making the page measurably slower while appearing to be progress.
C removes the pattern first, then D becomes additive and cheap.

### On the "90% faster" target

That target is not measurable as stated and this spec does not claim it. Instead we baseline
with Lighthouse before any change and report the same metrics after:

- **Largest Contentful Paint (LCP)** — mobile and desktop, Home and About
- **Total Blocking Time (TBT)**
- **Total transferred page weight**
- **Client-side API requests after hydration**

The last one has a hard target: **18 → 0** on Home. The others are reported as measured, not
promised in advance.

---

## Current state

### Data fetching

Home fires **18 API requests from the browser after hydration**. Nothing on the page is
server-rendered from the API.

**Content-key fetches** (`fetchContent`, 11 requests):

| Component | keys | | Component | keys |
|---|---|---|---|---|
| `HomeHero` | 6 | | `CreativeApproach` | 2 |
| `ServiceProvider` | 5 | | `OurClients` | 2 |
| `AboutSection` | 7 | | `LatestBlogs` | 3 |
| `WhyChooseUs` | 6 | | `ConnectWithExperts` | 1 |
| `CaseStudies` | 3 | | `Footer` *(layout)* | 5 |
| | | | `SocialIcons` *(layout)* | 5 |

**List-data fetches** (7 requests, separate endpoints):

| Component | call | endpoint |
|---|---|---|
| `OurClients` | `fetchClients()` | `/api/clients` |
| `CaseStudies` | `fetchCaseStudies()` | `/api/case-studies` |
| `LatestBlogs` | `fetchLatestBlogs(3)` | `/api/blogs` |
| `Testimonials` | `useAsyncData(fetchTestimonials)` | `/api/testimonials` |
| `Faq` | `getFaqs()` | `/api/faqs` |
| `Footer` *(layout)* | `fetchFooterLinks()` | `/api/footer-links` |
| `Footer` *(layout)* | raw `fetch()` | `/api/products/categories` |

Consequences: no API-driven content is server-rendered (crawlers and the initial paint see the
hardcoded `DEFAULTS`), headings and lists visibly pop in after the JS bundle lands, and 18
round-trips are spent on data the server could have had ready.

The backend endpoint `GET /api/content?keys=a,b,c` already accepts **up to 100 keys per
request** (`MAX_KEYS` in `acousticsfx-backend/src/controllers/contentController.ts`).
`lib/api/client.ts` already applies `next: { revalidate: 120 }` to server-side GETs. Neither
capability is currently used.

**Key budget:** Home needs 35 content keys + 10 from layout = **45**. About needs 19 + 10 =
**29**. Both fit in a single request with room to spare, including for workstream D.

### Fonts

`app/layout.tsx` loads **10 families**: Geist, Geist Mono, Poppins, Playfair Display, Work
Sans, Inter, Plus Jakarta Sans, Manrope, Lato — plus local **Axiforma at 9 weights × 2 formats
(18 files, 860 KB)** declared in `app/globals.css`.

Measured usage of the utility classes:

| class | uses | | class | uses |
|---|---|---|---|---|
| `inter-font` | 91 | | `lato` | 15 |
| `axiforma` | 33 | | `playfair-display` | 11 |
| `worksans-font` | 28 | | `jakarta` | 2 |
| `poppins-font` | 26 | | `geist-font` | 1 |
| `manrope` | 18 | | | |

Measured font-weight usage across the entire app:

| weight | uses |
|---|---|
| `font-medium` (500) | 80 |
| `font-bold` (700) | 72 |
| `font-semibold` (600) | 44 |
| `font-normal` (400) | 32 |
| `font-light` (300) | 4 |

**`font-thin` (100), `font-extralight` (200), `font-extrabold` (800), and `font-black` (900)
are never used anywhere.** Axiforma specifically is only ever paired with `font-bold` (24×),
`font-medium` (4×), and `font-normal` (2×).

**Known bug:** `components/home/AboutSection.tsx:75` uses a class `work-sans` that is not
defined in `globals.css` (the real class is `worksans-font`). That text currently renders in
the browser default font.

---

## Design

### Part C — Server-side data loading

All GETs move to the page/layout boundary, where they run in parallel on the server, are cached
by ISR, and are server-rendered into the HTML.

```
app/page.tsx (server, async)
  ├─ getPageContent(HOME_KEYS)   ← ONE batched GET for all 35 content keys
  ├─ fetchClients()              ┐
  ├─ fetchCaseStudies()          │ separate endpoints, but issued in parallel
  ├─ fetchLatestBlogs(3)         │ on the server with revalidate: 120
  ├─ fetchTestimonials()         │
  └─ getFaqs()                   ┘
       └─ results passed down as props
            ├─ server sections → render directly, zero client JS
            └─ client sections → receive data as props, no useEffect
```

**Honest framing:** the 11 content-key requests collapse into **1** because they hit the same
endpoint. The 7 list-data requests stay 7 distinct calls — different endpoints can't be merged
without a backend change, which is out of scope. The win is that all 18 move off the browser's
critical path onto the server, where they are parallel, ISR-cached across visitors, and
rendered into the initial HTML.

#### C1. New module `lib/page-content.ts`

```ts
export async function getPageContent(keys: string[]): Promise<ContentMap>
export function val(content: ContentMap, key: string, defaults: Record<string, string>): string
```

- `getPageContent` wraps the existing `api.get`, inheriting the ISR path already present in
  `lib/api/client.ts`.
- **On failure it returns `{}` rather than throwing.** Every component already carries a
  `DEFAULTS` map, so a dead API degrades to today's hardcoded copy rather than a blank page.
  This is what makes an `async` root layout safe.
- `val()` is currently duplicated verbatim in 18 files; it moves here and is imported.
- List-data fetches are wrapped the same way — each resolves to its existing `FALLBACK_*`
  constant on failure, preserving today's behaviour.

#### C2. Key registries stay colocated

Each component continues to export its own `CONTENT_KEYS` and `DEFAULTS`. The page imports and
concatenates them. No magic key strings in page files, and workstream D extends a component's
list without touching the page.

#### C3. Components converted to server components

These 11 are `"use client"` **only** because of data fetching — no other state, no event
handlers, no browser APIs. They drop `"use client"`, `useState`, and `useEffect`, and take
their data as props:

| Component | receives |
|---|---|
| `components/home/AboutSection.tsx` | `content` |
| `components/home/OurClients.tsx` | `content`, `clients` |
| `components/home/Footer.tsx` | `content`, `footerLinks`, `categories` |
| `components/shared/SocialIcons.tsx` | `content` |
| `components/about/AboutContent.tsx` | `content` |
| `components/about/AboutHero.tsx` | `content` |
| `components/about/FoundationSection.tsx` | `content` |
| `components/about/FounderSection.tsx` | `content` |
| `components/contact/TrustedBySection.tsx` | `content`, `trustedPartners` |
| `components/contact/ContactHero.tsx` | `content` |
| `components/contact/LocationsSection.tsx` | `content`, `locations` |

They may still render client children (`FadeIn`, `SlideIn`) — a server component rendering a
client component is fine.

#### C4. Components that stay client, but take props

These have genuine client-side reasons. They keep `"use client"` but lose their fetching:

| Component | client reason | receives |
|---|---|---|
| `HomeHero` | Swiper | `content` |
| `ServiceProvider` | gsap | `content` |
| `WhyChooseUs` | Swiper | `content` |
| `CaseStudies` | Splide | `content`, `caseStudies` |
| `CreativeApproach` | framer-motion, `onClick` | `content` |
| `LatestBlogs` | framer-motion, `onClick` | `content`, `blogs` |
| `Testimonials` | Swiper, `useRef` | `testimonials` |
| `Faq` | accordion `onClick` | `faqs` |
| `ConnectWithExperts` | form `onClick` | `content` |
| `StoryInnovation` | video modal `onClick` | `content` |

`ConnectWithExperts` keeps its **POST** calls (`subscribeNewsletter`, `submitContactForm`) —
those are user-triggered and correctly client-side. Only its GET moves.

`Testimonials` stops using the `useAsyncData` hook. The hook itself stays — it is still used by
`components/resources/FeaturedWithAllPosts.tsx`.

#### C5. Layout

`app/layout.tsx` becomes `async` and fetches the Footer/SocialIcons content keys plus footer
links and product categories once, passing them down. These run in parallel with the page
fetches, so they add no serial latency. Safety rests on C1's error handling.

#### C6. Pages updated

`app/page.tsx` and `app/about/page.tsx` become `async`, issue their fetches in parallel via
`Promise.all`, and thread results into each section. The existing `dynamic()` imports for
below-the-fold sections in `app/page.tsx` are retained — `next/dynamic` still server-renders in
the App Router, so props pass through normally.

**Contact page:** `app/contactus` shares `TrustedBySection`, `ContactHero`, and
`LocationsSection`, all of which change signature here. It is updated mechanically in the same
change to keep it working. No other contact-page work.

### Part A — Fonts 10 → 3

**Keep:** Axiforma (local, brand), Inter, Playfair Display.
**Remove:** Geist, Geist Mono, Poppins, Work Sans, Plus Jakarta Sans, Manrope, Lato.

#### A1. Axiforma subset

From 9 weights × 2 formats (18 files, 860 KB) down to **4 weights, woff2 only**: 400, 500, 600,
700. Dropping Thin (100), Light (300), ExtraBold (800), Black (900) — none are used by any
weight utility in the codebase. `.woff` fallbacks are dropped; `.woff2` has universal support in
every browser this site targets.

Expected: **860 KB → ~160 KB**.

Weight 600 is retained even though no Axiforma line currently pairs with `font-semibold`,
because `font-semibold` is used 44× app-wide and may be inherited onto Axiforma elements.

#### A2. Remap rule

Mapped by role, not blanket search-and-replace:

| Removed | → | Rationale |
|---|---|---|
| Work Sans, Poppins, Manrope, Lato *(body/UI text)* | **Inter** | Already the dominant body face (91 uses) |
| Work Sans, Poppins, Manrope *(headings)* | **Axiforma** | Brand face; already carries 33 heading uses |
| Plus Jakarta (2), Geist (1) | **Inter** | Effectively dead |
| `work-sans` *(undefined class, `AboutSection.tsx:75`)* | **Inter** | Fixes the silent fallback bug |

Playfair Display stays exactly where it is (11 uses), unchanged.

#### A3. Visual review is part of the work, not a follow-up

Poppins→Axiforma on headings is a real visual change — different letterforms and optical
weight. After the remap, screenshot Home and About at mobile and desktop widths, review, and
adjust any section that reads badly. This spec is not complete until that pass is done and its
findings reported.

#### A4. Cleanup

- Delete the 7 unused font imports and their `variable` entries from `app/layout.tsx`.
- Delete the corresponding `.poppins-font`, `.worksans-font`, `.geist-font`, `.jakarta`,
  `.manrope`, `.lato` utility classes from `app/globals.css`.
- Delete the 14 unused Axiforma files from `public/fonts/`.
- `--font-sans` in the `@theme inline` block currently points at `--font-worksans`; repoint to
  `--font-inter`.

---

## Verification

1. **Baseline before any change:** Lighthouse (mobile + desktop) on Home and About; record LCP,
   TBT, page weight, request count. Save results alongside this spec.
2. **Client API requests on Home: 18 → 0.** Verified in the devtools Network tab, filtered to
   the API origin, after hydration completes.
3. **Content is server-rendered:** `curl` the Home and About HTML and confirm CMS copy (e.g.
   the `home.about.heading` value) and list data (e.g. a testimonial author) appear in the raw
   response, not only after hydration.
4. **API-failure degradation:** with the backend stopped, Home, About, and Contact still render
   fully using `DEFAULTS` and `FALLBACK_*`. No blank sections, no error boundary.
5. **Font audit:** exactly 3 families in the network waterfall; no request for Poppins, Work
   Sans, Manrope, Lato, Jakarta, or Geist. `public/fonts` contains 4 files.
6. **Visual pass:** Home, About, and Contact screenshotted at 375px and 1440px, reviewed against
   pre-change screenshots, differences reported.
7. **Build and lint clean:** `npm run build` and `npm run lint`.

## Risks

| Risk | Mitigation |
|---|---|
| `async` root layout makes an API failure site-wide | `getPageContent` and list wrappers return fallbacks on error; verification step 4 proves it |
| Heading font swap looks wrong in some sections | A3 makes the visual pass part of the work, not optional |
| A component converted to a server component has a client dependency missed in the audit | Build fails loudly; the 11 were selected by confirming they contain only `useState`/`useEffect` for fetching |
| `TrustedBySection`, `ContactHero`, `LocationsSection` are shared with Contact | Contact page updated mechanically in the same change (C6) |
| ISR `revalidate: 120` means CMS edits take up to 2 min to appear | Matches the existing configured behaviour for server GETs; call out to the client, revisit if unacceptable |

## Explicitly not in this spec

- **B** — image conversion to WebP and source resizing (164 MB in `public/assets`, worst file
  27 MB)
- **D** — remaining dynamic content for Home and About (`VoicePlug`, `OurProduct`, `Faq` copy,
  `Testimonials` copy, `Header`, `StatsSection`, `ValuesSection`, `ApplicationsSection`)
- **E** — section density (`py-[100px]` ×13, `h-screen` ×5, `min-h-[88svh]` ×3) and the mobile
  pass
- Merging distinct backend endpoints into one aggregate route (would require backend work)
