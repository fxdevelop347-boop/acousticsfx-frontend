"use client";

import Image, { type ImageProps } from "next/image";

import imageKitLoader, { isImageKitSrc } from "@/lib/image-loader";

/**
 * Drop-in replacement for `next/image` — same props, same behaviour, except
 * ImageKit URLs are resized by ImageKit instead of by our own server.
 *
 * A `loader` prop is a function, so it cannot cross a Server Component
 * boundary ("Functions cannot be passed directly to Client Components").
 * That is why this wrapper is a Client Component; the `<img>` itself still
 * renders on the server.
 */
export default function SmartImage({ unoptimized, ...props }: ImageProps) {
  if (isImageKitSrc(props.src)) {
    // `unoptimized` is deliberately dropped here: it would bypass the loader
    // and ship ImageKit's full-size original.
    return <Image {...props} loader={imageKitLoader} />;
  }

  return <Image {...props} unoptimized={unoptimized} />;
}
