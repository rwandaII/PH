"use client";

import { useState } from "react";
import { videoSource } from "@/lib/video";

/**
 * Plays a story's video: an uploaded file, or a YouTube / Vimeo / Facebook link. Made for slow
 * connections: nothing heavy loads until the visitor presses play (an uploaded file only loads
 * its first frame details; an online video shows a picture and a play button, and its player
 * is loaded on the first press).
 */
export function VideoPlayer({
  file,
  link,
  poster,
  title,
}: {
  file?: string | null;
  link?: string;
  poster?: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const online = !file ? videoSource(link ?? "") : null;
  const src = file ?? (online?.kind === "file" ? online.src : null);

  if (src) {
    return (
      <div className="overflow-hidden rounded-[18px] bg-black shadow-[0_30px_60px_-30px_rgba(0,20,50,.8)]">
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster ?? undefined}
          className="block aspect-video w-full bg-black"
          aria-label={`Video: ${title}`}
        >
          <source src={src} />
          Your browser cannot play this video. <a href={src}>Download it</a> instead.
        </video>
      </div>
    );
  }
  if (!online || online.kind === "file") return null;

  const cover = online.kind === "youtube" ? online.thumbnail : (poster ?? null);

  return (
    <div className="relative overflow-hidden rounded-[18px] bg-navy shadow-[0_30px_60px_-30px_rgba(0,20,50,.8)]">
      {playing ? (
        <iframe
          src={online.embed}
          title={`Video: ${title}`}
          className="block aspect-video w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play the video: ${title}`}
          className="group relative block aspect-video w-full"
        >
          {cover ? (
            <img src={cover} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#0077b6,#012a4a)]" />
          )}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#011a3a]/70 via-transparent to-transparent" />
          <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-accent shadow-[0_12px_30px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:scale-110">
            <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
              <path d="M3 2l21 13L3 28z" fill="currentColor" />
            </svg>
          </span>
          <span className="absolute bottom-4 left-5 right-5 text-left text-[14px] font-semibold text-white">
            Play the video{online.kind === "youtube" ? " (YouTube)" : online.kind === "vimeo" ? " (Vimeo)" : " (Facebook)"}
          </span>
        </button>
      )}
    </div>
  );
}
