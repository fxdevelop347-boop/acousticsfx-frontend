import Image from "@/components/shared/SmartImage";

export default function WoodAcousticPanel() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto py-[60px] sm:py-[80px] lg:py-[100px]">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">

          {/* LEFT CONTENT – 100px padding */}
          <div className="col-span-1 lg:col-span-6 px-[24px] sm:px-[40px] md:px-[60px] lg:pl-[100px] lg:pr-0">
            <h2 className="text-[36px] sm:text-[48px] lg:text-[65px] playfair-display text-black mb-6">
              Wood Acoustic Panel
            </h2>

            <p className="text-[18px] sm:text-[24px] lg:text-[32px] poppins-font font-[400] leading-[28px] sm:leading-[36px] lg:leading-[45px] text-gray-600 ">
              Our modern interiors reflect your lifestyle—creating beautiful,
              uniquely yours spaces. We design with heart and precision.
            </p>
          </div>

          {/* RIGHT IMAGES */}
          <div className="col-span-1 lg:col-span-6 px-[24px] sm:px-[40px] md:px-[60px] lg:px-0 pr-0 grid grid-cols-3 gap-x-4 gap-y-2">

            {/* COLUMN 1 */}
            <div className="flex items-center">
              <div className="relative w-full aspect-[240/340] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/product/product-feature-2.png"
                  alt="Acoustic"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* COLUMN 2 – TWO SEPARATE IMAGES */}
            <div className="flex flex-col gap-2">
              <div className="relative w-full aspect-[240/340] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/product/product-feature-1.png"
                  alt="Acoustic Top"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative w-full aspect-[240/340] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/product/product-feature-3.png"
                  alt="Acoustic Bottom"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* COLUMN 3 */}
            <div className="flex items-center">
              <div className="relative w-full aspect-[240/340] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/product/product-feature-4.png"
                  alt="Acoustic"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
