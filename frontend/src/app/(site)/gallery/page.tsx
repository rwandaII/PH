import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/site/GalleryBrowser";
import { FactsBand, ProgramHero } from "@/components/site/ProgramLayout";
import { getPublicOr, getSite } from "@/lib/server-api";
import type { GalleryAlbum } from "@/lib/types";

export const metadata: Metadata = { title: "Photo gallery" };

/** Every photo from the program's stories and projects, with what each one is about. */
export default async function GalleryPage() {
  const [albums, site] = await Promise.all([getPublicOr<GalleryAlbum[]>("/gallery", []), getSite()]);
  const total = albums.reduce((n, a) => n + a.photos.length, 0);

  return (
    <>
      <ProgramHero
        title="Photo gallery"
        subtitle={site.programName}
        place="Ruhengeri Diocese"
        text="Photos from the program's work: water points, schools, trainings and community meetings. Choose any photo to see it full screen."
        image={albums[0]?.photos[1] ?? albums[0]?.photos[0] ?? "/photos/field/school-welcome-2.jpg"}
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
