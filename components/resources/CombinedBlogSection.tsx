"use client";

import Image from "@/components/shared/SmartImage";

export default function CombinedBlogSection() {
    return (
        <div className="w-full py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row justify-start gap-6 lg:gap-8">

                    {/* LEFT FEATURE SECTION */}
                    <div
                        className="border border-gray-300 rounded-lg bg-white p-4 lg:p-6 flex-shrink-0 w-full lg:max-w-[60%]"
                        style={{ 
                            minWidth: "300px",
                            height: "auto",
                            minHeight: "448.76px"
                        }}
                        data-aos="fade-right"
                        data-aos-delay="100"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">

                            {/* Big Featured Area */}
                            <div className="md:col-span-2 flex flex-col justify-start">
                                <div
                                    className="overflow-hidden rounded-md w-full"
                                    style={{ minHeight: "180px", aspectRatio: "493/237" }}
                                >
                                    <Image
                                        src="/resources/74654a8f67369b797c8fb2e96a533fd515fb2939 (1).jpg"
                                        alt="Featured"
                                        width={493}
                                        height={238}
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                </div>

                                <div className="pt-0 flex flex-col justify-start">
                                    <p className="text-sm text-gray-500 mb-2">1 Month Ago</p>

                                    <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                                        Tick one more destination off your bucket list with one of our
                                        most popular vacations in 2022
                                    </h2>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        Ut. Phasellus aliquet nibh id iaculis pharetra. Maecenas
                                        eleifend sed ex. Donec quis magna sed felis elementum blandit
                                        nec quis sem. Maecen.
                                    </p>

                                    <button className="text-sm font-semibold text-gray-900 hover:text-blue-600 border-b border-gray-900 hover:border-blue-600 pb-0.5 w-fit transition cursor-pointer">
                                        View Post
                                    </button>
                                </div>
                            </div>

                            {/* Small Posts */}
                            <div className="flex flex-col justify-start gap-6">
                                {[
                                    { img: "/resources/dbaeead316e4297057a78fcd78323914d00b0bf8.jpg", title: "Akame Ga Kill: Season finale" },
                                    { img: "/resources/9cba011547643788a57b79a4aa1d6c6db76208a5.jpg", title: "Naruto Uzumaki: Hidden Village" },
                                    { img: "/resources/308705a30ba138a3797a763d4510333166532abb.jpg", title: "Love juice Season Priemere" },
                                    { img: "/resources/e4e4d40bdc5bf5a2de00232ed3b7e18eadcbe03a.jpg", title: "Love juice Season Priemere" },
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div
                                            className="overflow-hidden rounded-md flex-shrink-0 w-[100px] h-[70px]"
                                        >
                                            <Image
                                                src={item.img}
                                                alt={item.title}
                                                width={118}
                                                height={82}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold leading-snug text-gray-900">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500">21 March 2021</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* RIGHT MANGA READS SECTION */}
                    <div
                        className="border border-gray-300 rounded-lg bg-white p-4 lg:p-6 flex-shrink-0 w-full lg:max-w-[40%]"
                        style={{ 
                            minWidth: "280px",
                            height: "auto",
                            minHeight: "447.94px"
                        }}
                        data-aos="fade-left"
                        data-aos-delay="200"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Manga reads</h3>

                        <div className="space-y-8">
                            {[
                                "/resources/3969146248009e641f454298f62e13de84ac0a09.jpg",
                                "/resources/3abf26dd585632b9d05dcfd0daffacedd55842f5.jpg",
                                "/resources/106d4f6c9ccec87e0dce6e143ad30d966b349b0a.jpg",
                            ].map((src, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="overflow-hidden rounded-md flex-shrink-0 w-[180px] h-[85px]">
                                        <Image
                                            src={src}
                                            alt="read"
                                            width={222}
                                            height={99}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[15px] font-semibold text-gray-900 leading-snug">
                                            Tick one more destination off of your bucket list with one of
                                            our most popular vacations in 2022
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">21 March 2021</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
