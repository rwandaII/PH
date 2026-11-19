import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chevron } from "@/components/site/icons";
import { WithPageNav, type PageNavItem } from "@/components/site/PageNav";
import { FactsBand, FramedPhoto, ProgramHero } from "@/components/site/ProgramLayout";
import { STATUS_LABEL } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { getPublicOr, getSite } from "@/lib/server-api";
import type { Project, ProjectSummary } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

const getProject = async (slug: string) => getPublicOr<Project | null>(`/projects/${encodeURIComponent(slug)}`, null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary || undefined,
    openGraph: project.coverImage ? { images: [project.coverImage] } : undefined,
  };
}

/** Split the story's HTML into its text and its photos, so the photos can get their own section. */
function splitContent(html: string): { text: string; photos: string[] } {
  const photos = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"[^>]*>/g)].map((m) => m[1]);
  const text = html
    .replace(/<img[^>]*>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
  return { text, photos };
}

/** One project, laid out like ALU's programme page. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, all, site] = await Promise.all([getProject(slug), getPublicOr<ProjectSummary[]>("/projects", []), getSite()]);
  if (!project) notFound();

  const cover = imageOr(project.coverImage, project.id);
  const { text, photos } = splitContent(project.content);
  const framedPhoto = photos.find((p) => p !== project.coverImage) ?? cover;
  const gallery = photos.filter((p) => p !== framedPhoto);
  const others = all.filter((p) => p.slug !== project.slug).slice(0, 3);

  const nav: PageNavItem[] = [{ id: "about", label: "About this project" }];
  if (gallery.length > 0) nav.push({ id: "photos", label: "Photos from the field" });
  if (others.length > 0) nav.push({ id: "more", label: "Other projects" });

  return (
    <>
      <ProgramHero title={project.title} subtitle={`A project of the ${site.programName}`} place={project.location || "Ruhengeri Diocese"} text={project.summary} image={cover} />

      <WithPageNav items={nav} action={{ href: "/contact", label: "Support this project" }}>
        <FactsBand
          facts={[
            { label: "Status", value: STATUS_LABEL[project.status], big: true },
            { label: "Where", value: project.location || "Ruhengeri Diocese" },
            { label: "Part of", value: "Ruhengeri Diocese's Pastoral Strategic Plan 2015–2035, human development pillar" },
          ]}
        />

        <section id="about" className="scroll-mt-6 bg-white">
          <div className="mx-auto grid max-w-[1172px] items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:gap-20 lg:py-[110px]">
            <div>
              <h2 className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">About this project</h2>
              <div className="richtext mt-7 max-w-[60ch]" dangerouslySetInnerHTML={{ __html: text }} />
            </div>
            <FramedPhoto src={framedPhoto} label={{ title: STATUS_LABEL[project.status], text: project.location || "Ruhengeri Diocese" }} />
          </div>
        </section>

        {gallery.length > 0 && (
          <section id="photos" className="scroll-mt-6 bg-navy text-white">
            <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[96px] lg:pr-[300px]">
              <h2 className="font-display text-[34px] font-normal leading-[1.05]">Photos from the field</h2>
              <div className={`mt-10 grid gap-4 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {gallery.map((src, i) => (
                  <img key={src} src={src} alt="" className={`block w-full object-cover ${gallery.length > 2 && i === 0 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"}`} />
                ))}
              </div>
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section id="more" className="scroll-mt-6 bg-[#3d5468]">
            <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[96px] lg:pr-[300px]">
              <h2 className="font-display text-[34px] font-normal leading-[1.05] text-white">Other projects</h2>
              <ul className="mt-10 grid gap-px bg-[#3d5468] sm:grid-cols-2 xl:grid-cols-3">
                {others.map((p) => (
                  <li key={p.id} className="bg-white">
                    <Link href={`/projects/${p.slug}`} className="group flex h-full flex-col px-5 pb-6 pt-6">
                      <span className="font-display text-[21px] leading-[1.15] text-navy group-hover:text-accent">{p.title}</span>
                      <span className="mt-4 border-b border-accent pb-2 text-[12.5px] font-semibold text-accent">
                        {STATUS_LABEL[p.status]}, {p.location || "Ruhengeri Diocese"}
                      </span>
                      {p.summary && <span className="mt-3 text-[13.5px] leading-[1.55] text-grey line-clamp-4">{p.summary}</span>}
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-semibold text-accent">
                        Read more <Chevron size={9} />
                      </span>
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
