import Image from "next/image";
import Link from "next/link";
import { fetchCaseStudies, type CaseStudy } from "@/lib/case-studies-api";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

const FALLBACK = [
  { slug: "1", image: "/assets/product/case-study-1.jpg", title: "The Power of Symmetry in Architectural Design" },
  { slug: "2", image: "/assets/product/product-card-6.png", title: "Smart Homes & AI: The Future of Residential Design" },
  { slug: "3", image: "/assets/product/product-card-1.png", title: "The Role of Texture & Materials in Architecture" },
];

export default async function CaseStudies() {
  let studies: Array<Pick<CaseStudy, "slug" | "image" | "title">>;

  try {
    const data = await fetchCaseStudies();
    studies = data.length > 0 ? data.slice(0, 3) : FALLBACK;
  } catch {
    studies = FALLBACK;
  }

  return (
    <section className="w-full bg-[#FAFAFA]">
      <div className="px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px]">

        {/* Header */}
        <FadeIn
          direction="up"
          className="flex flex-col lg:flex-row justify-between items-start mb-10 sm:mb-12 lg:mb-16 gap-6 lg:gap-0"
        >
          <div>
            <p className="text-[18px] sm:text-[21px] manrope text-[#EA8E39] font-medium mb-3">
              Case Studies
            </p>
            <h2 className="text-[32px] sm:text-[42px] lg:text-[55px] font-semibold manrope leading-snug text-gray-900">
              Exploring the Intersection of <br /> Form &amp; Function
            </h2>
          </div>

          <Link
            href="/resources/casestudy"
            className="flex items-center gap-3 text-orange-500 cursor-pointer mt-0 lg:mt-2"
          >
            <span className="text-sm">View All</span>
            <span className="w-8 h-8 border border-orange-400 rounded-full flex items-center justify-center">
              &nearr;
            </span>
          </Link>
        </FadeIn>

        {/* Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14">
          {studies.map((item) => (
            <StaggerItem key={item.slug} direction="up">
              <HoverScale>
                <div>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={400}
                    className="w-full h-[260px] sm:h-[300px] lg:h-[320px] object-cover"
                  />
                  <h3 className="mt-6 text-[22px] sm:text-[23px] lg:text-[25px] font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-[#EA8E39] text-[18px] sm:text-[20px] font-medium manrope cursor-pointer">
                    <span>Read More</span>
                    <span>&nearr;</span>
                  </div>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
