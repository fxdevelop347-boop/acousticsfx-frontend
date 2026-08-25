"use client";

import Image from "@/components/shared/SmartImage";
import { useEffect, useState } from "react";
import { fetchLatestBlogs, type BlogSummary } from "@/lib/blogs-api";
import { fetchContent, type ContentMap } from "@/lib/content-api";

const CONTENT_KEYS = [
  "home.latestBlogs.heading",
  "home.latestBlogs.subheading",
  "home.latestBlogs.ctaLabel",
];

const DEFAULTS: Record<string, string> = {
  "home.latestBlogs.heading": "Our Latest Blogs",
  "home.latestBlogs.subheading":
    "A place to share knowledge about acoustic, noise & flooring solutions.",
  "home.latestBlogs.ctaLabel": "VIEW ALL BLOGS →",
};

interface BlogCard {
  id: string;
  slug: string;
  tag: string;
  date: string;
  title: string;
  desc: string;
  image: string;
}

function toBlogCard(b: BlogSummary): BlogCard {
  const d = b.publishedAt || b.createdAt;

  return {
    id: b._id,
    slug: b.slug,
    tag: b.tags?.[0] ?? "Blog",
    date: d
      ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "",
    title: b.title,
    desc: b.excerpt ?? "",
    image: b.heroImage,
  };
}

function val(content: ContentMap, key: string) {
  return content[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [resolved, setResolved] = useState(false);
  const [content, setContent] = useState<ContentMap>({});
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);

    fetchLatestBlogs(3)
      .then((data) => {
        setBlogs(data.map(toBlogCard));
        setActiveIndex(0);
      })
      .catch(console.error)
      .finally(() => setResolved(true));
  }, []);

  const activeBlog = blogs[activeIndex];

  // Guarded below by the empty check; on an empty list these would be `% 0`.
  const sideBlogs = blogs.length
    ? [
        blogs[(activeIndex + 1) % blogs.length],
        blogs[(activeIndex + 2) % blogs.length],
      ]
    : [];

  const next = () =>
    setActiveIndex((prev) => (prev + 1) % blogs.length);

  const prev = () =>
    setActiveIndex((prev) =>
      prev === 0 ? blogs.length - 1 : prev - 1
    );

  // autoplay carousel (all viewports)
  useEffect(() => {
    if (!blogs.length) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % blogs.length);
    }, 6000);
    return () => clearInterval(id);
  }, [blogs.length]);

  // Nothing published means no section, rather than a carousel of invented posts.
  if (!resolved || blogs.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-[100px] py-8 sm:py-[100px] bg-white">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 sm:mb-12 gap-4 sm:gap-6">

        <div>
          <p className="text-sm sm:text-[16px] font-bold mb-2 sm:mb-3 worksans-font">
            {val(content, "home.latestBlogs.heading")}
          </p>

          <h2 className="text-[1.125rem] sm:text-[28px] lg:text-[35px] axiforma font-bold max-w-2xl leading-snug sm:leading-tight">
            {val(content, "home.latestBlogs.subheading")}
          </h2>
        </div>

        <button type="button" className="border px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm h-fit w-fit">
          {val(content, "home.latestBlogs.ctaLabel")}
        </button>

      </div>

      {/* MOBILE CAROUSEL */}
      <div className="lg:hidden">

        <div className="relative rounded-2xl overflow-hidden h-[min(52svh,320px)] sm:h-[420px]">

          <Image
            src={activeBlog.image}
            alt={activeBlog.title}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-0 p-4 sm:p-6 text-white max-w-xl">
            <p className="text-xs sm:text-[14px] font-normal mb-1 inter-font">
              {activeBlog.date}
            </p>

            <h3 className="text-base sm:text-[19px] font-semibold mb-1.5 sm:mb-2 inter-font leading-snug">
              {activeBlog.title}
            </h3>

            <p className="text-sm sm:text-[15px] text-white/90 inter-font font-medium line-clamp-3 sm:line-clamp-none">
              {activeBlog.desc}
            </p>
          </div>

          <span className="absolute top-4 right-4 bg-white text-xs px-3 py-1 rounded-full">
            {activeBlog.tag}
          </span>
        </div>

        <div className="hidden sm:flex justify-center gap-4 mt-4 sm:mt-6">
          <button
            onClick={prev}
            className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center"
          >
            <Image
              src="/assets/home/universalvector.svg"
              alt="Previous"
              width={34}
              height={14}
              className="rotate-180"
            />
          </button>

          <button
            onClick={next}
            className="w-12 h-12 bg-black rounded-md flex items-center justify-center"
          >
            <Image
              src="/assets/home/universalvector.svg"
              alt="Next"
              width={34}
              height={14}
              className="invert"
            />
          </button>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:grid grid-cols-2 gap-8">

        {/* BIG BLOG */}
        <div className="relative rounded-2xl overflow-hidden h-[420px]">
          <Image
            src={activeBlog.image}
            alt={activeBlog.title}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-0 p-6 text-white max-w-xl">
            <p className="text-[14px] font-normal mb-1 inter-font">
              {activeBlog.date}
            </p>

            <h3 className="text-[19px] font-semibold mb-2 inter-font">
              {activeBlog.title}
            </h3>

            <p className="text-[15px] text-white/90 inter-font font-medium">
              {activeBlog.desc}
            </p>
          </div>

          <span className="absolute top-4 right-4 bg-white text-xs px-3 py-1 rounded-full">
            {activeBlog.tag}
          </span>
        </div>

        {/* RIGHT BLOGS */}
        <div className="grid grid-cols-2 gap-6">
          {sideBlogs.map((blog) => (
            <div
              key={blog.id}
              className="cursor-pointer"
              onClick={() =>
                setActiveIndex(
                  blogs.findIndex((b) => b.id === blog.id)
                )
              }
            >
              <div className="relative h-[160px] rounded-xl overflow-hidden mb-3">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />

                <span className="absolute top-3 right-3 bg-white text-xs px-3 py-1 rounded-full">
                  {blog.tag}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-1">
                {blog.date}
              </p>

              <h4 className="font-semibold text-sm mb-1">
                {blog.title}
              </h4>

              <p className="text-sm text-gray-600">
                {blog.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* DESKTOP ARROWS */}
      <div className="hidden lg:flex justify-end gap-4 mt-10">
        <button
          onClick={prev}
          className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center"
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="Previous"
            width={34}
            height={14}
            className="rotate-180"
          />
        </button>

        <button
          onClick={next}
          className="w-12 h-12 bg-black rounded-md flex items-center justify-center"
        >
          <Image
            src="/assets/home/universalvector.svg"
            alt="Next"
            width={34}
            height={14}
            className="invert"
          />
        </button>
      </div>

    </section>
  );
}