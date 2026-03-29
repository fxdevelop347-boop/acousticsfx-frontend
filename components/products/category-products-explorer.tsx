"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchProducts,
  type Product,
  type ProductCategory,
} from "@/lib/products-api";
import { ProductListingCard } from "@/components/products/ProductListingCard";

function normalizeCategories(list: ProductCategory[]): { slug: string; name: string }[] {
  return [...list]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({ slug: c.slug, name: c.name }));
}

type ExplorerContextValue = {
  categories: { slug: string; name: string }[];
  categoriesLoading: boolean;
  activeSlug: string;
  setActiveSlug: (slug: string) => void;
  products: Product[];
  loading: boolean;
  activeCategoryName: string;
};

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error("CategoryProductsProvider required");
  return ctx;
}

/** For client sections that need loading / empty category state (e.g. home Our Products). */
export function useCategoryProductsExplorer(): ExplorerContextValue {
  return useExplorer();
}

export function CategoryProductsProvider({
  initialCategorySlug,
  children,
}: {
  initialCategorySlug: string;
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeSlug, setActiveSlugState] = useState(initialCategorySlug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCategoriesLoading(true);
      try {
        const { categories: apiCats } = await fetchCategories();
        if (cancelled) return;
        setCategories(normalizeCategories(apiCats ?? []));
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setActiveSlugState(initialCategorySlug);
  }, [initialCategorySlug]);

  const setActiveSlug = useCallback((slug: string) => {
    setActiveSlugState(slug);
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    setActiveSlugState((prev) => {
      const exists =
        prev &&
        categories.some((c) => c.slug.toLowerCase() === prev.toLowerCase());
      if (exists) return prev;
      return categories[0].slug;
    });
  }, [categories]);

  useEffect(() => {
    if (!activeSlug) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setProducts([]);
    (async () => {
      try {
        const res = await fetchCategoryBySlug(activeSlug);
        if (cancelled) return;
        setProducts(res.products ?? []);
      } catch {
        try {
          const { products: plist } = await fetchProducts(activeSlug);
          if (cancelled) return;
          setProducts(plist ?? []);
        } catch {
          if (!cancelled) setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSlug]);

  const activeCategoryName = useMemo(() => {
    const found = categories.find((c) => c.slug === activeSlug);
    return found?.name ?? "Solutions";
  }, [categories, activeSlug]);

  const value = useMemo(
    () => ({
      categories,
      categoriesLoading,
      activeSlug,
      setActiveSlug,
      products,
      loading,
      activeCategoryName,
    }),
    [categories, categoriesLoading, activeSlug, setActiveSlug, products, loading, activeCategoryName]
  );

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}

/** `/products` tabbed block: only render when categories exist (API). */
export function TabbedProductsMaybeSection() {
  const { categories, categoriesLoading, products, loading } = useExplorer();
  if (categoriesLoading) return null;
  if (categories.length === 0) return null;
  return (
    <section className="w-full bg-white">
      <div className="px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px]">
        <CategoryTabs
          variant="center"
          className="gap-3 sm:gap-4 mb-10 sm:mb-12 lg:mb-16"
        />
        {!loading && products.length > 0 ? <CategoryExploreHeading /> : null}
        <CategoryProductCarousel layout="products" />
      </div>
    </section>
  );
}

export function CategoryTabs({
  variant = "left",
  className = "",
}: {
  variant?: "left" | "center";
  className?: string;
}) {
  const { categories, activeSlug, setActiveSlug } = useExplorer();
  if (categories.length === 0) return null;

  const align = variant === "center" ? "justify-center" : "justify-start";

  return (
    <div className={`flex flex-wrap gap-3 ${align} ${className}`}>
      {categories.map((cat) => {
        const isActive = cat.slug.toLowerCase() === activeSlug.toLowerCase();
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveSlug(cat.slug)}
            className={`px-4 py-2 text-[10px] axiforma font-bold cursor-pointer border transition-colors ${
              isActive
                ? "bg-[#1F6775] border-[#1F6775] text-white"
                : "bg-white border-gray-300 text-black hover:bg-gray-50"
            }`}
          >
            {cat.name.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export function CategoryExploreHeading() {
  const { activeCategoryName } = useExplorer();
  return (
    <div className="mb-10 sm:mb-12 lg:mb-14">
      <p className="text-[16px] sm:text-[18px] manrope font-medium text-[#1F6775] mb-2">
        {activeCategoryName}
      </p>
      <h2 className="text-[32px] sm:text-[38px] lg:text-[45px] font-semibold manrope leading-tight">
        Explore Our {activeCategoryName} <br /> Masterpieces
      </h2>
    </div>
  );
}

type CarouselLayout = "home" | "products";

export function CategoryProductCarousel({ layout = "home" }: { layout?: CarouselLayout }) {
  const { products, activeSlug, loading } = useExplorer();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const paddingClass =
    layout === "home"
      ? "pl-6 sm:pl-10 lg:pl-[200px]"
      : "pl-0 sm:pl-0 lg:pl-0";

  useEffect(() => {
    setCurrentIndex(0);
    sliderRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [activeSlug, products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const container = sliderRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const step = layout === "home" ? 600 : 520;
      if (maxScroll <= 0) return;
      if (container.scrollLeft >= maxScroll - 2) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [products.length, layout]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: layout === "home" ? -600 : -520, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: layout === "home" ? 600 : 520, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, products.length - 1));
    setCurrentIndex(clamped);
    const container = sliderRef.current;
    if (!container) return;
    const child = container.children[clamped] as HTMLElement;
    if (child) container.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      scrollToIndex(currentIndex - 1);
    } else {
      scrollLeft();
    }
  };

  const handleScrollRight = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      scrollToIndex(currentIndex + 1);
    } else {
      scrollRight();
    }
  };

  const handleScroll = () => {
    const container = sliderRef.current;
    if (!container || (typeof window !== "undefined" && window.innerWidth >= 1024)) return;
    const scrollLeftVal = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const index = Math.round(scrollLeftVal / Math.max(containerWidth, 1));
    setCurrentIndex(index);
  };

  if (!activeSlug || loading || products.length === 0) {
    return null;
  }

  const slideLgClasses =
    layout === "home"
      ? "lg:min-w-[560px] lg:max-w-[580px]"
      : "lg:min-w-[480px] lg:max-w-[520px]";

  return (
    <div className={`relative ${paddingClass}`}>
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto scroll-smooth no-scrollbar lg:snap-none snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.slug}
            className={`h-full shrink-0 snap-start min-w-[calc(100vw-48px)] sm:min-w-[calc(100vw-80px)] ${slideLgClasses}`}
          >
            <ProductListingCard
              href={`/products/${activeSlug}/${product.slug}`}
              title={product.title}
              description={product.shortDescription || product.description}
              image={product.image}
              showTrademark={product.showTrademark === true}
              specs={product.specs}
              className="h-full"
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:flex justify-center gap-8 mt-10">
        <button type="button" onClick={handleScrollLeft} className="cursor-pointer" aria-label="Previous">
          <Image
            src="/assets/home/Vector.svg"
            alt=""
            width={10}
            height={10}
            className="rotate-180"
          />
        </button>
        <button type="button" onClick={handleScrollRight} className="cursor-pointer" aria-label="Next">
          <Image src="/assets/home/Vector.svg" alt="" width={10} height={10} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4 lg:hidden">
        {products.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? "bg-[#1F6775] w-4" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
