import type { Metadata } from "next";
import { TechLines } from "@/components/site/TechLines";
import Link from "next/link";
import { Chevron } from "@/components/site/icons";
import { WithPageNav } from "@/components/site/PageNav";
import { PhotoViewer } from "@/components/site/PhotoViewer";
import { formatDate } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { getPublicOr } from "@/lib/server-api";
import type { GalleryAlbum, NewsSummary } from "@/lib/types";

export const metadata: Metadata = { title: "News" };

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
  const [data, gallery] = await Promise.all([
    getPublicOr<NewsPage>(`/news?page=${requested}`, { items: [], page: 1, pages: 1, total: 0 }),
    getPublicOr<GalleryAlbum[]>("/gallery", []),
  ]);
  const photoCount = new Map(gallery.map((a) => [a.href, a.photos.length]));
  const lead = data.page === 1 ? data.items[0] : undefined;
  const rest = lead ? data.items.slice(1) : data.items;
  const strip = [...new Set(gallery.filter((a) => a.kind === "news").flatMap((a) => a.photos))].slice(0, 6);
  const count = (slug: string) => photoCount.get(`/news/${slug}`) ?? 0;

  return (
    <>
      {lead ? (
        /* Cover story */
        <section className="relative flex min-h-[560px] items-end overflow-hidden bg-navy text-white lg:min-h-[660px]">
          <img src={imageOr(lead.coverImage, lead.id)} alt="" className="hero-bg-in absolute inset-0 h-full w-full object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,29,71,.92)_0%,rgba(0,29,71,.7)_45%,rgba(0,29,71,.15)_80%),linear-gradient(0deg,rgba(0,29,71,.6),transparent_50%)]" />
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
          items={[{ id: "stories", label: "All stories" }, ...(strip.length > 0 ? [{ id: "photos", label: "From the gallery" }] : [])]}
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
                          <img src={imageOr(n.coverImage, n.id)} alt="" loading="lazy" className="block aspect-[4/3] w-full object-cover" />
                          {count(n.slug) > 1 && (
                            <span className="absolute bottom-3 left-3 bg-navy/85 px-2.5 py-1 text-[12px] font-semibold text-white">{count(n.slug)} photos</span>
                          )}
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
