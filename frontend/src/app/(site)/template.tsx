/**
 * Re-created on every navigation (unlike the layout), so each page eases in when it opens.
 * See .page-in in globals.css; it is switched off for visitors who prefer less motion.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
