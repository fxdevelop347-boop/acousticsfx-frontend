import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

export default function OurPromise() {
  return (
    <section className="w-full bg-white">
      <div className="px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px]">
        {/* Heading */}
        <FadeIn direction="up" className="max-w-2xl mb-12 sm:mb-16 lg:mb-20">
          <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-[#EA8E39] mb-4 inter-font font-[600]">
            Our Promise
          </p>

          <h2 className="text-[32px] sm:text-[40px] lg:text-[50px] inter-font font-[600] text-[#EA8E39] leading-snug mb-6">
            We Serve Quality and <br /> Premium
          </h2>

          <p className="text-[16px] sm:text-[18px] lg:text-[20px] inter-font font-[400] text-gray-400 leading-relaxed">
            Businesses on FXAcoustic Solution that make over $50,000 per month
            qualify for account management services.
          </p>
        </FadeIn>

        {/* Features */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16">
          {/* Item 1 */}
          <StaggerItem>
            <HoverScale>
              <div>
                <div className="w-12 h-12 mb-6 relative">
                  <Image
                    src="/assets/product/icon-1.svg"
                    alt="Growth"
                    width={81}
                    height={81}
                  />
                </div>
                <h4 className="text-[15px] inter-font font-semibold mb-3">
                  Growth
                </h4>
                <p className="text-[15px] inter-font text-gray-400 leading-relaxed">
                  At FX Acoustic, Account Managers focus on boosting your growth.
                </p>
              </div>
            </HoverScale>
          </StaggerItem>

          {/* Item 2 */}
          <StaggerItem>
            <HoverScale>
              <div>
                <div className="w-12 h-12 mb-6 relative">
                  <Image
                    src="/assets/product/icon-default.svg"
                    alt="Dedicated support contact"
                    width={81}
                    height={81}
                  />
                </div>
                <h4 className="text-[15px] inter-font font-semibold mb-3">
                  Dedicated support contact
                </h4>
                <p className="text-[15px] inter-font text-gray-400 leading-relaxed">
                  Account Managers are available 24/7 via call, email, or text.
                </p>
              </div>
            </HoverScale>
          </StaggerItem>

          {/* Item 3 */}
          <StaggerItem>
            <HoverScale>
              <div>
                <div className="w-12 h-12 mb-6 relative">
                  <Image
                    src="/assets/product/icon-2.svg"
                    alt="Exposure"
                    width={81}
                    height={81}
                  />
                </div>
                <h4 className="text-[15px] inter-font font-semibold mb-3">
                  Exposure
                </h4>
                <p className="text-[15px] inter-font text-gray-400 leading-relaxed">
                  Our Account Managers enhance your exposure on social platforms.
                </p>
              </div>
            </HoverScale>
          </StaggerItem>

          {/* Item 4 */}
          <StaggerItem>
            <HoverScale>
              <div>
                <div className="w-12 h-12 mb-6 relative">
                  <Image
                    src="/assets/product/icon-3.svg"
                    alt="Services & reporting"
                    width={81}
                    height={81}
                  />
                </div>
                <h4 className="text-[15px] inter-font font-semibold mb-3">
                  Services & reporting
                </h4>
                <p className="text-[15px] inter-font text-gray-400 leading-relaxed">
                  Regular reports to track insights and progress.
                </p>
              </div>
            </HoverScale>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
