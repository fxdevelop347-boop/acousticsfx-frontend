"use client";
import Image from "@/components/shared/SmartImage";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import Spinner from "@/components/shared/Spinner";
import NewsletterSubscribe from "./NewsletterSubscribe";

// Placeholder image as data URI
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

// Content block types
interface ContentBlock {
  type: 'paragraph' | 'image' | 'heading';
  content: string;
  caption?: string;
  order: number;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  heroImage: string;
  authorName: string;
  authorEmail?: string;
  authorImage?: string;
  content: string | ContentBlock[]; // Can be HTML string or legacy ContentBlock array
  excerpt?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
  views?: number;
}

interface BlogDetailLayoutProps {
  slug: string;
}

export default function BlogDetailLayout({ slug }: BlogDetailLayoutProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchRecentBlogs();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; blog: Blog }>(`/api/blogs/slug/${slug}`);
      if (response.success && response.blog) {
        setBlog(response.blog);
      }
    } catch (err) {
      console.error("Failed to fetch blog:", err);
      setError("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBlogs = async () => {
    try {
      // Use optimized recent blogs endpoint with limit and exclude current blog
      const response = await api.get<{ success: boolean; blogs: Blog[] }>(
        `/api/blogs?recent=true&limit=5&excludeSlug=${encodeURIComponent(slug)}`
      );
      if (response.success && response.blogs) {
        setRecentBlogs(response.blogs);
      }
    } catch (err) {
      console.error("Failed to fetch recent blogs:", err);
    }
  };

  const handleImageError = (key: string) => {
    setImgErrors(prev => ({ ...prev, [key]: true }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <h2 key={index} className="mb-2 text-xl sm:text-2xl lg:text-[24px] axiforma font-bold text-gray-900 leading-tight">
            {block.content}
          </h2>
        );
      case 'image':
        // Replace with product images - cycle through available product images
        const productImages = [
          "/assets/product/product-card-1.png",
          "/assets/product/product-card-2.png",
          "/assets/product/product-card-3.png",
          "/assets/product/product-card-4.png",
          "/assets/product/product-card-5.png",
          "/assets/product/product-card-6.png",
          "/assets/product/product-feature-1.png",
          "/assets/product/product-feature-2.png",
          "/assets/product/product-feature-3.png",
          "/assets/product/product-feature-4.png",
        ];
        const imageIndex = index % productImages.length;
        return (
          <div key={index} className="my-4 sm:my-6">
            <img
              src={productImages[imageIndex]}
              alt={block.caption || "Blog image"}
              className="rounded-lg sm:rounded-xl w-full max-h-[250px] sm:max-h-[350px] lg:max-h-[400px] object-cover"
            />
            {block.caption && (
              <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center italic">{block.caption}</p>
            )}
          </div>
        );
      case 'paragraph':
      default:
        return (
          <p key={index} className="text-base sm:text-lg lg:text-[18px] inter-font font-[400] text-gray-700 leading-relaxed">
            {block.content}
          </p>
        );
    }
  };

  if (loading) {
    return (
      <div className="w-full py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="flex items-center justify-center gap-3 py-12 sm:py-16 lg:py-20">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">Loading blog…</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-full py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="text-gray-500 mb-4 text-sm sm:text-base">{error || "Blog not found"}</div>
            <Link href="/resources" className="text-blue-600 hover:underline text-sm sm:text-base cursor-pointer">
              ← Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 sm:gap-8 lg:gap-10">
        {/* LEFT COLUMN - ALL TEXT CONTENT */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* TAG */}
          {blog.tags && blog.tags.length > 0 ? (
            <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-md inline-block">
              {blog.tags[0]}
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-md inline-block">
              Article
            </span>
          )}

          {/* TITLE */}
          <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-[36px] axiforma font-bold text-gray-900 leading-tight">
            {blog.title}
          </h1>

          {/* AUTHOR + DATE */}
          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 flex-wrap">
            {blog.authorImage ? (
              <img
                src={imgErrors['author'] ? PLACEHOLDER_IMAGE : "/assets/product/product-card-3.png"}
                width={32}
                height={32}
                alt={blog.authorName}
                className="rounded-full w-7 h-7 sm:w-8 sm:h-8 object-cover"
                onError={() => handleImageError('author')}
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm text-gray-600">
                {blog.authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="text-xs sm:text-sm inter-font font-[500] text-gray-700">{blog.authorName}</p>
            {(blog.publishedAt || blog.createdAt) && (
              <>
                <span className="text-gray-400 text-xs sm:text-sm">•</span>
                <p className="text-xs sm:text-sm inter-font font-[400] text-gray-500">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </p>
              </>
            )}
          </div>

          {/* EXCERPT */}
          {blog.excerpt && (
            <p className="mt-4 sm:mt-5 lg:mt-6 text-base sm:text-lg lg:text-[18px] inter-font font-[400] text-gray-600 italic leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* TEXT CONTENT */}
          <div className="mt-4 sm:mt-5 lg:mt-6 space-y-4 sm:space-y-5 lg:space-y-6 text-gray-700 leading-relaxed">
            {typeof blog.content === 'string' ? (
              // Render HTML content directly - replace all images with product images
              <div
                className="prose max-w-none prose-headings:mt-4 sm:prose-headings:mt-5 lg:prose-headings:mt-6 prose-headings:mb-3 sm:prose-headings:mb-4 prose-p:mb-3 sm:prose-p:mb-4 prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:w-full prose-img:my-4 sm:prose-img:my-5 lg:prose-img:my-6 prose-a:text-blue-600 prose-a:underline prose-strong:font-bold prose-em:italic inter-font text-base sm:text-lg lg:text-[18px] font-[400] leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const productImages = [
                      "/assets/product/product-card-1.png",
                      "/assets/product/product-card-2.png",
                      "/assets/product/product-card-3.png",
                      "/assets/product/product-card-4.png",
                      "/assets/product/product-card-5.png",
                      "/assets/product/product-card-6.png",
                      "/assets/product/product-feature-1.png",
                      "/assets/product/product-feature-2.png",
                      "/assets/product/product-feature-3.png",
                      "/assets/product/product-feature-4.png",
                    ];
                    let imageCounter = 0;
                    return blog.content.replace(
                      /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
                      (match, src) => {
                        // Replace all images (except data URIs) with product images
                        if (src && !src.startsWith('data:')) {
                          const replacementImage = productImages[imageCounter % productImages.length];
                          imageCounter++;
                          return match.replace(src, replacementImage);
                        }
                        return match;
                      }
                    );
                  })()
                }}
              />
            ) : (
              // Render legacy ContentBlock array - images already replaced in renderContentBlock
              blog.content
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((block, idx) => renderContentBlock(block, idx))
            )}
          </div>

          {/* TAGS */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-6 sm:mt-7 lg:mt-8 pt-4 sm:pt-5 lg:pt-6 border-t">
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-600 text-xs px-2.5 sm:px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - RECENT BLOGS */}
        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
          <button className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-md cursor-pointer">
            Recent Blogs
          </button>

          {recentBlogs.length === 0 ? (
            <p className="text-gray-500 text-xs sm:text-sm">No recent blogs available</p>
          ) : (
            recentBlogs.map((recentBlog) => (
              <Link
                key={recentBlog._id}
                href={`/resources/blogs/${recentBlog.slug}`}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm block hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={imgErrors[`recent-${recentBlog._id}`] ? PLACEHOLDER_IMAGE : "/assets/product/product-card-1.png"}
                  width={400}
                  height={250}
                  alt={recentBlog.title}
                  className="rounded-md sm:rounded-lg w-full h-[120px] sm:h-[140px] lg:h-[150px] object-cover"
                  onError={() => handleImageError(`recent-${recentBlog._id}`)}
                />
                {recentBlog.tags && recentBlog.tags.length > 0 ? (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2.5 sm:px-3 py-1 rounded-md mt-2 sm:mt-3 inline-block">
                    {recentBlog.tags[0]}
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2.5 sm:px-3 py-1 rounded-md mt-2 sm:mt-3 inline-block">
                    Article
                  </span>
                )}
                <h3 className="mt-2 text-sm sm:text-[15px] axiforma font-bold leading-tight text-gray-900">
                  {recentBlog.title}
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
                  {recentBlog.authorImage ? (
                    <img
                      src={imgErrors[`recent-author-${recentBlog._id}`] ? PLACEHOLDER_IMAGE : "/assets/product/product-card-4.png"}
                      width={26}
                      height={26}
                      alt={recentBlog.authorName}
                      className="rounded-full w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] object-cover"
                      onError={() => handleImageError(`recent-author-${recentBlog._id}`)}
                    />
                  ) : (
                    <div className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] rounded-full bg-gray-200 flex items-center justify-center text-[10px] sm:text-xs text-gray-600">
                      {recentBlog.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <p className="text-[11px] sm:text-xs inter-font font-[500] text-gray-700">{recentBlog.authorName}</p>
                  {(recentBlog.publishedAt || recentBlog.createdAt) && (
                    <>
                      <span className="text-gray-400 text-[11px] sm:text-xs">•</span>
                      <p className="text-[11px] sm:text-xs inter-font font-[400] text-gray-500">
                        {formatDate(recentBlog.publishedAt || recentBlog.createdAt)}
                      </p>
                    </>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* BLOG INSIGHTS SECTION - Full Width */}
      {recentBlogs.length > 0 && (
        <div className="w-full py-10 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
            {/* Header Section */}
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-[35px] axiforma font-bold text-gray-900">
                Insights from our latest blogs
              </h2>
              <p className="text-sm sm:text-base lg:text-[16px] inter-font font-[400] text-gray-600 leading-relaxed">
                Stay updated with the latest trends, innovations, and expert insights in the manufacturing and industrial sectors
              </p>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {recentBlogs.slice(0, 4).map((insightBlog) => (
                <Link
                  key={insightBlog._id}
                  href={`/resources/blogs/${insightBlog.slug}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <Image
                      src={imgErrors[`insight-${insightBlog._id}`] ? PLACEHOLDER_IMAGE : "/assets/product/product-card-2.png"}
                      alt={insightBlog.title}
                      width={400}
                      height={300}
                      className="w-full h-36 sm:h-44 lg:h-48 object-cover"
                      onError={() => handleImageError(`insight-${insightBlog._id}`)}
                    />
                    {insightBlog.tags && insightBlog.tags.length > 0 && (
                      <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gray-800 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                        {insightBlog.tags[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 lg:p-5">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                      {formatDate(insightBlog.publishedAt || insightBlog.createdAt)}
                    </p>
                    <h3 className="mb-2 sm:mb-3 text-base sm:text-lg lg:text-[20px] axiforma font-bold text-gray-900 leading-tight">
                      {insightBlog.title}
                    </h3>
                    {insightBlog.excerpt && (
                      <p className="line-clamp-3 text-xs sm:text-sm lg:text-[14px] inter-font font-[400] text-gray-600 leading-relaxed">
                        {insightBlog.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <NewsletterSubscribe />
    </div>
  );
}