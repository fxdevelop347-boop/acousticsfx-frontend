import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideIn } from "@/components/animations";

type CaseStudyProps = {
  reverse?: boolean;
  image: string;
  bgColor?: "white" | "light-blue";
};

export default function CaseStudySection({
  reverse = false,
  image,
  bgColor = "white"
}: CaseStudyProps) {
  const bgClass = bgColor === "light-blue" ? "bg-[#F4F6FF]" : "bg-white";

  return (
    <section className={`w-full py-16 sm:py-20 lg:py-24 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER CONTENT */}
        <FadeIn direction="up" className="max-w-3xl mb-10 sm:mb-12">
          <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] axiforma font-bold mb-4 text-gray-900">
            Acoustic Transformations in Action
          </h2>

          <p className="text-[18px] sm:text-[19px] lg:text-[20px] inter-font font-[400] text-gray-600 mb-4 leading-relaxed">
            Real-world projects showcasing the impact of precision acoustic design.
          </p>

          <p className="text-[15px] sm:text-[16px] inter-font font-[400] text-gray-500 mb-6 leading-relaxed">
            Explore how FX Acoustics solutions have transformed commercial offices,
            auditoriums, hospitality spaces, and educational institutions — delivering
            measurable improvements in sound clarity, noise reduction, and aesthetic appeal.
          </p>

          <Link
            href="/resources/casestudy"
            className="inline-flex items-center gap-2 border border-gray-300 px-5 py-2 text-sm rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            Get the Full Rundown →
          </Link>
        </FadeIn>

        {/* CARD */}
        <div
          className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            } gap-8 lg:gap-10 items-center bg-[#F4F6FF] rounded-2xl p-6 sm:p-8`}
        >
          {/* IMAGE */}
          <SlideIn direction={reverse ? "right" : "left"} className="w-full lg:w-1/2">
            <div className="relative w-full h-[220px] sm:h-[260px] rounded-xl overflow-hidden">
              <Image
                src={image}
                alt="Case Study"
                fill
                className="object-cover"
              />
            </div>
          </SlideIn>

          {/* CONTENT */}
          <FadeIn direction="up" className="w-full lg:w-1/2">
            <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] axiforma font-bold mb-3 text-gray-900">
              Corporate Office Acoustic Retrofit
            </h3>

            <p className="text-[16px] sm:text-[17px] lg:text-[18px] inter-font font-[400] text-gray-600 mb-6 leading-relaxed">
              A complete acoustic overhaul of a 50,000 sq ft corporate headquarters,
              using our wood acoustic panels and baffles to reduce reverberation
              time by 60% while maintaining a modern, elegant aesthetic.
            </p>

            <Link
              href="/resources/casestudy"
              className="text-blue-600 font-medium text-sm hover:underline cursor-pointer"
            >
              Explore Case Study →
            </Link>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
