/** How to play a story's video link: an embedded player, or a video file. */
export type VideoSource =
  | { kind: "youtube"; id: string; embed: string; thumbnail: string }
  | { kind: "vimeo"; embed: string }
  | { kind: "facebook"; embed: string }
  | { kind: "file"; src: string };

/** Understands YouTube, Vimeo and Facebook links and direct links to video files. */
export function videoSource(url: string): VideoSource | null {
  const u = url.trim();
  if (!u) return null;
  const yt =
    /youtu\.be\/([\w-]{6,})/.exec(u) ??
    /youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)([\w-]{6,})/.exec(u);
  if (yt) {
    const id = yt[1];
    return {
      kind: "youtube",
      id,
      // youtube-nocookie: no tracking cookies until the visitor presses play
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/.exec(u);
  if (vimeo) return { kind: "vimeo", embed: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&dnt=1` };
  if (/facebook\.com|fb\.watch/.test(u)) {
    return { kind: "facebook", embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false&autoplay=true` };
  }
  if (/\.(mp4|webm|mov|ogv)(\?|$)/i.test(u)) return { kind: "file", src: u };
  return null;
}

/** Does this story have a video (uploaded or linked)? */
export function hasVideo(item: { videoFile?: string | null; videoUrl?: string }): boolean {
  return !!item.videoFile || !!videoSource(item.videoUrl ?? "");
}
