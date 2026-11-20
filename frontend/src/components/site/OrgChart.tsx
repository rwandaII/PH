import { teamHref, type TeamCategory } from "@/lib/team-categories";

/**
 * The Hydraulic Programme's organisational chart (Figure 1 of the programme's
 * "Expression of interest for partnership with WaterAid Rwanda", November 2026), drawn in HTML
 * so it stays sharp and readable on phones: the chain of authority on top, the three branches
 * side by side (stacked on small screens), then the field team and the people it serves.
 *
 * A box whose category has people in the team links to them in the "Our team" section;
 * boxes nobody has been placed in yet stay plain text.
 */

const box = "block border px-3 py-2.5 text-center text-[12.5px] font-semibold leading-[1.25]";
const top = `${box} border-navy bg-navy text-white`;
const lead = `${box} border-accent bg-band text-white`;
const unit = `${box} border-[#c9dcea] bg-white text-navy`;
const green = `${box} border-[#2f6b4f] bg-[#2f6b4f] text-white`;
const dorwasa = `${box} border-[#9cc7ad] bg-[#e7f3ec] text-[#1f4d37]`;
const plain = `${box} border-[#c9dcea] border-dashed bg-white text-navy`;

type Counts = Partial<Record<TeamCategory, number>>;

function Down() {
  return <span aria-hidden="true" className="mx-auto block h-6 w-[3px] rounded-full bg-navy" />;
}

/** One box of the chart; a link to the people in it when there are any. */
function Box({ cat, counts, className, children }: { cat?: TeamCategory; counts: Counts; className: string; children: React.ReactNode }) {
  const n = cat ? (counts[cat] ?? 0) : 0;
  if (!cat || n === 0) return <span className={className}>{children}</span>;
  return (
    <a
      href={teamHref(cat)}
      className={`${className} group transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-12px_rgba(0,30,70,.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      {children}
      <span className="mt-1 block text-[11px] font-normal underline-offset-2 opacity-80 group-hover:underline">
        View {n === 1 ? "1 person" : `${n} people`}
      </span>
    </a>
  );
}

export function OrgChart({ counts = {} }: { counts?: Counts }) {
  return (
    <figure className="mt-12">
      <div className="bg-mist px-4 py-10 sm:px-8">
        <ol className="mx-auto max-w-[340px]" aria-label="Line of authority">
          <li><span className={top}>Catholic Diocese of Ruhengeri</span></li>
          <li aria-hidden="true"><Down /></li>
          <li><Box cat="management-board" counts={counts} className={top}>Management Board</Box></li>
          <li aria-hidden="true"><Down /></li>
          <li><Box cat="coordinator" counts={counts} className={top}>PH Coordinator</Box></li>
        </ol>
        <Down />

        {/* The three branches under the coordinator */}
        <div className="relative mx-auto max-w-[1000px]">
          <span aria-hidden="true" className="absolute left-[calc((100%-3rem)/6)] right-[calc((100%-3rem)/6)] top-0 hidden h-[3px] -translate-y-px rounded-full bg-navy lg:block" />
          <ul className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            <li className="relative lg:pt-6">
              <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-6 w-[3px] -translate-x-1/2 rounded-full bg-navy lg:block" />
              <Box cat="admin-finance" counts={counts} className={lead}>Administrative and Financial Director</Box>
              <Down />
              <ul className="grid grid-cols-2 gap-2">
                <li><Box cat="drivers-cleaners" counts={counts} className={unit}>Driver and cleaners</Box></li>
                <li><Box cat="cashier" counts={counts} className={unit}>Cashier</Box></li>
              </ul>
            </li>

            <li className="relative lg:pt-6">
              <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-6 w-[3px] -translate-x-1/2 rounded-full bg-navy lg:block" />
              <Box cat="project-assistants" counts={counts} className={lead}>Technical Project Assistants</Box>
              <Down />
              <ul className="grid grid-cols-2 gap-2">
                <li><Box cat="civil-engineers" counts={counts} className={unit}>Civil engineers</Box></li>
                <li><Box cat="technical-director" counts={counts} className={unit}>Technical Director</Box></li>
              </ul>
              <p className="mt-3 text-center text-[12px] text-muted">Under the Technical Director:</p>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                <li><Box cat="site-technicians" counts={counts} className={unit}>Site technicians</Box></li>
                <li><Box cat="plumbers-masons" counts={counts} className={unit}>Plumbers and masonry workers</Box></li>
                <li><Box cat="field-technician" counts={counts} className={unit}>Field technician</Box></li>
                <li><Box cat="supervisors" counts={counts} className={unit}>Three supervisors</Box></li>
              </ul>
            </li>

            <li className="relative lg:pt-6">
              <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-6 w-[3px] -translate-x-1/2 rounded-full bg-navy lg:block" />
              <Box cat="dorwasa" counts={counts} className={dorwasa}>Managing Director, DORWASA Ltd.</Box>
              <p className="mt-3 text-center text-[12.5px] leading-[1.5] text-muted">
                DORWASA Ltd. is the company the programme set up to manage community water supply services. It works with the technical team.
              </p>
            </li>
          </ul>
        </div>

        <div className="mx-auto mt-8 max-w-[340px]">
          <p className="mb-2 text-center text-[12px] text-muted">The supervisors lead:</p>
          <Box cat="extensionists" counts={counts} className={green}>10 field extensionists</Box>
          <Down />
          <span className={plain}>Target groups and beneficiaries</span>
        </div>
      </div>
      <figcaption className="mt-3 text-[12.5px] text-grey">
        Organisational chart of the Hydraulic Programme. Choose a box to see the people who work there.
      </figcaption>
    </figure>
  );
}
