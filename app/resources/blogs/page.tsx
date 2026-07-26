"use client";

import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import Spinner from "@/components/shared/Spinner";
import Testimonials from "@/components/home/Testimonials";
import ConnectWithExperts from "@/components/home/ConnectWithExperts";
import { slugify } from "@/lib/utils";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  heroImage: string;
  authorName: string;
  authorImage?: string;
  excerpt?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
}

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<number, { post: boolean; author: boolean }>>({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; blogs: Blog[] }>("/api/blogs");
        if (response.success && response.blogs) {
          setBlogs(response.blogs);
          const initial: Record<number, { post: boolean; author: boolean }> = {};
          response.blogs.forEach((_, i) => {
            initial[i] = { post: false, author: false };
          });
          setImgErrors(initial);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleImageError = (postIdx: number, type: "post" | "author") => {
    setImgErrors((prev) => ({
      ...prev,
      [postIdx]: { ...prev[postIdx], [type]: true },
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="w-full bg-[#1a1a2e] text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Blogs & Articles</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Insights, updates, and expert perspectives on acoustics and design.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="w-full py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center gap-3 py-16">
              <Spinner size="sm" />
              <span className="text-sm text-gray-500">Loading blogs…</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No blog posts available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog, idx) => {
                const blogSlug = blog.slug || slugify(blog.title);
                return (
                  <Link
                    key={blog._id}
                    href={`/resources/blogs/${blogSlug}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-4 block"
                  >
                    <div className="relative w-full h-[180px] sm:h-[200px] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={imgErrors[idx]?.post ? PLACEHOLDER_IMAGE : blog.heroImage}
                        fill
                        alt={blog.title}
                        className="object-cover"
                        onError={() => handleImageError(idx, "post")}
                        unoptimized={blog.heroImage?.startsWith("http")}
                      />
                    </div>
                    {blog.tags && blog.tags.length > 0 ? (
                      <span className="inline-block mt-3 bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-md">
                        {blog.tags[0]}
                      </span>
                    ) : (
                      <span className="inline-block mt-3 bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-md">
                        Article
                      </span>
                    )}
                    <h2 className="mt-3 text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-4">
                      {blog.authorImage ? (
                        <Image
                          src={imgErrors[idx]?.author ? PLACEHOLDER_IMAGE : blog.authorImage}
                          width={28}
                          height={28}
                          alt={blog.authorName}
                          className="rounded-full object-cover"
                          onError={() => handleImageError(idx, "author")}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                          {blog.authorName?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="text-sm text-gray-600">{blog.authorName}</span>
                      {(blog.publishedAt || blog.createdAt) && (
                        <>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <ConnectWithExperts />
    </>
  );
}
