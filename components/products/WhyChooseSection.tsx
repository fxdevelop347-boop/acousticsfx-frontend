import Image from "@/components/shared/SmartImage";
import TrademarkTitle from "@/components/shared/TrademarkTitle";

interface WhyChooseSectionProps {
  title: string;
  showTrademark?: boolean;
  description: string;
}

export default function WhyChooseSection({
  title,
  showTrademark,
  description,
}: WhyChooseSectionProps) {
  return (
    <section className="w-full bg-white py-[60px] sm:py-[80px] lg:py-[100px]">
      <div className="mx-auto px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          
          {/* LEFT IMAGE */}
          <div className="col-span-1 lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative w-[300px] sm:w-[420px] lg:w-[550px] h-[380px] sm:h-[540px] lg:h-[700px] rounded-xl overflow-hidden">
              <Image
                src="/assets/product/why-choose-1.jpg"
                alt={`Why Choose ${title}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-1 lg:col-span-6">
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] inter-font font-medium leading-tight mb-4">
              Why Choose{" "}
              <TrademarkTitle title={title} showTrademark={showTrademark} className="inline" />
            </h2>

            <p className="product-body-text text-gray-600 inter-font font-[400] mb-8 sm:mb-10 max-w-md">
              {description}
            </p>

            <div className="space-y-6">
              {[
                "Premium Quality Materials",
                "Expert Craftsmanship",
                "Customizable Solutions",
                "Sustainable Design",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#EA8E39] flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <p className="text-[16px] sm:text-[17px] lg:text-[18px] inter-font font-[400] text-gray-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
