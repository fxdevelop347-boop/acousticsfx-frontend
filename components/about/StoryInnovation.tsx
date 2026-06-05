"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, ScaleOnScroll } from "@/components/animations";

const CONTENT_KEYS = ["about.innovation.image", "about.innovation.video"];
/** Legacy seed path — file does not exist; prefer YouTube thumbnail when a video URL is set. */
const LEGACY_BROKEN_POSTER = "/innovation-video.jpg";

function youtubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function youtubeEmbedUrl(url: string): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
}

function youtubeThumbnail(url: string): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default function StoryInnovation() {
  const [content, setContent] = useState<ContentMap>({});
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => {
    fetchContent(CONTENT_KEYS).then(setContent).catch(console.error);
  }, []);

  useEffect(() => {
    setPosterFailed(false);
  }, [content]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [playing]);

  const innovationVideo = content["about.innovation.video"]?.value?.trim() ?? "";
  const customPoster = content["about.innovation.image"]?.value?.trim() ?? "";
  const hasVideo = innovationVideo.length > 0;
  const youtubeEmbed = hasVideo ? youtubeEmbedUrl(innovationVideo) : null;

  const posterSrc = useMemo(() => {
    const ytThumb = hasVideo ? youtubeThumbnail(innovationVideo) : null;
    const validCustomPoster =
      customPoster && customPoster !== LEGACY_BROKEN_POSTER ? customPoster : null;

    if (posterFailed) return ytThumb;
    if (validCustomPoster) return validCustomPoster;
    return ytThumb;
  }, [customPoster, hasVideo, innovationVideo, posterFailed]);

  const showPoster = Boolean(posterSrc);

  return (
    <section className="px-4 sm:px-[40px] lg:px-[100px] pt-10 pb-10 sm:pt-[80px] sm:pb-[80px] lg:pt-[100px] lg:pb-[100px] bg-[#F5F5F5]">
      {/* ================= Top Content ================= */}
      <FadeIn
        direction="up"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-14 lg:gap-20 items-start mb-8 sm:mb-14 lg:mb-16"
      >
        {/* Left Heading */}
        <div>
          <h2 className="text-[1.375rem] sm:text-[44px] lg:text-[60px] lato font-bold leading-tight sm:leading-[40px]">
            Our Story That Drives
          </h2>
          <h2 className="text-[2.25rem] sm:text-[72px] lg:text-[100px] font-bold lato text-[#ea8e39] mt-1 sm:mt-2 leading-none tracking-tight">
            INNOVATION
          </h2>
        </div>

        {/* Right Text */}
        <p className="text-gray-600 leading-relaxed lato font-normal text-sm sm:text-[18px] lg:text-[20px] max-w-xl">
          From a bold vision to an industry-leading brand, FX Acoustics has
          pioneered acoustic solutions that blend craftsmanship with cutting-edge
          technology &mdash; transforming how spaces sound and feel.
        </p>
      </FadeIn>

      {/* ================= Image / Video Section ================= */}
      <ScaleOnScroll className="relative w-full overflow-hidden rounded-lg mt-4 sm:mt-6">
        <div className="relative w-full h-[220px] sm:h-[400px] lg:h-[520px] bg-neutral-800">
          {showPoster ? (
            // eslint-disable-next-line @next/next/no-img-element -- CMS + YouTube thumbnails
            <img
              src={posterSrc!}
              alt="FX Acoustics innovation video preview"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setPosterFailed(true)}
            />
          ) : null}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Play Button */}
        {hasVideo ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            aria-label="Play video"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-white/80 flex items-center justify-center hover:scale-105 transition">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="ml-1"
                aria-hidden
              >
                <path d="M8 5v14l11-7-11-7z" fill="#111" />
              </svg>
            </div>
          </button>
        ) : null}
      </ScaleOnScroll>

      {playing && hasVideo ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
          onClick={() => setPlaying(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Innovation video"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="absolute -top-10 right-0 text-white text-sm hover:opacity-80 cursor-pointer"
              aria-label="Close video"
            >
              Close
            </button>
            {youtubeEmbed ? (
              <div className="relative w-full overflow-hidden rounded-lg pt-[56.25%]">
                <iframe
                  src={youtubeEmbed}
                  title="FX Acoustics innovation video"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={innovationVideo}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[80vh] rounded-lg bg-black"
              />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
