import Image from "@/components/shared/SmartImage";
import { FadeIn } from "@/components/animations";

export default function AwardsSection() {

  const awards = [
    {
      img: "/assets/product/german-design-award.svg",
      title: "German Design Award",
      year: "2021",
    },
    {
      img: "/assets/product/a-design-award.svg",
      title: "Gold A’ Design Award",
      year: "2021",
    },
    {
      img: "/assets/product/if-design-award.svg",
      title: "IF Design Award",
      year: "2020",
    },
    {
      img: "/assets/product/good-design-award.svg",
      title: "Good Design Award",
      year: "2019",
    },
  ];

  return (
    <section className="w-full bg-[#1F6775] overflow-hidden">

      <div className="px-[20px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[10px] sm:py-[14px] lg:py-[20px]">

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">

          {/* Left Vertical Text */}
          <FadeIn direction="up" className="flex items-center">

            <span className="rotate-0 lg:rotate-[-90deg] text-white/60 tracking-widest text-[11px] sm:text-xs">
              Awards
            </span>

          </FadeIn>

          {/* MOVIE STYLE SCROLL */}
          <div className="w-full overflow-hidden">

            <div className="awards-scroll-track">

              {[...awards, ...awards].map((award, i) => (

                <div key={i} className="flex items-center gap-2 awards-item">

                  <Image
                    src={award.img}
                    alt="Award"
                    width={70}
                    height={40}
                    className="object-contain"
                  />

                  <div className="text-white leading-tight">

                    <p className="font-[400] inter-font text-[12px] sm:text-[14px] lg:text-[16px]">
                      {award.title}
                    </p>

                    <p className="font-[400] inter-font text-[11px] sm:text-[13px] lg:text-[16px]">
                      {award.year}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}