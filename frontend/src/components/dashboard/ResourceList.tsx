"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STATUS_LABEL } from "@/lib/format";
import { api, ApiError } from "@/lib/dashboard/api";
import { RESOURCES, type ResourceDef } from "@/lib/dashboard/resources";
import type { ProjectStatus } from "@/lib/types";
import { btnPrimary, ConfirmDelete, formatShortDate, Loading, Notice, PageHead } from "./ui";

type Row = Record<string, unknown> & { id: number };

export function ResourceList({ resource }: { resource: ResourceDef["key"] }) {
  const def = RESOURCES[resource];
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Row[]>(def.api)
      .then(setRows)
      .catch((e: ApiError) => setError(e.message));
  }, [def.api]);

  async function remove(id: number) {
    try {
      await api(`${def.api}/${id}`, { method: "DELETE" });
      setRows((r) => r?.filter((x) => x.id !== id) ?? null);
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  const titleKey = def.columns.find((c) => c.kind === "title")?.key ?? "title";

  return (
    <>
      <PageHead
        light="Manage"
        bold={`${def.label.toLowerCase()}.`}
        intro={def.intro}
        action={
          <Link href={`/dashboard/${def.key}/new`} className={btnPrimary}>
            {def.newLabel}
          </Link>
        }
      />

      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      <div className="relative mt-7 overflow-x-auto border border-line bg-white">
        {!rows ? (
          <div className="px-5">
            <Loading />
          </div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted">
            Nothing here yet.{" "}
            <Link href={`/dashboard/${def.key}/new`} className="font-semibold text-accent hover:underline">
              Add the first {def.singular}
            </Link>
            .
          </p>
        ) : (
          <table className="w-full min-w-[640px] border-collapse text-[14px]">
            <thead>
              <tr className="text-left text-[13px] font-semibold text-muted">
                {def.columns.map((c) => (
                  <th key={c.key} scope="col" className="border-b border-line px-5 py-3.5 font-semibold">
                    {c.kind === "image" ? <span className="sr-only">Image</span> : c.label}
                  </th>
                ))}
                <th scope="col" className="border-b border-line px-5 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const live = def.publicPath?.(row);
                return (
                  <tr key={row.id} className="border-b border-[#ececec] last:border-b-0 hover:bg-[#fafafa]">
                    {def.columns.map((c) => (
                      <td key={c.key} className="px-5 py-3.5 align-middle">
                        <Cell kind={c.kind} value={row[c.key]} href={c.key === titleKey ? `/dashboard/${def.key}/${row.id}` : undefined} />
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      {live && (
                        <a href={live} target="_blank" rel="noopener noreferrer" className="mr-4 text-[13px] font-semibold text-muted hover:text-navy">
                          View
                        </a>
                      )}
                      <Link href={`/dashboard/${def.key}/${row.id}`} className="mr-4 text-[13px] font-semibold text-navy hover:underline">
                        Edit
                      </Link>
                      <ConfirmDelete onConfirm={() => remove(row.id)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Cell({ kind, value, href }: { kind?: string; value: unknown; href?: string }) {
  switch (kind) {
    case "image":
      return value ? (
        <img src={String(value)} alt="" className="h-11 w-16 object-cover" />
      ) : (
        <span className="block h-11 w-16 bg-[#eef0f3]" aria-hidden="true" />
      );
    case "title":
      return href ? (
        <Link href={href} className="font-semibold text-navy hover:underline">
          {String(value ?? "")}
        </Link>
      ) : (
        <span className="font-semibold text-navy">{String(value ?? "")}</span>
      );
    case "published":
      return value ? (
        <span className="inline-block bg-[#e6edf6] px-2.5 py-0.5 text-[12px] font-semibold text-navy">Published</span>
      ) : (
        <span className="inline-block bg-[#eef1f4] px-2.5 py-0.5 text-[12px] font-semibold text-[#4a5560]">Draft</span>
      );
    case "date":
      return <span className="text-muted">{formatShortDate(value as string) || "Not yet"}</span>;
    case "status":
      return <span>{STATUS_LABEL[value as ProjectStatus] ?? String(value)}</span>;
    default:
      return <span className="text-muted">{String(value ?? "")}</span>;
  }
}
