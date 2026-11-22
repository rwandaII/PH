import Link from "next/link";
import { Chevron } from "./icons";

export interface HomeCardContent {
  title: string;
  text: string;
  button: string;
  /** A page of the site ("/partners") or a full address (https://...). Empty: no button. */
  link: string;
}

/**
 * The card on the home page beside the introduction (Dashboard → Home page card). The
 * dashboard draws its preview with this same component, so staff see exactly what the site shows.
 * `photo` is the picture element (the site uses the optimised <Img>, the preview a plain <img>).
 * In the preview the button is not a link.
 */
export function HomeCard({
  card,
  photo,
  preview = false,
  ...rest
}: { card: HomeCardContent; photo: React.ReactNode; preview?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { title, text, button, link } = card;
  const buttonClass = "btn-primary mt-[22px] flex min-h-[41px] items-center gap-4 px-[26px] text-[14px] font-semibold";
  const buttonBody = (
    <>
      <Chevron /> {button || "Read more"}
    </>
  );
  return (
    <div className="flex max-w-full flex-[0_0_342px] flex-col bg-[rgba(2,62,125,.88)] p-5 text-white" {...rest}>
      {photo}
      {title && <h2 className="mt-[22px] text-[18px] font-bold leading-[1.3]">{title}</h2>}
      {text && <p className="font-text mt-2.5 whitespace-pre-line text-[15.5px] leading-[1.27]">{text}</p>}
      {link &&
        (preview ? (
          <span className={buttonClass}>{buttonBody}</span>
        ) : /^https?:\/\//i.test(link) ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className={buttonClass}>
            {buttonBody}
          </a>
        ) : (
          <Link href={link} className={buttonClass}>
            {buttonBody}
          </Link>
        ))}
    </div>
  );
}

/** The card shows once it has a title or text. */
export function hasHomeCard(card: HomeCardContent): boolean {
  return Boolean(card.title.trim() || card.text.trim());
}
