import Image from "next/image";
import SocialIcons from "@/components/shared/SocialIcons";
import { FadeIn } from "@/components/animations";

export default function ProductHero() {
  return (
    <section className="w-full bg-white">
      {/* Breadcrumb */}
      <FadeIn direction="up" className="px-[24px] sm:px-[40px] md:px-[80px] lg:px-[200px] pt-[24px] sm:pt-[32px] lg:pt-[40px] text-sm text-gray-500">
        <span className="hover:text-black cursor-pointer">Home</span>
        <span className="mx-2">•</span>
        <span className="text-orange-500">Our Products</span>
      </FadeIn>

      {/* Main Content */}
      <FadeIn direction="up" delay={0.1} className="relative px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] text-center">
        {/* Social Icons */}
        <SocialIcons
          direction="vertical"
          variant="plain"
          className="hidden sm:flex absolute left-[16px] sm:left-[32px] lg:left-[60px] top-1/2 -translate-y-1/2 flex-col gap-4"
          iconClassName="text-orange-500 text-base"
        />

        {/* Heading */}
        <h1 className="text-[36px] sm:text-[56px] lg:text-[86px] font-[500] playfair-display text-gray-800">
          Where <span className="italic font-light">design</span> meets emotion
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-gray-500 inter-font font-[400] text-[16px] sm:text-[20px] lg:text-[26px] leading-relaxed">
          We design spaces that unite function and beauty, creating interiors and
          architecture that bring your lifestyle and vision to life.
        </p>
      </FadeIn>

      {/* Image */}
      <FadeIn direction="up" delay={0.2} className="px-[0px] pb-[0px]">
        <Image
          src="/assets/product/product-hero-alt.jpg"
          alt="Interior Design"
          width={1920}
          height={900}
          className="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
        />
      </FadeIn>
    </section>
  );
}
