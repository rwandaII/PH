import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { getResource } from "@/lib/dashboard/resources";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const def = getResource((await params).resource);
  if (!def) notFound();
  return <ResourceForm resource={def.key} />;
}
