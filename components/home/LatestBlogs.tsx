"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLatestBlogs, type BlogSummary } from "@/lib/blogs-api";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

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

const FALLBACK_BLOGS: BlogCard[] = [
  {
    id: "1",
    slug: "the-power-of-restraint-in-architecture",
    tag: "Insights",
    date: "May 30, 2025",
    title: "The Power of Restraint in Architecture",
    desc: "A look at how simplicity can sharpen communication, increase impact, and build longer-lasting brands.",
    image: "/assets/home/Container2.png",
  },
  {
    id: "2",
    slug: "architecting-for-calm-ux-beyond-the-screen",
    tag: "Digital Architect",
    date: "May 23, 2025",
    title: "Architecting for Calm: UX Beyond the Screen",
    desc: "An exploration of how subtle interaction, whitespace, and visual pacing shape user emotion.",
    image: "/assets/home/Container.png",
  },
  {
    id: "3",
    slug: "building-a-timeless-identity",
    tag: "Strategy",
    date: "May 16, 2025",
    title: "Building a Timeless Identity",
    desc: "A guide to creating brands that transcend trends, focusing on core values instead.",
    image: "/assets/home/Container3.png",
  },
];

function toBlogCard(b: BlogSummary): BlogCard {
  const d = b.publishedAt || b.createdAt;
  return {
    id: b._id,
    slug: b.slug,
    tag: b.tags?.[0] ?? "Blog",
    date: d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    title: b.title,
    desc: b.excerpt ?? "",
    image: b.heroImage,
  };
}

function val(content: ContentMap, key: string) {
  return content[key]?.value ?? DEFAULTS[key] ?? "";
}

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<BlogCard[]>(FALLBACK_BLOGS);
  const [content, setContent] = useState<ContentMap>({});
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
    fetchLatestBlogs(3)
      .then((data) => {
        if (data.length > 0) {
          setBlogs(data.map(toBlogCard));
          setActiveIndex(0);
        }
      })
      .catch(console.error);
  }, []);

  const activeBlog = blogs[activeIndex];

  const next = () => setActiveIndex((prev) => (prev + 1) % blogs.length);
  const prev = () => setActiveIndex((prev) => (prev === 0 ? blogs.length - 1 : prev - 1));

  return (
    <section className="px-6 sm:px-10 lg:px-[100px] py-[80px] lg:py-[100px] bg-white">

      {/* HEADER */}
      <FadeIn direction="up" duration={0.6} className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
        <div>
          <p className="text-[16px] font-bold mb-3 worksans-font">
            {val(content, "home.latestBlogs.heading")}
          </p>

          <h2 className="text-[26px] sm:text-[30px] lg:text-[35px] axiforma font-bold max-w-2xl">
            {val(content, "home.latestBlogs.subheading")}
          </h2>
        </div>

        <Link href="/resources?tab=blogs" className="border px-5 py-2 text-sm h-fit cursor-pointer">
          {val(content, "home.latestBlogs.ctaLabel")}
        </Link>
      </FadeIn>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ACTIVE SLIDE */}
        <FadeIn direction="up" duration={0.7}>
          <HoverScale>
            <Link
              href={`/resources/blogs/${activeBlog.slug}`}
              className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[380px] lg:h-[420px] block"
            >
              <Image
                src={activeBlog.image}
                alt={activeBlog.title}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-0 p-4 sm:p-6 text-white max-w-xl">
                <p className="text-[14px] font-[400] mb-1 inter-font">
                  {activeBlog.date}
                </p>
                <h3 className="text-[17px] sm:text-[18px] lg:text-[19px] font-semibold mb-2 inter-font">
                  {activeBlog.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] text-white/90 inter-font font-[500]">
                  {activeBlog.desc}
                </p>
              </div>

              <span className="absolute top-4 right-4 bg-white text-xs px-3 py-1 rounded-full">
                {activeBlog.tag}
              </span>
            </Link>
          </HoverScale>
        </FadeIn>

        {/* ================= SIDE BLOGS (DESKTOP ONLY) ================= */}
        <div className="hidden lg:grid grid-cols-2 gap-6">
          <StaggerContainer className="grid grid-cols-2 gap-6">
            {blogs
              .filter((_, i) => i !== activeIndex)
              .map((blog) => (
                <StaggerItem key={blog.id} direction="up">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      setActiveIndex(blogs.findIndex((b) => b.id === blog.id))
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

                    <p className="text-xs text-gray-500 mb-1">{blog.date}</p>
                    <h4 className="font-semibold text-sm mb-1">
                      {blog.title}
                    </h4>
                    <p className="text-sm text-gray-600">{blog.desc}</p>
                  </div>
                </StaggerItem>
              ))}
          </StaggerContainer>
        </div>
      </div>

      {/* ================= ARROWS ================= */}
      <div className="flex justify-center lg:justify-end gap-4 mt-10">
        <button
          onClick={prev}
          className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
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
          className="w-12 h-12 bg-black rounded-md flex items-center justify-center cursor-pointer"
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
