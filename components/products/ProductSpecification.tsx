import type { SubProductSpec } from "@/lib/products-api";

const DEFAULT_SPEC_DESCRIPTION =
  "High-end, high-efficiency acoustic lining system with a range of design and performance options. When fitted in plank form, this product creates an exquisite grooved look with perfect jointing. Linearlux may be used as a decorative lining or anywhere acoustic control is required because it has exceptional acoustics of its own.";

const DEFAULT_SPECS: SubProductSpec[] = [
  { label: "Product", value: "A well-rounded product with great sound. That's Perfo." },
  { label: "Category", value: "Available as panels." },
  { label: "Fire Rating", value: "A2, B1 or B2." },
  { label: "Sound absorption", value: "25%, 30%, 35%, 45%, 50%, 65%, 70%, 75%, 80%, 85% or 95%" },
  { label: "Substrate", value: "Ceiling wall, partition wall and doubling" },
  { label: "Standard Panel Size", value: "25%, 30%, 35%, 45%, 50%, 65%, 70%, 75%, 80%, 85% or 95%" },
];

interface ProductSpecificationProps {
  specDescription?: string | null;
  specs?: SubProductSpec[] | null;
}

export default function ProductSpecification({ specDescription, specs }: ProductSpecificationProps = {}) {
  const description = specDescription ?? DEFAULT_SPEC_DESCRIPTION;
  const specList = (specs && specs.length > 0) ? specs : DEFAULT_SPECS;

  return (
    <section className="w-full bg-[#faf7f2] px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] text-[#1c1c1c]">
      <h2 className="text-[26px] sm:text-[28px] lg:text-[32px] inter-font font-medium mb-4">
        Product Specification
      </h2>
      <p className="max-w-3xl text-[14px] sm:text-[15px] lg:text-[16px] poppins-font font-[400] leading-relaxed text-gray-600 mb-8 sm:mb-10">
        {description}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-8 lg:gap-y-10">
        {specList.map((item, i) => (
          <div key={i} className="border-t border-gray-300 pt-6">
            <p className="text-[18px] sm:text-[19px] lg:text-[20px] inter-font font-medium mb-2">
              {item.label}
            </p>
            <p className="text-[18px] sm:text-[19px] lg:text-[20px] inter-font font-medium text-gray-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
