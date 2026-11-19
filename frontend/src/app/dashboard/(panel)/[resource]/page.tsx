import { notFound } from "next/navigation";
import { ResourceList } from "@/components/dashboard/ResourceList";
import { getResource } from "@/lib/dashboard/resources";

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const def = getResource((await params).resource);
  if (!def) notFound();
  return <ResourceList resource={def.key} />;
}
