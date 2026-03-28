import SocialIcons from "@/components/shared/SocialIcons";
import TrademarkTitle from "@/components/shared/TrademarkTitle";

interface LinearluxHeroProps {
  title: string;
  showTrademark?: boolean;
  description: string;
}

export default function LinearluxHero({
  title,
  showTrademark,
  description,
}: LinearluxHeroProps) {
  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden bg-[#1b1b1b] text-white">
      {/* Background vertical panels */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#151515] border-r border-black/40"
          />
        ))}
      </div>

      <div className="relative z-10 h-full px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[40px] sm:py-[60px] lg:py-[80px] flex">
        <SocialIcons
          direction="vertical"
          variant="plain"
          className="hidden sm:flex flex-col gap-6 mt-24 mr-10"
          iconClassName="text-[#f59e0b] text-base"
        />

        <div className="flex flex-col justify-center max-w-2xl">
          <p className="text-sm text-gray-300 mb-6">
            Our Products &nbsp;•&nbsp;{" "}
            <span className="text-[#f59e0b]">
              <TrademarkTitle title={title} showTrademark={showTrademark} />
            </span>
          </p>

          <h1 className="text-[42px] sm:text-[64px] lg:text-[94px] playfair-display font-serif mb-6">
            <TrademarkTitle title={title} showTrademark={showTrademark} />
          </h1>

          <p className="product-body-text inter-font font-[400] text-gray-300">{description}</p>
        </div>
      </div>
    </section>
  );
}
