import Image from "next/image";
import type { SubProductCertification } from "@/lib/products-api";

const certifications = [
  {
    img: "/assets/product/certification-1.png",
    title: "GECA CERTIFIED",
  },
  {
    img: "/assets/product/certification-3.png",
    title: "FSC® CERTIFIED",
  },
  {
    img: "/assets/product/certification-4.png",
    title: "SUPPLY NATION CERTIFIED",
  },
  {
    img: "/assets/product/certification-2.png",
    title: "SUPPLY NATION CERTIFIED",
  },
];

export default function CertificationsSection({
  certifications: apiCerts,
}: {
  certifications?: SubProductCertification[] | null;
}) {
  const list =
    apiCerts && apiCerts.length > 0
      ? apiCerts.map((c) => ({ img: c.image, title: c.name.toUpperCase() }))
      : certifications;
  return (
    <section className="w-full bg-white px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">
      
      {/* Header */}
      <div className="max-w-2xl mb-8 sm:mb-10">
        <h2 className="text-[28px] sm:text-[30px] lg:text-[34px] font-bold axiforma mb-3">
          Certifications
        </h2>
        <p className="text-[14px] sm:text-[15px] inter-font font-[400] text-gray-600">
          Our inspired solutions have helped shape modern acoustic design.
          Alluring spaces, internationally recognised for their architectural
          elegance and exceptional sound management live here.
        </p>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {list.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            
            {/* Card */}
            <div className="w-[260px] sm:w-[280px] lg:w-[300px] h-[260px] sm:h-[280px] lg:h-[300px] border border-gray-200 rounded-xl flex items-center justify-center bg-white">
              <Image
                src={item.img}
                alt={item.title}
                width={260}
                height={260}
                className="object-cover"
              />
            </div>

            {/* Label */}
            <p className="text-[16px] sm:text-[18px] inter-font font-[400] text-gray-500 mt-4 tracking-wide text-center">
              {item.title}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
