import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ProductHero from "@/components/products/ProductHero";
import AwardsSection from "@/components/products/AwardsSection";
import AcousticSolutions from "@/components/products/AcousticSolutions";
import AcousticWhyChooseUs from "@/components/products/AcousticWhyChooseUs";
import StoryInnovation from "@/components/about/StoryInnovation";
import TrustedBySection from "@/components/contact/TrustedBySection";
import LatestBlogs from "@/components/home/LatestBlogs";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import SchemaMarkup from "@/components/SchemaMarkup";
import { fetchCategoryBySlug } from "@/lib/products-api";
import { SITE_URL } from "@/lib/site-url";
import {
  SEO_KEYWORDS_ACOUSTIC_CATEGORY,
  SEO_LOCATION_KEYWORDS_INDIA,
  SEO_RELATED_KEYWORDS,
} from "@/lib/seo-keywords";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  if (category === "acoustic") {
    return {
      title:
        "Acoustic Panels Manufacturer India | NRC Certified Solutions | FX Acoustics",
      description:
        "FX Acoustics manufactures NRC-rated acoustic panels and systems for offices, studios, and auditoriums across India—wood, fabric, baffles, clouds, and turnkey acoustic treatment.",
      keywords: SEO_KEYWORDS_ACOUSTIC_CATEGORY,
      alternates: {
        canonical: `${SITE_URL}/products/acoustic`,
      },
    };
  }

  try {
    const { category: cat } = await fetchCategoryBySlug(category);
    const description =
      cat.metaDescription ??
      cat.description ??
      `Browse our complete range of ${cat.name.toLowerCase()} — products for every space.`;

    return {
      title: cat.metaTitle || cat.name,
      description: description.slice(0, 160),
      keywords: [
        `${cat.name} India`,
        `${cat.name} acoustic`,
        "FX Acoustics products",
        ...SEO_RELATED_KEYWORDS.slice(0, 14),
        ...SEO_LOCATION_KEYWORDS_INDIA.slice(0, 12),
      ],
      alternates: {
        canonical: `${SITE_URL}/products/${cat.slug}`,
      },
    };
  } catch {
    return {
      title: category,
      description: "",
      keywords: [
        `${category} acoustic India`,
        "FX Acoustics",
        ...SEO_RELATED_KEYWORDS.slice(0, 10),
        ...SEO_LOCATION_KEYWORDS_INDIA.slice(0, 8),
      ],
      alternates: {
        canonical: `${SITE_URL}/products/${category}`,
      },
    };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  let data: Awaited<ReturnType<typeof fetchCategoryBySlug>>;
  try {
    data = await fetchCategoryBySlug(category);
  } catch {
    notFound();
  }

  if (data.category.slug !== category) {
    permanentRedirect(`/products/${data.category.slug}`);
  }

  const acousticServiceSchema =
    data.category.slug === "acoustic"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Acoustic panels manufacturing & acoustic treatment",
          description:
            "Design, manufacturing, and installation of premium acoustic panels and sound-control systems for commercial and institutional spaces in India.",
          provider: {
            "@type": "Organization",
            name: "FX Acoustics",
            url: SITE_URL,
          },
          areaServed: "IN",
          serviceType: [
            "Acoustic panels",
            "Sound absorption systems",
            "Acoustic ceilings and baffles",
          ],
        }
      : null;

  return (
    <>
      {acousticServiceSchema ? (
        <SchemaMarkup schema={acousticServiceSchema} />
      ) : null}
      <ProductHero
        breadcrumbItems={[
          { name: "Home", href: "/" },
          { name: "Our Products", href: "/products" },
          {
            name: data.category.name,
            href: `/products/${data.category.slug}`,
          },
        ]}
        heroImage={data.category.heroImage}
        heroHeading={data.category.heroHeading}
        heroDescription={data.category.heroDescription}
      />
      <AwardsSection />
      <AcousticSolutions categorySlug={data.category.slug} showMasterCategoryTabs={false} />
      <StoryInnovation />
      <AcousticWhyChooseUs />
      <TrustedBySection />
      <LatestBlogs />
      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
