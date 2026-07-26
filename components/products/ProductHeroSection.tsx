import Image from "@/components/shared/SmartImage";
import TrademarkTitle from "@/components/shared/TrademarkTitle";

interface ProductHeroSectionProps {
  title: string;
  showTrademark?: boolean;
  description: string;
  heroImage?: string;
  breadcrumbText?: string;
}

export default function ProductHeroSection({
  title,
  showTrademark,
  description,
  heroImage = "/assets/product/product-hero.png",
  breadcrumbText,
}: ProductHeroSectionProps) {
  return (
    <section className="relative w-full h-[360px] sm:h-[440px] lg:h-[520px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={heroImage}
        alt={`${title} Background`}
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Vector Line */}
      <Image
        src="/assets/product/vector-decoration.svg"
        alt="Decorative Line"
        width={420}
        height={420}
        className="absolute top-0 right-0 opacity-80 hidden sm:block"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] h-full flex items-center">
        <div className="text-white">
          {/* Breadcrumb */}
          <p className="text-sm text-white/70 mb-4">
            Our Products <span className="mx-2">•</span>
            <span className="text-[#EA8E39]">
              <TrademarkTitle title={breadcrumbText || title} showTrademark={showTrademark} />
            </span>
          </p>

          {/* Heading */}
          <h1 className="playfair-display font-[800] text-[42px] sm:text-[64px] lg:text-[90px] leading-tight mb-6">
            <TrademarkTitle title={title} showTrademark={showTrademark} />
          </h1>

          {/* Description */}
          <p className="product-body-text inter-font font-[300] text-white max-w-[65ch]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
