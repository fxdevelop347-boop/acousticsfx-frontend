import SocialIcons from "@/components/shared/SocialIcons";
import TrademarkTitle from "@/components/shared/TrademarkTitle";

interface LinearluxHeroProps {
  title: string;
  showTrademark?: boolean;
  description: string;
  heroImage?: string;
}

export default function LinearluxHero({
  title,
  showTrademark,
  description,
  heroImage,
}: LinearluxHeroProps) {
  return (
    <section className="relative w-full min-h-[300px] h-[48vh] max-h-[540px] sm:min-h-[340px] sm:h-[52vh] sm:max-h-[580px] lg:min-h-[400px] lg:h-[min(56vh,640px)] overflow-hidden bg-[#1b1b1b] text-white">
      {heroImage?.trim() ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-black/55" />
        </>
      ) : (
        <div className="absolute inset-0 flex">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-linear-to-b from-[#2a2a2a] to-[#151515] border-r border-black/40"
            />
          ))}
        </div>
      )}

      <div className="relative z-10 h-full px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-8 sm:py-12 lg:py-14 flex">
        <SocialIcons
          direction="vertical"
          variant="plain"
          className="hidden sm:flex flex-col gap-5 mt-10 mr-8 lg:mt-16 lg:mr-10"
          iconClassName="text-[#f59e0b] text-base"
        />

        <div className="flex flex-col justify-center max-w-2xl">
          <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-6">
            Our Products &nbsp;•&nbsp;{" "}
            <span className="text-[#f59e0b]">
              <TrademarkTitle title={title} showTrademark={showTrademark} />
            </span>
          </p>

          <h1 className="text-[1.875rem] leading-[1.1] sm:text-5xl sm:leading-tight lg:text-6xl xl:text-7xl playfair-display font-serif mb-3 sm:mb-6">
            <TrademarkTitle title={title} showTrademark={showTrademark} />
          </h1>

          <p className="product-body-text inter-font font-normal text-gray-300">{description}</p>
        </div>
      </div>
    </section>
  );
}
