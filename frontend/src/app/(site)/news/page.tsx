import { Img } from "@/components/site/Img";
import type { Metadata } from "next";
import { TechLines } from "@/components/site/TechLines";
import Link from "next/link";
import { Chevron } from "@/components/site/icons";
import { WithPageNav } from "@/components/site/PageNav";
import { PhotoViewer } from "@/components/site/PhotoViewer";
import { formatDate } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { getPublicOr, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import { HeaderSlides } from "@/components/site/HeaderSlides";
import { VideoPlayer } from "@/components/site/VideoPlayer";
import { hasVideo } from "@/lib/video";
import type { GalleryAlbum, NewsSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "News",
  description:
    "News from the field: stories about water, hygiene and sanitation, young people and the environment in north-western Rwanda.",
};

interface NewsPage {
  items: NewsSummary[];
  page: number;
  pages: number;
  total: number;
}

type Props = { searchParams: Promise<{ page?: string }> };

/** News: the latest story as a full-photo cover, then every story, then a strip of photos. */
export default async function NewsListPage({ searchParams }: Props) {
  const requested = Math.max(1, Number((await searchParams).page) || 1);
  const [data, gallery, pics] = await Promise.all([
    getPublicOr<NewsPage>(`/news?page=${requested}`, { items: [], page: 1, pages: 1, total: 0 }),
    getPublicOr<GalleryAlbum[]>("/gallery", []),
    getSiteImages(),
  ]);
  const photoCount = new Map(gallery.map((a) => [a.href, a.photos.length]));
  const lead = data.page === 1 ? data.items[0] : undefined;
  const rest = lead ? data.items.slice(1) : data.items;
  const strip = [...new Set(gallery.filter((a) => a.kind === "news").flatMap((a) => a.photos))].slice(0, 6);
  const count = (slug: string) => photoCount.get(`/news/${slug}`) ?? 0;
  const videos = data.items.filter(hasVideo);

  return (
    <>
      {lead ? (
        /* Cover story */
        <section className="relative flex min-h-[560px] items-end overflow-hidden bg-navy text-white lg:min-h-[660px]">
          <HeaderSlides images={picturesOr(pics, "news.header", [imageOr(lead.coverImage), ...data.items.slice(1).map((n) => n.coverImage).filter((c): c is string => !!c)].slice(0, 5))} controlsClassName="bottom-5 right-5" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,29,71,.92)_0%,rgba(0,29,71,.7)_45%,rgba(0,29,71,.15)_80%),linear-gradient(0deg,rgba(0,29,71,.6),transparent_50%)]" />
          <TechLines right="soft" />
          <div className="banner-in relative mx-auto w-full max-w-[1172px] px-4 pb-16 pt-28 lg:pb-[120px]">
            <p className="text-[14px] font-semibold text-sky">News from the field</p>
            <h1 className="font-display mt-3 max-w-[18ch] text-[38px] font-normal leading-[1.06] sm:text-[54px]">
              <Link href={`/news/${lead.slug}`} className="hover:text-sky">
                {lead.title}
              </Link>
            </h1>
            {lead.excerpt && <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-white/90">{lead.excerpt}</p>}
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[13.5px] text-white/75">
              <span>{formatDate(lead.publishedAt)}</span>
              {count(lead.slug) > 0 && <span>{count(lead.slug)} photos</span>}
            </p>
            <Link
              href={`/news/${lead.slug}`}
              className="mt-8 inline-flex min-h-12 items-center gap-3 bg-white px-7 text-[14px] font-semibold text-navy transition-colors hover:bg-sky"
            >
              Read the story <Chevron size={10} />
            </Link>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-navy text-white">
          <TechLines />
          <div className="relative mx-auto max-w-[1172px] px-4 pb-16 pt-20">
            <h1 className="font-display text-[44px] font-normal leading-[1.05]">News from the field</h1>
            <p className="mt-3 text-white/80">Page {data.page} of {data.pages}</p>
          </div>
        </section>
      )}

      {data.items.length === 0 ? (
        <p className="mx-auto max-w-[1172px] px-4 py-24 text-muted">No news has been published yet.</p>
      ) : (
        <WithPageNav
          items={[
            { id: "stories", label: "All stories" },
            ...(videos.length > 0 ? [{ id: "videos", label: `Videos (${videos.length})` }] : []),
            ...(strip.length > 0 ? [{ id: "photos", label: "From the gallery" }] : []),
          ]}
          action={{ href: "/contact", label: "Share news with us" }}
        >
          <section id="stories" className="scroll-mt-6 bg-white">
            <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
              <h2 className="font-display text-[32px] font-normal leading-[1.1] text-navy sm:text-[38px]">{lead ? "More stories" : "Stories"}</h2>
              <p className="mt-2 text-[15px] text-muted">
                {data.total} {data.total === 1 ? "story" : "stories"} about water, hygiene, young people and the environment.
              </p>

              {rest.length === 0 ? (
                <p className="mt-8 text-muted">More stories will appear here as they are published.</p>
              ) : (
                <ul className="mt-12 space-y-14">
                  {rest.map((n, i) => (
                    <li key={n.id}>
                      <Link href={`/news/${n.slug}`} className={`zoom-host group grid items-center gap-6 sm:gap-10 ${i % 2 ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : "sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"}`}>
                        <span className={`zoom relative block overflow-hidden ${i % 2 ? "sm:order-2" : ""}`}>
                          <Img src={imageOr(n.coverImage)} alt="" loading="lazy" className="block aspect-[4/3] w-full object-cover" />
                          <span className="absolute bottom-3 left-3 flex gap-1.5">
                            {hasVideo(n) && (
                              <span className="inline-flex items-center gap-1.5 bg-accent px-2.5 py-1 text-[12px] font-semibold text-white">
                                <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden="true">
                                  <path d="M1 1l7 4-7 4z" fill="currentColor" />
                                </svg>
                                Video
                              </span>
                            )}
                            {count(n.slug) > 1 && <span className="bg-navy/85 px-2.5 py-1 text-[12px] font-semibold text-white">{count(n.slug)} photos</span>}
                          </span>
                        </span>
                        <span className="block">
                          <span className="block text-[13px] text-muted">{formatDate(n.publishedAt)}</span>
                          <span className="font-display mt-2 block text-[24px] leading-[1.18] text-navy transition-colors group-hover:text-accent sm:text-[27px]">
                            {n.title}
                          </span>
                          {n.excerpt && <span className="mt-3 block text-[15px] leading-[1.65] text-ink">{n.excerpt}</span>}
                          <span className="mt-4 inline-flex items-center gap-2.5 text-[14px] font-semibold text-accent">
                            Read the story <Chevron size={10} />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {data.pages > 1 && (
                <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#bcd6e3] pt-6 text-[14px]">
                  {data.page > 1 && (
                    <Link href={`/news?page=${data.page - 1}`} className="font-semibold text-accent hover:text-accent-dark">
                      Newer stories
                    </Link>
                  )}
                  {data.page < data.pages && (
                    <Link href={`/news?page=${data.page + 1}`} className="font-semibold text-accent hover:text-accent-dark">
                      Older stories
                    </Link>
                  )}
                  <span className="text-muted">
                    Page {data.page} of {data.pages}
                  </span>
                </nav>
              )}
            </div>
          </section>

          {videos.length > 0 && (
            <section id="videos" aria-labelledby="videos-heading" className="scroll-mt-6 bg-mist">
              <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
                <h2 id="videos-heading" className="font-display text-[32px] font-normal leading-[1.1] text-navy sm:text-[36px]">
                  Videos
                </h2>
                <p className="mt-2 text-[15px] text-muted">Watch our work in the field. Press play on any video.</p>
                <ul className="mt-10 grid gap-10 md:grid-cols-2">
                  {videos.map((n) => (
                    <li key={n.id} className="lift-card bg-white p-3 pb-5">
                      <VideoPlayer file={n.videoFile} link={n.videoFile ? undefined : n.videoUrl} poster={n.coverImage} title={n.title} />
                      <Link href={`/news/${n.slug}`} className="mt-4 block px-2">
                        <span className="block text-[12.5px] text-muted">{formatDate(n.publishedAt)}</span>
                        <span className="font-display mt-1 block text-[20px] leading-[1.25] text-navy hover:text-accent">{n.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {strip.length > 0 && (
            <section id="photos" className="scroll-mt-6 bg-navy text-white">
              <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2 className="font-display text-[32px] font-normal leading-[1.1] sm:text-[36px]">From the gallery</h2>
                  <Link href="/gallery" className="inline-flex min-h-11 items-center gap-3 border border-white/70 px-5 text-[14px] font-semibold hover:bg-white hover:text-navy">
                    Open the photo gallery <Chevron size={10} />
                  </Link>
                </div>
                <div className="mt-8">
                  <PhotoViewer photos={strip} label="Photos from the news" layout="even" dark />
                </div>
              </div>
            </section>
          )}
        </WithPageNav>
      )}
    </>
  );
}
