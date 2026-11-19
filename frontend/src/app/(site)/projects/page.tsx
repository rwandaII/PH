import type { Metadata } from "next";
import { WithPageNav } from "@/components/site/PageNav";
import { FactsBand, FramedPhoto, OutlineLink, ProgramHero } from "@/components/site/ProgramLayout";
import { STATUS_LABEL } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { getPublicOr, getSite } from "@/lib/server-api";
import type { ProjectSummary } from "@/lib/types";

export const metadata: Metadata = { title: "Projects" };

/** Projects page in the style of ALU's programme page: photo header, facts band, then one
 *  section per project, all in the same design (text and a framed photo, sides alternating). */
export default async function ProjectsPage() {
  const [projects, site] = await Promise.all([getPublicOr<ProjectSummary[]>("/projects", []), getSite()]);
  const count = (s: ProjectSummary["status"]) => projects.filter((p) => p.status === s).length;

  return (
    <>
      <ProgramHero
        title="Our projects"
        subtitle={site.programName}
        place="Ruhengeri Diocese and beyond"
        text="Since 2007 the program has supplied water, promoted hygiene and sanitation and protected the environment, specifically for poor people living in remote areas."
        image={imageOr(projects[0]?.coverImage, 0)}
      />

      {projects.length === 0 ? (
        <p className="mx-auto max-w-[1172px] px-4 py-24 text-muted">No projects have been published yet.</p>
      ) : (
        <WithPageNav
          items={projects.map((p) => ({ id: p.slug, label: p.title }))}
          action={{ href: "/contact", label: "Support our work" }}
        >
          <FactsBand
            facts={[
              { label: "Areas of work", value: String(projects.length), big: true },
              { label: "In progress", value: String(count("ongoing")), big: true },
              { label: "Completed", value: String(count("completed")), big: true },
            ]}
          />

          {/* Every project in the same design: text and a framed photo, sides alternating */}
          {projects.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <section key={p.id} id={p.slug} className={`scroll-mt-6 ${flip ? "bg-mist" : "bg-white"}`}>
                <div className="mx-auto grid max-w-[1172px] items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:gap-20 lg:py-[100px]">
                  <div className={flip ? "lg:order-2" : ""}>
                    <ProjectText project={p} />
                  </div>
                  <FramedPhoto
                    src={imageOr(p.coverImage, p.id)}
                    side={flip ? "left" : "right"}
                    label={{ title: STATUS_LABEL[p.status], text: p.location || "Ruhengeri Diocese" }}
                  />
                </div>
              </section>
            );
          })}
        </WithPageNav>
      )}
    </>
  );
}

function ProjectText({ project: p }: { project: ProjectSummary }) {
  return (
    <>
      <h2 className="font-display text-[32px] font-normal leading-[1.05] text-navy sm:text-[36px]">{p.title}</h2>
      {p.summary && <p className="mt-6 max-w-[54ch] text-[15.5px] leading-[1.65] text-ink">{p.summary}</p>}
      <dl className="mt-7 grid max-w-[420px] grid-cols-2 gap-6 border-y border-[#bcd6e3] py-4 text-[13.5px] text-navy">
        <div>
          <dt className="text-muted">Where</dt>
          <dd className="mt-1 font-semibold">{p.location || "Ruhengeri Diocese"}</dd>
        </div>
        <div>
          <dt className="text-muted">Status</dt>
          <dd className="mt-1 font-semibold">{STATUS_LABEL[p.status]}</dd>
        </div>
      </dl>
      <OutlineLink href={`/projects/${p.slug}`}>Read about this project</OutlineLink>
    </>
  );
}
