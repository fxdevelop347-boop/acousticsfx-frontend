import Image from "@/components/shared/SmartImage";
import Breadcrumb, { type BreadcrumbItem } from "@/components/Breadcrumb";

type WoodAcousticHeroProps = {
  breadcrumbItems: BreadcrumbItem[];
};

export default function WoodAcousticHero({ breadcrumbItems }: WoodAcousticHeroProps) {
  return (
    <section className="relative w-full h-[360px] sm:h-[440px] lg:h-[520px] overflow-hidden">

      {/* Background Image */}
      <Image
        src="/assets/product/product-hero.png"
        alt="Wood acoustic panels installed in a modern commercial interior"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Vector Line */}
      <Image
        src="/assets/product/vector-decoration.svg"
        alt=""
        width={420}
        height={420}
        className="absolute top-0 right-0 opacity-80 hidden sm:block"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] h-full flex items-center">
        <div className="text-white">

          {/* Breadcrumb */}
          <div className="text-sm text-white/70 mb-4 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-[#EA8E39]">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Heading */}
          <h1 className="playfair-display font-[800] text-[42px] sm:text-[64px] lg:text-[90px] leading-tight mb-6">
            Resources & Insights
          </h1>

          {/* Description */}
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] inter-font font-[300] leading-[24px] sm:leading-[26px] lg:leading-[28px] text-white max-w-[65ch]">
            Discover the latest articles, insights, and expert knowledge about acoustic solutions, architectural design, and innovative sound management technologies. Stay updated with industry trends and best practices.
          </p>

        </div>
      </div>
    </section>
  );
}
