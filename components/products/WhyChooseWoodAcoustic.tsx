import Image from "@/components/shared/SmartImage";

export default function WhyChooseWoodAcoustic() {
  return (
    <section className="w-full bg-white py-[60px] sm:py-[80px] lg:py-[100px]">
      <div className="mx-auto px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">

          {/* LEFT IMAGE */}
          <div className="col-span-1 lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative w-[300px] sm:w-[420px] lg:w-[550px] h-[380px] sm:h-[540px] lg:h-[700px] rounded-xl overflow-hidden">
              <Image
                src="/assets/product/why-choose-1.jpg"
                alt="Why Choose Wood Acoustic Panel"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-1 lg:col-span-6">
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] inter-font font-medium leading-tight mb-4">
              Why Choose Wood Acoustic Panel
            </h2>

            <p className="text-gray-600 text-[16px] sm:text-[18px] lg:text-[20px] inter-font font-[400] leading-[24px] sm:leading-[26px] lg:leading-[28px] mb-8 sm:mb-10 max-w-md">
              With its strong professional focus, a New York School of Interior
              Design education gives you access to internships
            </p>

            {/* POINTS */}
            <div className="space-y-6 sm:space-y-8">

              {/* ITEM 1 */}
              <div className="flex gap-4 sm:gap-5">
                <span className="text-[#C28A6A] text-[18px] sm:text-[20px] lg:text-[22px] font-medium">
                  1.
                </span>
                <div>
                  <h4 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium mb-1 inter-font">
                    High Quality Home Furnitures
                  </h4>
                  <p className="text-gray-600 text-[15px] sm:text-[16px] lg:text-[18px] inter-font font-[400] leading-[22px] sm:leading-[23px] lg:leading-[24px] max-w-sm">
                    Complete your design journey and get unwavering support
                    from our dedicated care team.
                  </p>
                </div>
              </div>

              {/* ITEM 2 */}
              <div className="flex gap-4 sm:gap-5">
                <span className="text-[#C28A6A] text-[18px] sm:text-[20px] lg:text-[22px] font-medium">
                  2.
                </span>
                <div>
                  <h4 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium mb-1 inter-font">
                    Unique Designs
                  </h4>
                  <p className="text-gray-600 text-[15px] sm:text-[16px] lg:text-[18px] inter-font font-[400] leading-[22px] sm:leading-[23px] lg:leading-[24px] max-w-sm">
                    Explore design ideas and co-create your dream home with
                    our experienced designers
                  </p>
                </div>
              </div>

              {/* ITEM 3 */}
              <div className="flex gap-4 sm:gap-5">
                <span className="text-[#C28A6A] text-[18px] sm:text-[20px] lg:text-[22px] font-medium">
                  3.
                </span>
                <div>
                  <h4 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium mb-1 inter-font">
                    Lowest Price List
                  </h4>
                  <p className="text-gray-600 text-[15px] sm:text-[16px] lg:text-[18px] inter-font font-[400] leading-[22px] sm:leading-[23px] lg:leading-[24px] max-w-sm">
                    Get beautiful interiors for your new home in just
                    45 days. That’s our delivery guarantee.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
