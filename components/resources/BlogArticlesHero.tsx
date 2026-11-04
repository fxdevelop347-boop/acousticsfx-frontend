"use client";
import { useState } from "react";
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
    const [, setSwiper] = useState<SwiperType | null>(null);
    const HeroHeadingTag: "h1" | "p" = isDetailPage ? "p" : "h1";

    const slides = [0, 1, 2];

    // If it's a detail page with hero image, show single image without heading
    if (isDetailPage && heroImage) {
        return (
            <div className="w-full relative h-[260px] sm:h-[360px] md:h-[500px] lg:h-[600px] overflow-hidden">
                <img
                    src={heroImage}
                    alt={blogTitle ? `Featured image for ${blogTitle}` : "FX Acoustics blog article hero image"}
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
                {slides.map((index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="w-full h-full relative"
                            style={{
                                backgroundColor: "#1f2528"
                            }}
                        >
                            {/* HERO SECTION */}
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full relative flex flex-col justify-center items-center">
                                {/* CENTERED TITLE TEXT - Aligned with header logo */}
                                <div className="w-full flex justify-center" data-aos="fade-up" data-aos-delay="200">
                                    <HeroHeadingTag
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
                                    </HeroHeadingTag>
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
                            type="button"
                            onClick={() => setActiveTabState('blogs')}
                            aria-pressed={activeTabState === 'blogs'}
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
                            type="button"
                            onClick={() => setActiveTabState('news')}
                            aria-pressed={activeTabState === 'news'}
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
                            type="button"
                            onClick={() => setActiveTabState('events')}
                            aria-pressed={activeTabState === 'events'}
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
                <button
                    type="button"
                    aria-label="Enquire about FX Acoustics services"
                    className="absolute right-[-28px] sm:right-[-37px] top-1/2 -translate-y-1/2 bg-[#0052CC] text-white px-4 py-2 text-sm font-medium rotate-90 rounded-b-lg shadow-lg z-10 cursor-pointer"
                >
                    Enquire Now
                </button>
            )}
        </div>
    );
}
