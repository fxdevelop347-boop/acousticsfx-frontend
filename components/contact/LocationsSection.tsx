"use client";

import { useEffect, useState } from "react";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { fetchLocations, type LocationData } from "@/lib/locations-api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const CONTENT_KEYS = ["contact.locations.title", "contact.locations.description"];

const DEFAULTS: Record<string, string> = {
  "contact.locations.title": "A Space That Inspires",
  "contact.locations.description": "You wish to visit our place and sit with us on a coffee.",
};

const FALLBACK_LOCATIONS: LocationData[] = [
  {
    _id: "1", title: "Corporate Office", highlight: true,
    items: [
      { label: "Location", value: "3688, Sector 46-C, Chandigarh-160047. INDIA." },
      { label: "Email", value: "sales@acousticsfx.com" },
      { label: "Phone", value: "+91 9967 034 958" },
    ],
  },
  {
    _id: "2", title: "Factory",
    items: [
      { label: "Location", value: "347-350B, HSIIDC Industrial Estate, Saha, Haryana-133104. INDIA." },
      { label: "Email", value: "sales@acousticsfx.com" },
      { label: "Phone", value: "+91 8599 999 347, +91 9996 119 099" },
    ],
  },
  {
    _id: "3", title: "Mumbai Office",
    items: [
      { label: "Location", value: "Plot-5, A301 Indusagar, Sector-7, Dr. B.A. Road, Charkop, Kandivali (West), Mumbai-400 067, Maharashtra, INDIA." },
      { label: "Contact", value: "Mr. Sunil Sawant" },
      { label: "Phone", value: "+91 9967 034 958" },
    ],
  },
];

function val(c: ContentMap, key: string) {
  return c[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function LocationsSection() {
  const [content, setContent] = useState<ContentMap>({});
  const [locations, setLocations] = useState(FALLBACK_LOCATIONS);

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
    fetchLocations()
      .then((data) => { if (data.length > 0) setLocations(data); })
      .catch(console.error);
  }, []);

  return (
    <section className="px-[16px] sm:px-[40px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] bg-[#F5F5F5]">
      <FadeIn direction="up" className="mb-10 sm:mb-12 lg:mb-14">
        <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] poppins-font font-bold text-[#111] mb-2">
          {val(content, "contact.locations.title")}
        </h2>
        <p className="text-gray-500 poppins-font font-[500] text-[16px] sm:text-[18px] lg:text-[20px]">
          {val(content, "contact.locations.description")}
        </p>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
        {locations.map((loc) => (
          <StaggerItem key={loc._id} direction="up">
            <LocationCard title={loc.title} items={loc.items} highlight={loc.highlight} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function LocationCard({
  title,
  items,
  highlight = false,
}: {
  title: string;
  items: { label: string; value: string }[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        p-6 sm:p-7 lg:p-8
        rounded-lg
        bg-gray-50
        border
        ${highlight ? "border-orange-400" : "border-gray-200"}
        relative
        overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.03)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.03)_50%,rgba(0,0,0,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] poppins-font font-bold text-[#111] mb-4">
          {title}
        </h3>
        <div className="space-y-3 text-[16px] sm:text-[18px] lg:text-[19px] poppins-font font-[400] text-gray-600">
          {items.map((item, idx) => (
            <p key={idx}>
              <span className="text-[16px] sm:text-[18px] lg:text-[19px] poppins-font font-[600] text-black">
                {item.label}:
              </span>{" "}
              {item.value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
