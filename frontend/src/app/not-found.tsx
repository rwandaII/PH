import Link from "next/link";
import { Chevron } from "@/components/site/icons";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b-[3px] border-accent bg-[linear-gradient(180deg,#03406f_0%,#012a4a_100%)] text-white">
        <div className="mx-auto max-w-[1172px] px-4 py-24">
          <p className="text-[13px] font-semibold tracking-[0.04em] text-white/70">Page not found</p>
          <h1 className="mt-3 text-[40px] font-medium leading-tight">This page does not exist</h1>
          <p className="font-text mt-4 max-w-xl text-[15px] text-white/80">
            The link may be old, or the page may have been removed.
          </p>
          <Link href="/" className="btn-primary mt-8 inline-flex min-h-11 items-center gap-4 px-7 text-[13px] font-semibold">
            <Chevron /> Go to the home page
          </Link>
        </div>
      </section>
    </main>
  );
}
