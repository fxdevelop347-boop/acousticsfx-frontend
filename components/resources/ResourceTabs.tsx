"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FadeIn, SlideIn } from "@/components/animations";

interface ResourceTabsProps {
    activeTab?: string;
}

const PLACEHOLDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ResourceTabs({}: ResourceTabsProps) {
    const [imgError, setImgError] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeTabState = searchParams.get("tab") || "blogs";

    const handleTabClick = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`/resources?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full bg-[#f3f4ff] relative pt-5 md:h-[600px] h-auto pb-16 md:pb-0">
            {/* HERO SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 h-full relative">

                {/* TEXT CONTENT */}
                <FadeIn
                    direction="up"
                    className="
                        relative md:absolute
                        left-0 md:left-6
                        top-0
                        md:w-[52%]
                        py-4 sm:py-6 md:py-10
                        z-10
                        text-left
                    "
                >
                    <p
                        className="text-blue-600 font-bold text-[14px] md:text-[16px] mb-2"
                    >
                        Home • Resources
                    </p>

                    <h1
                        className="font-manrope text-[22px] sm:text-[26px] md:text-[44px] text-[#1C1C1C] leading-snug"
                    >
                        <span className="font-light">Shaping Spaces: </span>
                        <span className="font-bold">
                            Insights & Innovations in Acoustic Design
                        </span>
                    </h1>
                </FadeIn>

                {/* IMAGE */}
                <SlideIn
                    direction="right"
                    className="
                        relative md:absolute
                        right-0
                        top-0
                        md:bottom-16
                        flex justify-center md:justify-end
                        mt-6 md:mt-0
                    "
                >
                    <div className="relative w-[260px] h-[210px] sm:w-[340px] sm:h-[270px] md:w-[900px] md:h-[700px]">
                        <Image
                            src={imgError ? PLACEHOLDER_IMAGE : "/assets/study-blog.png"}
                            alt="Illustration"
                            fill
                            className="object-contain object-center md:object-right"
                            priority
                            onError={() => setImgError(true)}
                        />
                    </div>
                </SlideIn>
            </div>

            {/* TAB NAVIGATION */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <div
                    className="
                        bg-[#F5F5FF]
                        border border-white
                        rounded-t-lg
                        shadow-md
                        px-2 py-2
                        inline-flex
                        gap-3
                        overflow-x-auto
                        max-w-full
                    "
                >
                    <button
                        onClick={() => handleTabClick("blogs")}
                        className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-all duration-300 relative cursor-pointer ${activeTabState === "blogs"
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Blogs & Articles
                        {activeTabState === "blogs" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>

                    <button
                        onClick={() => handleTabClick("news")}
                        className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-all duration-300 relative cursor-pointer ${activeTabState === "news"
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        FX Acoustics In News
                        {activeTabState === "news" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>

                    <button
                        onClick={() => handleTabClick("events")}
                        className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-all duration-300 relative cursor-pointer ${activeTabState === "events"
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Events
                        {activeTabState === "events" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
