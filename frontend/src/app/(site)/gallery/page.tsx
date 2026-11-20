import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/site/GalleryBrowser";
import { FactsBand, ProgramHero } from "@/components/site/ProgramLayout";
import { getPublicOr, getSite, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import type { GalleryAlbum } from "@/lib/types";

export const metadata: Metadata = {
  title: "Photo gallery",
  description:
    "Photos of water systems, trainings, schools and communities from the Hydraulic Programme of Ruhengeri Diocese.",
};

/** Every photo from the program's stories and projects, with what each one is about. */
export default async function GalleryPage() {
  const [albums, site, pics] = await Promise.all([getPublicOr<GalleryAlbum[]>("/gallery", []), getSite(), getSiteImages()]);
  const total = albums.reduce((n, a) => n + a.photos.length, 0);

  return (
    <>
      <ProgramHero
        title="Photo gallery"
        subtitle={site.programName}
        place="Ruhengeri Diocese"
        text="Photos from the program's work: water points, schools, trainings and community meetings. Choose any photo to see it full screen."
        images={picturesOr(pics, "gallery.header", [...new Set(albums.flatMap((a) => a.photos))].slice(0, 6))}
      />
      <FactsBand
        facts={[
          { label: "Photos", value: String(total), big: true },
          { label: "Stories", value: String(albums.filter((a) => a.kind === "news").length), big: true },
          { label: "Projects", value: String(albums.filter((a) => a.kind === "project").length), big: true },
        ]}
      />
      <section className="bg-white">
        <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24">
          {albums.length === 0 ? <p className="text-muted">No photos have been published yet.</p> : <GalleryBrowser albums={albums} />}
        </div>
      </section>
    </>
  );
}
