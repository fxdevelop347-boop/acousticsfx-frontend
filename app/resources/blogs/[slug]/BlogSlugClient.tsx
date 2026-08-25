"use client";

import { use, useEffect, useState } from "react";
import { BlogArticlesHero, BlogDetailLayout } from "@/components/resources";
import ResourceEmptyState from "@/components/resources/ResourceEmptyState";
import Spinner from "@/components/shared/Spinner";
import { fetchBlogBySlug, type Blog } from "@/lib/blogs-api";

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Owns the fetch for the post. The hero above and the article body below both need
 * the same record, and each used to request it separately — two identical calls per
 * page view. Fetching once here and passing it down removes the duplicate.
 */
export default function BlogSlugClient({ params }: BlogSlugPageProps) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    fetchBlogBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setBlog(data);
        setStatus(data ? "ready" : "missing");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to fetch blog:", err);
        setStatus("missing");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "missing") {
    return (
      <ResourceEmptyState
        tone="error"
        title="We couldn't find that post"
        message="The article may have been moved or unpublished. Browse the rest of our writing, or get in touch and we'll point you to it."
      />
    );
  }

  return (
    <>
      <BlogArticlesHero
        blogTitle={blog?.title}
        isDetailPage={true}
        heroImage={blog?.heroImage}
      />

      <div className="relative z-10">
        {status === "loading" || !blog ? (
          <div className="flex items-center justify-center gap-3 py-16 sm:py-20">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">Loading blog…</span>
          </div>
        ) : (
          <BlogDetailLayout blog={blog} />
        )}
      </div>
    </>
  );
}
