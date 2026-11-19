"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { useMemo, useState } from "react";

// Built once: Tiptap re-applies options whenever they change identity between renders.
const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
  // Keeps photos that are already inside a story (e.g. imported articles) when it is edited.
  Image.configure({ inline: false, allowBase64: false }),
];

/** Story editor: headings, bold, italic, lists, quotes and links. Emits HTML. */
export function RichTextEditor({
  id,
  value,
  onChange,
  labelledBy,
}: {
  id: string;
  value: string;
  onChange: (html: string) => void;
  labelledBy: string;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");
  // The starting content only; after that the editor owns the document.
  const [initialContent] = useState(value);
  const editorProps = useMemo(
    () => ({
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelledBy,
        class: "richtext min-h-[260px] px-[18px] py-4 focus:outline-none",
      },
    }),
    [id, labelledBy],
  );

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialContent,
    immediatelyRender: false,
    editorProps,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
          }
        : null,
  });

  // The state hook only reports after the first transaction, so don't wait for it.
  if (!editor) {
    return <div className="mt-2 min-h-[300px] border border-[#d6d6d6] bg-white" />;
  }

  const on = state ?? { h2: false, h3: false, bold: false, italic: false, bullet: false, ordered: false, quote: false, link: false };
  const chain = () => editor.chain().focus();
  const tools: { label: string; active: boolean; run: () => void; className?: string }[] = [
    { label: "Heading", active: on.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
    { label: "Subheading", active: on.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
    { label: "Bold", active: on.bold, run: () => chain().toggleBold().run(), className: "font-bold" },
    { label: "Italic", active: on.italic, run: () => chain().toggleItalic().run(), className: "italic" },
    { label: "Bullet list", active: on.bullet, run: () => chain().toggleBulletList().run() },
    { label: "Numbered list", active: on.ordered, run: () => chain().toggleOrderedList().run() },
    { label: "Quote", active: on.quote, run: () => chain().toggleBlockquote().run() },
  ];

  function applyLink(e: React.FormEvent) {
    e.preventDefault();
    const url = href.trim();
    if (!url) chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: /^https?:\/\//i.test(url) || url.startsWith("/") ? url : `https://${url}` }).run();
    setLinkOpen(false);
  }

  return (
    <div className="mt-2 border border-[#d6d6d6] bg-white focus-within:border-accent">
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap gap-0.5 border-b border-[#d6d6d6] bg-[#f6f6f7] p-1.5">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            aria-pressed={t.active}
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
            className={`min-h-9 px-2.5 text-[13px] ${t.className ?? "font-semibold"} ${t.active ? "bg-navy text-white" : "text-navy hover:bg-white"}`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={on.link}
          aria-expanded={linkOpen}
          onClick={() => {
            setHref((editor.getAttributes("link").href as string) ?? "");
            setLinkOpen((v) => !v);
          }}
          className={`min-h-9 px-2.5 text-[13px] font-semibold underline ${on.link ? "bg-navy text-white" : "text-accent hover:bg-white"}`}
        >
          Link
        </button>
      </div>

      {linkOpen && (
        <form onSubmit={applyLink} className="flex flex-wrap items-center gap-2 border-b border-[#d6d6d6] bg-[#fbfbfb] p-2">
          <label htmlFor={`${id}-link`} className="text-[13px] font-semibold text-navy">
            Link address
          </label>
          <input
            id={`${id}-link`}
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://… (leave empty to remove the link)"
            className="min-h-9 flex-1 border border-[#d6d6d6] px-2 text-[14px]"
            autoFocus
          />
          <button type="submit" className="btn-primary min-h-9 px-4 text-[12px] font-semibold">
            Apply
          </button>
          <button type="button" onClick={() => setLinkOpen(false)} className="min-h-9 px-2 text-[12px] font-semibold text-muted">
            Cancel
          </button>
        </form>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
