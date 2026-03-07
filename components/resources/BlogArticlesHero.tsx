"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface BlogArticlesHeroProps {
    blogTitle?: string;
    isDetailPage?: boolean;
    heroImage?: string;
}

export default function BlogArticlesHero({ blogTitle, isDetailPage = false, heroImage }: BlogArticlesHeroProps = {}) {
    const [activeTabState, setActiveTabState] = useState('blogs');
    const [swiper, setSwiper] = useState<SwiperType | null>(null);

    const slides = [
        { bg: "/resources/rebg.png" },
        { bg: "/resources/rebg.png" },
        { bg: "/resources/rebg.png" }
    ];

    // If it's a detail page with hero image, show single image without heading
    if (isDetailPage && heroImage) {
        return (
            <div className="w-full relative h-[260px] sm:h-[360px] md:h-[500px] lg:h-[600px] overflow-hidden">
                <img
                    src={heroImage}
                    alt="Blog hero"
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="w-full relative h-[260px] sm:h-[360px] md:h-[500px] lg:h-[600px]">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3500 }}
                pagination={{ clickable: true }}
                loop={true}
                onSwiper={setSwiper}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="w-full h-full relative"
                            style={{
                                backgroundImage: `url('${slide.bg}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            {/* HERO SECTION */}
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full relative flex flex-col justify-center items-center">
                                {/* CENTERED TITLE TEXT - Aligned with header logo */}
                                <div className="w-full flex justify-center" data-aos="fade-up" data-aos-delay="200">
                                    <h1
                                        style={{
                                            fontFamily: 'Manrope',
                                            fontWeight: 300,
                                            fontSize: '70px',
                                            lineHeight: '84px',
                                            letterSpacing: '-0.7px',
                                            color: '#fff',
                                            textAlign: 'center',
                                            maxWidth: '1200px',
                                            margin: '0 auto',
                                            whiteSpace: 'normal'
                                        }}
                                    >
                                        {blogTitle ? (
                                            blogTitle
                                        ) : (
                                            <>
                                                The Impact of Technology on the Workplace:<br />
                                                <span style={{ fontWeight: 700 }}>
                                                    How Technology is Changing
                                                </span>
                                            </>
                                        )}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* TAB NAVIGATION - Bottom center (only show on list page, not detail page) */}
            {!isDetailPage && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 sm:pb-4">
                    <div className="bg-[#F5F5FF] border border-[#ffff] border-solid border-6 rounded-t-lg shadow-md p-2 inline-flex gap-4 sm:gap-6">
                        <button
                            onClick={() => setActiveTabState('blogs')}
                            className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative cursor-pointer ${activeTabState === 'blogs'
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Blogs & Articles
                            {activeTabState === 'blogs' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTabState('news')}
                            className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative cursor-pointer ${activeTabState === 'news'
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            FX Acoustics In News
                            {activeTabState === 'news' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTabState('events')}
                            className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative cursor-pointer ${activeTabState === 'events'
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Events
                            {activeTabState === 'events' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ENQUIRE NOW BUTTON - Right side (only show on list page, not detail page) */}
            {!isDetailPage && (
                <button className="absolute right-[-28px] sm:right-[-37px] top-1/2 -translate-y-1/2 bg-[#0052CC] text-white px-4 py-2 text-sm font-medium rotate-90 rounded-b-lg shadow-lg z-10 cursor-pointer">
                    Enquire Now
                </button>
            )}
        </div>
    );
}
