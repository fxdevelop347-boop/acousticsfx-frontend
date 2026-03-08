"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://api.themoonlit.in";

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
    setMobileResourcesOpen(false);
  };

  return (
    <header className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[100px] py-3 sm:py-4 flex items-center justify-between">

        {/* LEFT: LOGO */}
        <div className="flex-shrink-0 z-50">
          <Link href="/" className="cursor-pointer inline-block" onClick={handleLinkClick}>
            <Image
              src="/assets/home/Group 34.svg"
              alt="FX Acoustic Inc"
              width={150}
              height={40}
              className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[210px] h-auto"
              priority
            />
          </Link>
        </div>

        {/* CENTER: DESKTOP NAV */}
        <nav className="flex-1 hidden lg:flex justify-center">
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
                className={`flex items-center gap-1 transition py-5 cursor-pointer
                  ${pathname?.startsWith("/products") ? "text-orange-500" : "hover:text-orange-500"}`}
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
                            alt="arrow"
                            width={16}
                            height={16}
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
                    [
                      { name: "Acoustic Solutions", link: "/products/acoustic" },
                      { name: "Flooring Solutions", link: "/products" },
                      { name: "Noise Solution", link: "/products" },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.link}
                        className="group flex items-center justify-between px-4 py-3 border-b border-[#eee] hover:bg-[#FFF5EB] transition cursor-pointer"
                      >
                        <span className="font-medium">{item.name}</span>
                        <div className="w-9 h-9 flex items-center justify-center rounded-full border border-orange-500 transition-all duration-300 ease-in-out">
                          <Image
                            src="/assets/home/headervector.svg"
                            alt="arrow"
                            width={16}
                            height={16}
                            className="transition-all duration-300 ease-in-out transform rotate-[-45deg] group-hover:rotate-0"
                          />
                        </div>
                      </Link>
                    ))
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
                className={`flex items-center gap-1 transition py-5 cursor-pointer
                  ${pathname?.startsWith("/resources") ? "text-orange-500" : "hover:text-orange-500"}`}
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
                          alt="arrow"
                          width={16}
                          height={16}
                          className="transition-all duration-300 ease-in-out transform rotate-[-45deg] group-hover:rotate-0"
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

        {/* RIGHT: CTA Desktop */}
        <div className="hidden lg:flex flex-shrink-0">
          <Link
            href="/contactus"
            className="bg-[#EA8E39] text-white px-4 py-3 text-sm font-[400] hover:bg-orange-600 transition rounded cursor-pointer"
          >
            Get Quote
          </Link>
        </div>

        {/* HAMBURGER — Mobile & Tablet (hidden when menu is open, the menu has its own X) */}
        {!mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden z-[60] p-2 text-gray-800 hover:text-orange-500 transition cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        )}
      </div>

      {/* ── FULL-SCREEN MOBILE MENU ── */}
      <div
        className={`
          fixed inset-0 w-full h-full bg-white z-[55] lg:hidden
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Top bar: logo + close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <Link href="/" onClick={handleLinkClick}>
            <Image
              src="/assets/home/Group 34.svg"
              alt="FX Acoustic Inc"
              width={150}
              height={40}
              className="w-[120px] sm:w-[150px] h-auto"
              priority
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-800 hover:text-orange-500 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* Nav items — scrollable if needed */}
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">

            {/* About */}
            <li>
              <Link
                href="/about"
                onClick={handleLinkClick}
                className="block px-4 py-4 text-[16px] font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-xl cursor-pointer"
              >
                About
              </Link>
            </li>

            {/* Our Products accordion */}
            <li>
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={`w-full flex items-center justify-between px-4 py-4 text-[16px] font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-xl cursor-pointer
                  ${pathname?.startsWith("/products") ? "text-orange-500 bg-orange-50" : ""}`}
              >
                <span>Our Products</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${mobileProductsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileProductsOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <ul className="mt-1 ml-4 space-y-1 pb-2">
                  {productCategories.length > 0 ? (
                    productCategories.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/products/${cat.slug}`}
                          onClick={handleLinkClick}
                          className="flex items-center gap-2 px-4 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition rounded-xl cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    [
                      { name: "Acoustic Solutions", link: "/products/acoustic" },
                      { name: "Flooring Solutions", link: "/products" },
                      { name: "Noise Solution", link: "/products" },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.link}
                          onClick={handleLinkClick}
                          className="flex items-center gap-2 px-4 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition rounded-xl cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </li>

            {/* Resources accordion */}
            <li>
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className={`w-full flex items-center justify-between px-4 py-4 text-[16px] font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-xl cursor-pointer
                  ${pathname?.startsWith("/resources") ? "text-orange-500 bg-orange-50" : ""}`}
              >
                <span>Resources</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${mobileResourcesOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileResourcesOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <ul className="mt-1 ml-4 space-y-1 pb-2">
                  {[
                    { name: "Blogs & Articles", link: "/resources/blogs" },
                    { name: "Case Studies", link: "/resources/casestudy" },
                    { name: "Events", link: "/resources/events" },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 px-4 py-3 text-[15px] text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition rounded-xl cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Contact Us */}
            <li>
              <Link
                href="/contactus"
                onClick={handleLinkClick}
                className="block px-4 py-4 text-[16px] font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition rounded-xl cursor-pointer"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom CTA — pinned */}
        <div className="px-6 py-6 border-t border-gray-100">
          <Link
            href="/contactus"
            onClick={handleLinkClick}
            className="block w-full bg-[#EA8E39] text-white text-center px-4 py-4 rounded-xl text-[16px] font-medium hover:bg-orange-600 transition cursor-pointer"
          >
            Get Quote
          </Link>
        </div>
      </div>

    </header>
  );
}