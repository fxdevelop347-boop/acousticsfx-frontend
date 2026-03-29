import {
  CategoryProductsProvider,
  TabbedProductsMaybeSection,
} from "@/components/products/category-products-explorer";
import { ProductListingCard } from "@/components/products/ProductListingCard";
import { fetchCategoryBySlug, fetchProducts, type Product } from "@/lib/products-api";

interface AcousticSolutionsProps {
  /** Master category slug (e.g. acoustic, flooring). From route /products/[category] or first category on /products. */
  categorySlug: string;
  /** Show master category tabs only on /products landing; hide on /products/[category]. */
  showMasterCategoryTabs?: boolean;
}

export default async function AcousticSolutions({
  categorySlug,
  showMasterCategoryTabs = false,
}: AcousticSolutionsProps) {
  if (showMasterCategoryTabs) {
    return (
      <CategoryProductsProvider initialCategorySlug={categorySlug}>
        <TabbedProductsMaybeSection />
      </CategoryProductsProvider>
    );
  }

  let cards: Array<{
    slug: string;
    title: string;
    description: string;
    image: string;
    showTrademark?: boolean;
    specs?: Product["specs"];
  }> = [];
  let categoryName = "Solutions";

  try {
    const categoryRes = await fetchCategoryBySlug(categorySlug).catch(() => null);
    if (categoryRes?.category) {
      categoryName = categoryRes.category.name;
      const products = categoryRes.products ?? [];
      if (products.length > 0) {
        cards = products.map((p: Product) => ({
          slug: p.slug,
          title: p.title,
          description: p.shortDescription || p.description,
          image: p.image,
          showTrademark: p.showTrademark === true,
          specs: p.specs,
        }));
      }
    } else {
      const { products } = await fetchProducts(categorySlug).catch(() => ({ products: [] as Product[] }));
      if (products.length > 0) {
        cards = products.map((p: Product) => ({
          slug: p.slug,
          title: p.title,
          description: p.shortDescription || p.description,
          image: p.image,
          showTrademark: p.showTrademark === true,
          specs: p.specs,
        }));
      }
    }
  } catch {
    cards = [];
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#F4F5F4]">
      <div className="px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14 lg:px-[100px] lg:py-[88px]">
        <div className="mx-auto mb-8 max-w-4xl sm:mb-10 lg:mb-12">
          <p className="mb-2 text-[15px] font-medium text-[#1F6775] manrope sm:text-[17px]">
            {categoryName}
          </p>
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-neutral-900 manrope sm:text-[34px] lg:text-[40px]">
            Explore Our {categoryName} <br /> Masterpieces
          </h2>
        </div>

        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {cards.map((card) => (
            <div key={card.slug} className="min-w-0">
              <ProductListingCard
                href={`/products/${categorySlug}/${card.slug}`}
                title={card.title}
                description={card.description}
                image={card.image}
                showTrademark={card.showTrademark}
                specs={card.specs}
                className="h-full"
                variant="grid"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
