import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { getResource } from "@/lib/dashboard/resources";

export default async function EditResourcePage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  const def = getResource(resource);
  const numericId = Number(id);
  if (!def || !Number.isInteger(numericId) || numericId < 1) notFound();
  return <ResourceForm resource={def.key} id={numericId} />;
}
