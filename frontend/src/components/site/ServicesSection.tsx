import { Img } from "@/components/site/Img";
import Link from "next/link";
import { reveal } from "@/lib/reveal";
import type { Service } from "@/lib/services";
import { ArrowRight, Chevron } from "./icons";

/**
 * Home "Our services", in the layout of ALU's programmes block: a photo panel with the
 * section title, then one white column per service (title, summary, what it includes with
 * blue rules, and a Learn more button that opens the full explanation on the About page).
 */
/** `photo`: the picture beside the columns (Dashboard → Pictures & sliders, "Photo beside Our services"). */
export function ServicesSection({ services, photo }: { services: Service[]; photo: string }) {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-[linear-gradient(180deg,#0b4f6c_0%,#5b8fa8_16%,#e6f2f7_52%,#ffffff_82%)]">
      <div className="mx-auto max-w-[1172px] px-4 pb-[72px] pt-[110px]" {...reveal(0)}>
        <div className="flex flex-wrap bg-white shadow-[0_14px_40px_-12px_rgba(0,30,70,.25)]">
          <Link
            href="/about#services"
            className="zoom-host relative flex min-h-[520px] flex-[1_1_250px] flex-col justify-end overflow-hidden bg-deep px-[22px] pb-[20px] pt-5 text-white max-md:min-h-[300px]"
          >
            <span className="zoom absolute inset-0">
              <Img src={photo} alt="" sizes="(max-width: 768px) 100vw, 30vw" className="h-full w-full object-cover" />
            </span>
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,46,109,0)_30%,rgba(0,46,109,.92)_100%)]" />
            <h2 id="services-heading" className="font-display relative text-[40px] font-medium leading-[.95]">
              Our
              <br />
              services
            </h2>
            <span className="relative mt-3 text-sky">
              <ArrowRight size={16} />
            </span>
          </Link>

          {services.map((s) => (
            <div key={s.slug} className="lift-card flex flex-[1_1_220px] flex-col border-l border-line bg-white px-2.5 pb-2.5 pt-[42px] max-sm:border-l-0 max-sm:border-t">
              <div className="flex-1 px-3.5">
                <h3 className="text-[19px] font-semibold leading-[1.1] text-navy">{s.title}</h3>
                <p className="mt-4 text-[14.5px] leading-[1.45] text-ink">{s.summary}</p>
                <ul className="mt-6 text-[13px] text-ink">
                  {s.includes.map((item) => (
                    <li key={item} className="border-b border-accent pb-1.5 pt-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={`/about#service-${s.slug}`} className="btn-primary mt-[26px] flex min-h-[41px] items-center gap-4 px-[22px] text-[14px] font-semibold">
                <Chevron /> Learn more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
