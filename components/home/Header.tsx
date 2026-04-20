"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getPublicApiBaseUrl } from "@/lib/public-api-base";

const API_BASE = getPublicApiBaseUrl();

type NavCategory = { slug: string; name: string };

export default function Header() {
  const pathname = usePathname();
  const [openProducts, setOpenProducts] = useState(false);
  const [openResources, setOpenResources] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [productCategories, setProductCategories] = useState<NavCategory[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/products/categories`)
      .then((res) => (res.ok ? res.json() : { categories: [] }))
      .then((data: { categories?: Array<{ slug: string; name: string; order?: number }> }) => {
        const list = data.categories ?? [];
        const sorted = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setProductCategories(sorted.map((c) => ({ slug: c.slug, name: c.name })));
      })
      .catch(() => setProductCategories([]));
  }, []);

  // Close mobile menu when route changes
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
    setMobileResourcesOpen(false);
  };

  return (
    <header className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[100px] py-3 sm:py-4 flex items-center justify-between">

        {/* LEFT : LOGO */}
        <div className="flex-shrink-0 z-50">
          <Link href="/" className="cursor-pointer inline-block" onClick={handleLinkClick}>
            <Image
              src="/assets/home/Group 34.svg"
              alt="FX Acoustic Inc"
              width={150}
              height={40}
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 180px, 210px"
              className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[210px] h-auto"
              priority
              decoding="async"
            />
          </Link>
        </div>

        {/* CENTER : DESKTOP NAV */}
        <nav aria-label="Main navigation" className="flex-1 hidden lg:flex justify-center">
          <ul className="flex items-center gap-8 xl:gap-[55px] text-sm font-medium text-gray-800">

            <li>
              <Link href="/about" className="hover:text-orange-500 transition cursor-pointer">
                About
              </Link>
            </li>

            {/* OUR PRODUCTS */}
            <li
              className="relative"
              onMouseEnter={() => setOpenProducts(true)}
              onMouseLeave={() => setOpenProducts(false)}
            >
              <Link
                href="/products"
                aria-expanded={openProducts}
                className={`flex items-center gap-1 transition py-5 cursor-pointer
                  ${pathname?.startsWith("/products")
                    ? "text-orange-500"
                    : "hover:text-orange-500"
                  }`}
              >
                Our Products
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openProducts ? "rotate-180" : ""}`}
                />
              </Link>

              {openProducts && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[60px] bg-white w-[320px] py-3 px-5 z-40 shadow-lg rounded-lg">
                  <h3 className="text-[24px] font-[400] mb-4">Our Products</h3>

                  {productCategories.length > 0 ? (
                    productCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products/${cat.slug}`}
                        className="group flex items-center justify-between px-4 py-3 border-b border-[#eee] hover:bg-[#FFF5EB] transition cursor-pointer"
                      >
                        <span className="font-medium">{cat.name}</span>

                        <div className="w-9 h-9 flex items-center justify-center rounded-full border border-orange-500 transition-all duration-300 ease-in-out">
                          <Image
                            src="/assets/home/headervector.svg"
                            alt=""
                            width={16}
                            height={16}
                            sizes="16px"
                            loading="lazy"
                            decoding="async"
                            aria-hidden
                            className="
                              transition-all duration-300 ease-in-out
                              transform rotate-[-45deg]
                              group-hover:rotate-0
                            "
                          />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <Link
                      href="/products"
                      className="group flex items-center justify-between px-4 py-3 border-b border-[#eee] hover:bg-[#FFF5EB] transition cursor-pointer"
                    >
                      <span className="font-medium">View all products</span>
                      <div className="w-9 h-9 flex items-center justify-center rounded-full border border-orange-500 transition-all duration-300 ease-in-out">
                        <Image
                          src="/assets/home/headervector.svg"
                          alt=""
                          width={16}
                          height={16}
                          sizes="16px"
                          loading="lazy"
                          decoding="async"
                          aria-hidden
                          className="transition-all duration-300 ease-in-out transform rotate-[-45deg] group-hover:rotate-0"
                        />
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </li>

            {/* RESOURCES */}
            <li
              className="relative"
              onMouseEnter={() => setOpenResources(true)}
              onMouseLeave={() => setOpenResources(false)}
            >
              <Link
                href="/resources"
                aria-expanded={openResources}
                className={`flex items-center gap-1 transition py-5 cursor-pointer
                  ${pathname?.startsWith("/resources")
                    ? "text-blue-600"
                    : "hover:text-blue-500"
                  }`}
              >
                Resources
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openResources ? "rotate-180" : ""}`}
                />
              </Link>

              {openResources && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[60px] bg-white w-[280px] py-3 px-5 z-40 shadow-lg rounded-lg">
                  <h3 className="text-[24px] font-[400] mb-4">Resources</h3>

                  {[
                    { name: "Blogs & Articles", link: "/resources/blogs" },
                    { name: "Case Studies", link: "/resources/casestudy" },
                    { name: "Events", link: "/resources/events" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      className="group flex items-center justify-between px-3 py-3 border-b border-[#eee] hover:bg-[#FFF5EB] transition cursor-pointer"
                    >
                      <span className="font-medium">{item.name}</span>

                      <div className="w-9 h-9 flex items-center justify-center rounded-full border border-orange-500 transition-all duration-300 ease-in-out">
                        <Image
                          src="/assets/home/headervector.svg"
                          alt=""
                          width={16}
                          height={16}
                          aria-hidden
                          className="
                            transition-all duration-300 ease-in-out
                            transform rotate-[-45deg]
                            group-hover:rotate-0
                          "
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li>
              <Link href="/contactus" className="hover:text-orange-500 transition cursor-pointer">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* RIGHT : CTA - Desktop */}
        <div className="hidden lg:flex flex-shrink-0">
          <Link
            href="/contactus"
            className="bg-[#EA8E39] text-white px-4 py-3 text-sm font-[400] hover:bg-orange-600 transition rounded cursor-pointer"
          >
            Get Quote
          </Link>
        </div>

        {/* HAMBURGER MENU BUTTON - Mobile & Tablet */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden z-50 p-2 text-gray-800 hover:text-orange-500 transition cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MOBILE MENU OVERLAY */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* MOBILE MENU */}
        <div
          className={`
            fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl z-40 lg:hidden
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            overflow-y-auto
          `}
        >
          <div className="p-6 pt-20">
            <nav aria-label="Mobile navigation">
              <ul className="space-y-2">

                {/* About */}
                <li>
                  <Link
                    href="/about"
                    onClick={handleLinkClick}
                    className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg font-medium cursor-pointer"
                  >
                    About
                  </Link>
                </li>

                {/* Our Products - Mobile Accordion */}
                <li>
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    aria-expanded={mobileProductsOpen}
                    className={`w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg font-medium cursor-pointer
                      ${pathname?.startsWith("/products") ? "text-orange-500 bg-orange-50" : ""}
                    `}
                  >
                    <span>Our Products</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {mobileProductsOpen && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {productCategories.length > 0 ? (
                        productCategories.map((cat) => (
                          <li key={cat.slug}>
                            <Link
                              href={`/products/${cat.slug}`}
                              onClick={handleLinkClick}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg cursor-pointer"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <Link
                            href="/products"
                            onClick={handleLinkClick}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg cursor-pointer"
                          >
                            View all products
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>

                {/* Resources - Mobile Accordion */}
                <li>
                  <button
                    type="button"
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                    aria-expanded={mobileResourcesOpen}
                    className={`w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg font-medium cursor-pointer
                      ${pathname?.startsWith("/resources") ? "text-blue-600 bg-blue-50" : ""}
                    `}
                  >
                    <span>Resources</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {mobileResourcesOpen && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {[
                        { name: "Blogs & Articles", link: "/resources/blogs" },
                        { name: "Case Studies", link: "/resources/casestudy" },
                        { name: "Events", link: "/resources/events" },
                      ].map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.link}
                            onClick={handleLinkClick}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-lg cursor-pointer"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Contact Us */}
                <li>
                  <Link
                    href="/contactus"
                    onClick={handleLinkClick}
                    className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg font-medium cursor-pointer"
                  >
                    Contact Us
                  </Link>
                </li>

                {/* Get Quote Button - Mobile */}
                <li className="pt-4">
                  <Link
                    href="/contactus"
                    onClick={handleLinkClick}
                    className="block w-full bg-[#EA8E39] text-white text-center px-4 py-3 rounded-lg font-medium hover:bg-orange-600 transition cursor-pointer"
                  >
                    Get Quote
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}