import Image from "next/image";
import Link from "next/link";
import { fetchMergedProduct } from "@/lib/products-data";

interface OurAcousticPanelsProps {
  productSlug?: string;
  /** Master category slug for links (e.g. acoustic). */
  categorySlug?: string;
}

const FALLBACK_PANELS = [
  { title: "Linerlux", desc: "Grooved Acoustical Panels", img: "/assets/panels/linerlux.png", slug: "linearlux" },
  { title: "Acoperf", desc: "Perforated Acoustical Panels", img: "/assets/panels/acoperf.png", slug: "acoperf" },
  { title: "Microatlas", desc: "Micro Perforated Acoustical Panels", img: "/assets/panels/microatlas.png", slug: "microatlas" },
  { title: "Acoslots", desc: "Slotted Acoustical Panels", img: "/assets/panels/acoslots.png", slug: "acoslots" },
  { title: "Perfomax", desc: "Max Perforated Acoustical Panels", img: "/assets/panels/perfomax.png", slug: "perfomax" },
];

export default async function OurAcousticPanels({ productSlug, categorySlug = "acoustic" }: OurAcousticPanelsProps = {}) {
  let panels: Array<{ title: string; desc: string; img: string; slug?: string }> = [];
  let panelsTitle = "OUR ACOUSTIC PANELS";
  let panelsDescription =
    "A premium workspace faced disruptive noise and poor sound clarity. We designed and installed bespoke acoustic panels tailored to their architecture. The result: enhanced productivity, elegant aesthetics, and a healthier environment. Proof that purposeful design delivers measurable impact.";

  if (productSlug) {
    const product = await fetchMergedProduct(productSlug);
    if (product && product.subProducts.length > 0) {
      panels = product.subProducts.map((sub) => ({
        title: sub.title,
        desc: sub.description,
        img: sub.image,
        slug: sub.slug,
      }));
    }
    if (product?.panelsSectionTitle) panelsTitle = product.panelsSectionTitle;
    if (product?.panelsSectionDescription) panelsDescription = product.panelsSectionDescription;
  }

  if (panels.length === 0) {
    panels = FALLBACK_PANELS;
  }

  return (
    <section className="w-full bg-[#fefdfc] py-[60px] sm:py-[80px] lg:py-[100px]">
      <div className="mx-auto px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px]">

        {/* HEADER */}
        <div className="text-center max-w-5xl mx-auto mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-[32px] sm:text-[42px] lg:text-[55px] axiforma font-[500] tracking-wide mb-4">
            {panelsTitle}
          </h2>
          <p className="text-gray-600 text-[16px] sm:text-[18px] lg:text-[20px] jakarta font-[500] leading-[26px] sm:leading-[28px] lg:leading-[30px]">
            {panelsDescription}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {panels.map((item, index) => {
            const CardContent = (
              <div className="bg-white border border-[#eee] rounded-md overflow-hidden relative group">
                {/* IMAGE */}
                <div className="relative w-full h-[180px] sm:h-[200px] lg:h-[220px]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] axiforma font-bold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[16px] sm:text-[17px] lg:text-[18px] inter-font font-[400] text-gray-500">
                    {item.desc}
                  </p>
                </div>

                {/* ARROW BUTTON */}
                <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full border border-[#f28c28] 
flex items-center justify-center
transition-all duration-300 ease-in-out
transform rotate-[-45deg] 
group-hover:rotate-0">
                  <Image
                    src="/assets/home/universalvector.svg"
                    alt="Arrow"
                    width={20}
                    height={8}
                    className="text-[#f28c28]"
                    style={{ filter: "brightness(0) saturate(100%) invert(56%) sepia(88%) saturate(2171%) hue-rotate(7deg)" }}
                  />
                </div>
              </div>
            );

            // Wrap in Link if productSlug, categorySlug and slug are available
            if (productSlug && categorySlug && item.slug) {
              return (
                <Link
                  key={index}
                  href={`/products/${categorySlug}/${productSlug}/${item.slug}`}
                  className="block"
                >
                  {CardContent}
                </Link>
              );
            }

            // For static fallback, wrap in div
            return <div key={index}>{CardContent}</div>;
          })}
        </div>

      </div>
    </section>
  );
}
