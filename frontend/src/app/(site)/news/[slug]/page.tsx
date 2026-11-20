import { Img } from "@/components/site/Img";
import { HeaderSlides } from "@/components/site/HeaderSlides";
import { VideoPlayer } from "@/components/site/VideoPlayer";
import { hasVideo } from "@/lib/video";
import type { Metadata } from "next";
import { TechLines } from "@/components/site/TechLines";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comments } from "@/components/site/Comments";
import { Chevron } from "@/components/site/icons";
import { WithPageNav, type PageNavItem } from "@/components/site/PageNav";
import { PhotoViewer } from "@/components/site/PhotoViewer";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { ShareLinks } from "@/components/site/ShareLinks";
import { readingMinutes, splitContent } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { getPublicOr } from "@/lib/server-api";
import type { NewsComment, NewsItem, NewsSummary } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

const getItem = async (slug: string) => getPublicOr<NewsItem | null>(`/news/${encodeURIComponent(slug)}`, null);

/** Build every published page ahead of time so it opens instantly; new ones are built on first visit. */
export async function generateStaticParams() {
  const { items } = await getPublicOr<{ items: { slug: string }[] }>("/news?page=1&limit=50", { items: [] });
  return items.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getItem((await params).slug);
  if (!item) return { title: "Story not found" };
  return {
    title: item.title,
    description: item.excerpt || undefined,
    openGraph: item.coverImage ? { images: [item.coverImage] } : undefined,
  };
}

/** One news story: full-photo cover, the text, its photos, readers' comments, then more stories. */
export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const [item, list, comments] = await Promise.all([
    getItem(slug),
    getPublicOr<{ items: NewsSummary[] }>("/news?limit=50", { items: [] }),
    getPublicOr<NewsComment[]>(`/news/${encodeURIComponent(slug)}/comments`, []),
  ]);
  if (!item) notFound();

  const cover = imageOr(item.coverImage);
  const { text, photos: inText } = splitContent(item.content);
  const photos = [...new Set([...(item.coverImage ? [item.coverImage] : []), ...inText])];
  const minutes = readingMinutes(item.content);
  const more = list.items.filter((n) => n.slug !== item.slug).slice(0, 3);

  const nav: PageNavItem[] = [{ id: "story", label: "The story" }];
  const withVideo = hasVideo(item);
  if (withVideo) nav.push({ id: "video", label: "Video" });
  if (photos.length > 0) nav.push({ id: "photos", label: `Photos (${photos.length})` });
  nav.push({ id: "comments", label: comments.length > 0 ? `Comments (${comments.length})` : "Comments" });
  if (more.length > 0) nav.push({ id: "more", label: "Keep reading" });

  return (
    <>
      <ReadingProgress targetId="story" />

      {/* Cover: the story's photo across the screen, title on a navy fade */}
      <section className="relative flex min-h-[520px] items-end overflow-hidden bg-navy text-white lg:min-h-[640px]">
        <HeaderSlides images={[cover, ...photos.filter((p) => p !== cover)].slice(0, 6)} controlsClassName="bottom-5 right-5" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,29,71,.25)_0%,rgba(0,29,71,.15)_35%,rgba(0,29,71,.85)_75%,rgba(0,29,71,.96)_100%)]" />
        <TechLines right="soft" />
        <div className="banner-in relative mx-auto w-full max-w-[1172px] px-4 pb-14 pt-32 lg:pb-[120px] lg:pr-[300px]">
          <Link href="/news" className="inline-flex min-h-9 items-center gap-2.5 text-[13.5px] font-semibold text-sky hover:text-white">
            <Chevron size={9} className="rotate-180" /> News from the field
          </Link>
          <h1 className="font-display mt-3 max-w-[22ch] text-[36px] font-normal leading-[1.08] sm:text-[52px]">{item.title}</h1>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-[13.5px] text-white/85">
            <time dateTime={item.publishedAt ?? undefined}>{formatDate(item.publishedAt)}</time>
            <span>{minutes} min read</span>
            {photos.length > 0 && <span>{photos.length} photos</span>}
            {comments.length > 0 && <span>{comments.length} comments</span>}
          </p>
        </div>
      </section>

      <WithPageNav items={nav} action={{ href: "/news", label: "All news" }}>
        <section id="story" className="scroll-mt-6 bg-white">
          <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
            <article className="max-w-[680px]">
              {item.excerpt && <p className="font-display text-[22px] leading-[1.45] text-navy sm:text-[25px]">{item.excerpt}</p>}
              <div className="story-text richtext mt-10" dangerouslySetInnerHTML={{ __html: text }} />
              <div className="mt-12 border-t border-[#bcd6e3] pt-6">
                <ShareLinks title={item.title} />
              </div>
            </article>
          </div>
        </section>

        {withVideo && (
          <section id="video" aria-labelledby="video-heading" className="scroll-mt-6 bg-mist">
            <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-20 lg:pr-[300px]">
              <h2 id="video-heading" className="font-display text-[30px] font-normal leading-[1.1] text-navy sm:text-[34px]">
                Watch the video
              </h2>
              <div className="mt-8 grid max-w-[820px] gap-8">
                {item.videoFile && <VideoPlayer file={item.videoFile} poster={item.coverImage} title={item.title} />}
                {item.videoUrl && <VideoPlayer link={item.videoUrl} poster={item.coverImage} title={item.title} />}
              </div>
            </div>
          </section>
        )}

        {photos.length > 0 && (
          <section id="photos" className="scroll-mt-6 bg-navy text-white">
            <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-[32px] font-normal leading-[1.1] sm:text-[36px]">Photos from this story</h2>
                <Link href="/gallery" className="text-[14px] font-semibold text-sky underline decoration-sky/40 underline-offset-[6px] hover:decoration-sky">
                  Open the photo gallery
                </Link>
              </div>
              <p className="mt-2 text-[14px] text-white/75">Choose a photo to see it full screen.</p>
              <div className="mt-8">
                <PhotoViewer photos={photos} label={item.title} dark />
              </div>
            </div>
          </section>
        )}

        <section className="bg-white">
          <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
            <div className="max-w-[680px]">
              <Comments slug={item.slug} initial={comments} />
            </div>
          </div>
        </section>

        {more.length > 0 && (
          <section id="more" className="scroll-mt-6 bg-mist">
            <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
              <h2 className="font-display text-[32px] font-normal leading-[1.1] text-navy sm:text-[36px]">Keep reading</h2>
              <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {more.map((n) => (
                  <li key={n.id}>
                    <Link href={`/news/${n.slug}`} className="zoom-host group block">
                      <span className="zoom block overflow-hidden">
                        <Img src={imageOr(n.coverImage)} alt="" loading="lazy" className="float-card block aspect-[3/2] w-full object-cover" />
                      </span>
                      <span className="mt-4 block text-[12.5px] text-muted">{formatDate(n.publishedAt)}</span>
                      <span className="font-display mt-1.5 block text-[20px] leading-[1.22] text-navy transition-colors group-hover:text-accent">{n.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </WithPageNav>
    </>
  );
}
