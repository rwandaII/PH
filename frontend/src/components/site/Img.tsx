"use client";

import { getImageProps } from "next/image";
import { useState } from "react";

/** Photos the Next.js image optimizer may resize (see images.localPatterns in next.config.ts). */
const FALLBACK = "/logo/placeholder.jpg";
const OPTIMIZABLE = /^\/(photos|uploads|certificates|illustrations|logo)\/[^?]+\.(jpe?g|png|webp)$/i;

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  /** Above the fold (page headers): load straight away with high priority. */
  priority?: boolean;
};

/**
 * A drop-in for <img> on the public site. Photos are served through the Next.js image
 * optimizer: resized to what the screen needs (srcset + sizes) and converted to WebP, so a
 * thumbnail no longer downloads an 1800px JPEG. Off-screen pictures load lazily and every
 * picture decodes off the main thread. SVGs and other files pass through unchanged. A picture
 * that fails to load is replaced by the programme's logo.
 *
 * `sizes` defaults to full width for pictures that fill their box (class "inset-0" or
 * "h-full w-full"), and to about half the screen otherwise; pass it for anything smaller.
 */
export function Img({ src, sizes, priority = false, alt = "", loading, className, onError, ...rest }: Props) {
  // If a picture cannot load (removed, or the connection dropped), show the logo instead of a
  // broken-image icon.
  const [failed, setFailed] = useState(false);
  const url = failed ? FALLBACK : (src ?? "");
  const lazy = loading ?? (priority ? "eager" : "lazy");
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!failed && url !== FALLBACK) setFailed(true);
    onError?.(e);
  };
  if (!OPTIMIZABLE.test(url)) {
    return <img src={url} alt={alt} loading={lazy} decoding="async" className={className} onError={handleError} {...rest} />;
  }
  const fills = /\binset-0\b|\bh-full\b.*\bw-full\b|\bw-full\b.*\bh-full\b/.test(className ?? "");
  const wanted = sizes ?? (fills ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 640px");
  const { props } = getImageProps({ src: url, alt, fill: true, sizes: wanted, quality: 75 });
  return (
    <img
      src={props.src}
      srcSet={props.srcSet}
      sizes={props.sizes}
      alt={alt}
      loading={lazy}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
}
