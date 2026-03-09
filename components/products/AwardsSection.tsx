import Image from "next/image";
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
      <div className="px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[20px] sm:py-[24px] lg:py-[30px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-0">

          {/* Left Vertical Text */}
          <FadeIn direction="up" className="flex items-center">
            <span className="rotate-0 lg:rotate-[-90deg] text-white/60 tracking-widest text-sm">
              Awards
            </span>
          </FadeIn>

          {/* MOBILE CAROUSEL */}
          <div className="w-full lg:hidden overflow-hidden">
            <div className="flex gap-12 animate-award-scroll">
              {[...awards, ...awards].map((award, i) => (
                <div key={i} className="flex items-center gap-4 min-w-max">
                  <Image
                    src={award.img}
                    alt="Award"
                    width={1}
                    height={1}
                    unoptimized
                    style={{ width: "auto", height: "auto" }}
                  />
                  <div className="text-white">
                    <p className="font-[400] inter-font text-[16px]">
                      {award.title}
                    </p>
                    <p className="font-[400] inter-font text-[16px]">
                      {award.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP NORMAL LAYOUT */}
          <div className="hidden lg:flex items-center gap-16">
            {awards.map((award, i) => (
              <div key={i} className="flex items-center gap-4">
                <Image
                  src={award.img}
                  alt="Award"
                  width={1}
                  height={1}
                  unoptimized
                  style={{ width: "auto", height: "auto" }}
                />
                <div className="text-white">
                  <p className="font-[400] inter-font text-[18px]">
                    {award.title}
                  </p>
                  <p className="font-[400] inter-font text-[18px]">
                    {award.year}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}