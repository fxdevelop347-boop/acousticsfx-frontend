"use client";
import { useState } from "react";
import type { SubProductAboutTab } from "@/lib/products-api";

const tabs = [
  "Advantages",
  "Key Features",
  "Application Areas",
  "Characteristics",
  "Maintenance",
];

const advantages = [
  [
    "Best possible combination of acoustics and aesthetic",
    "Seamless jointing with tongue and groove design.",
  ],
  [
    "Wide variety of surface finishes available.",
    "Natural timber veneers, painted finishes, raw MDF, laminates etc.",
  ],
  [
    "Range of acoustic performance options.",
    "Various groove profiles for maximum design flexibility.",
  ],
  [
    "Easy to handle, transport, store and install.",
    "Short acquisition lead times.",
  ],
  [
    "Durable, long lasting, demountable, reusable.",
    "Enables designers to produce rich, warm spaces.",
  ],
  [
    "It’s Helmholtz Resonator concept enhances acoustical properties.",
    "Improved acoustics with FX fleece",
  ],
];
export default function AboutProduct({
  aboutTabs,
}: {
  aboutTabs?: SubProductAboutTab[] | null;
}) {
  const fallbackTabs: SubProductAboutTab[] = [
    {
      key: "advantages",
      title: "Advantages",
      rows: advantages.flatMap((pair) => pair),
    },
  ];
  const tabsFromApi = aboutTabs && aboutTabs.length > 0 ? aboutTabs : fallbackTabs;
  const [activeTab, setActiveTab] = useState<string>(tabsFromApi[0]?.title ?? "Advantages");
  const active = tabsFromApi.find((t) => t.title === activeTab) ?? tabsFromApi[0];
  const rows = active?.rows ?? [];
  const pairs: Array<[string, string?]> = [];
  for (let i = 0; i < rows.length; i += 2) pairs.push([rows[i] as string, rows[i + 1] as string | undefined]);

  return (
    <section className="w-full bg-[#faf7f2] px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[40px] sm:py-[60px] lg:py-[80px]">
      
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <h2 className="text-[28px] sm:text-[30px] md:text-[32px] lg:text-[34px] axiforma font-bold mb-3">
          About the product
        </h2>
        <p className="text-[14px] sm:text-[15px] inter-font font-[400] text-gray-600">
          Our inspired solutions have helped shape modern acoustic design.
          Alluring spaces, internationally recognised for their architectural
          elegance and exceptional sound management live here.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap border border-[#f0b07a] rounded-md overflow-hidden w-fit mb-8">
        {tabsFromApi.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.title)}
            className={`px-4 sm:px-5 lg:px-6 py-2 text-[14px] sm:text-[15px] lg:text-[16px] axiforma font-[400] border-r last:border-r-0 border-[#f0b07a] cursor-pointer
              ${
                activeTab === tab.title
                  ? "bg-[#f09a4a] text-white"
                  : "bg-white text-gray-700 hover:bg-[#fff1e5]"
              }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Content */}
      {!!active && (
        <div className="bg-[#f1f1f1] rounded-lg p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pairs.map((row, index) => (
              <div
                key={index}
                className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="bg-white rounded-md px-4 py-3 text-[16px] sm:text-[18px] lg:text-[20px] inter-font font-[400] text-gray-700">
                  {row[0]}
                </div>
                {row[1] ? (
                  <div className="bg-white rounded-md px-4 py-3 text-[16px] sm:text-[18px] lg:text-[20px] inter-font font-[400] text-gray-700">
                    {row[1]}
                  </div>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
