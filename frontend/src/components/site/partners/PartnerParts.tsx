import { Img } from "@/components/site/Img";
import type { Partner } from "@/lib/types";

/** "RURA (Rwanda Utilities Regulatory Authority)" → "RURA"; names without brackets stay whole. */
export function shortName(name: string) {
  const i = name.indexOf(" (");
  return i > 0 ? name.slice(0, i) : name;
}

/** "RURA (…)" → "RURA", "Diocese of Ruhengeri" → "DR", "Local Administrative Authorities (…)" → "LAA". */
export function monogram(name: string) {
  const short = shortName(name);
  const first = short.split(/[\s/]+/)[0];
  if (/^[A-Z]{2,7}$/.test(first)) return first;
  return short
    .split(/\s+/)
    .filter((w) => /^[A-ZÀ-Ý]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 3);
}

/** The office contacts, one per line. */
export const contactLines = (p: Partner) =>
  (p.contacts ?? "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

/** People to contact: "Name | Role" per line. */
export const contactPeople = (p: Partner) =>
  (p.contactPeople ?? "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...role] = line.split("|");
      return { name: name.trim(), role: role.join("|").trim() };
    });

/** The partner's logo on a white tile, or its monogram when there is no logo. */
export function PartnerLogo({ partner, className = "", sizes = "220px" }: { partner: Partner; className?: string; sizes?: string }) {
  return partner.logo ? (
    <Img src={partner.logo} alt={`${shortName(partner.name)} logo`} sizes={sizes} className={`max-h-full max-w-full object-contain ${className}`} />
  ) : (
    <span aria-hidden="true" className={`font-display font-semibold leading-none tracking-wide text-accent ${monogram(partner.name).length > 4 ? "text-[0.62em]" : ""} ${className}`}>
      {monogram(partner.name)}
    </span>
  );
}

/** Turns "Email: x@y" into a mail link and "Phone: …" into a tel: link; anything else stays text. */
function ContactLine({ line, tone }: { line: string; tone: "light" | "dark" }) {
  const email = line.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  const phone = /^phone/i.test(line) ? line.replace(/^phone:\s*/i, "") : null;
  const link = tone === "dark" ? "text-sky hover:text-white" : "text-accent hover:text-navy";
  if (email) {
    const before = line.slice(0, email.index);
    return (
      <>
        {before}
        <a href={`mailto:${email[0]}`} className={`break-all font-semibold underline-offset-2 hover:underline ${link}`}>
          {email[0]}
        </a>
      </>
    );
  }
  if (phone && /\d{3,}/.test(phone.replace(/[\s()]/g, ""))) {
    return (
      <>
        Phone:{" "}
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={`font-semibold underline-offset-2 hover:underline ${link}`}>
          {phone}
        </a>
      </>
    );
  }
  return <>{line}</>;
}

/** The partner's reference: office contacts and the people to contact. */
export function PartnerReference({ partner, tone = "light" }: { partner: Partner; tone?: "light" | "dark" }) {
  const contacts = contactLines(partner);
  const people = contactPeople(partner);
  if (contacts.length === 0 && people.length === 0) {
    return <p className={`text-[13.5px] ${tone === "dark" ? "text-white/65" : "text-muted"}`}>No reference details listed.</p>;
  }
  const label = tone === "dark" ? "text-[#90e0ef]" : "text-accent";
  const body = tone === "dark" ? "text-white/85" : "text-ink";
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {contacts.length > 0 && (
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[.14em] ${label}`}>Office</p>
          <ul className={`mt-2 space-y-1.5 text-[13.5px] leading-[1.5] ${body}`}>
            {contacts.map((c) => (
              <li key={c}>
                <ContactLine line={c} tone={tone} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {people.length > 0 && (
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[.14em] ${label}`}>{people.length > 1 ? "Contact people" : "Contact person"}</p>
          <ul className={`mt-2 space-y-2.5 text-[13.5px] leading-[1.45] ${body}`}>
            {people.map((p) => (
              <li key={p.name}>
                <span className="block font-semibold">{p.name}</span>
                {p.role && <span className={tone === "dark" ? "text-white/65" : "text-muted"}>{p.role}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** "Visit website" link that opens in a new tab. */
export function WebsiteLink({ partner, tone = "light" }: { partner: Partner; tone?: "light" | "dark" }) {
  if (!partner.websiteUrl) return null;
  const host = partner.websiteUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
  return (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/web inline-flex min-h-10 items-center gap-2.5 border px-4 text-[12.5px] font-bold transition-colors ${
        tone === "dark" ? "border-white/35 text-white hover:border-[#90e0ef] hover:bg-[#90e0ef] hover:text-navy" : "border-accent text-accent hover:bg-accent hover:text-white"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" />
      </svg>
      {host}
      <span className="sr-only">(opens in a new tab)</span>
      <span aria-hidden="true" className="transition-transform group-hover/web:translate-x-0.5">
        ↗
      </span>
    </a>
  );
}
