import Link from "next/link";
import { notFound } from "next/navigation";
import { sectionById } from "@/lib/content-schema";
import { getSiteContent, getStoredOverrides, type SiteContent } from "@/lib/site-content";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { Icon } from "@/components/ui/Primitives";
import s from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ContentSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: id } = await params;
  const schema = sectionById.get(id);

  if (!schema) notFound();

  /* The editor opens on the merged value — what the site currently shows —
     while `overrides` only says whether this section has been touched, which
     is what decides if "Restore original" is offered. */
  const [content, overrides] = await Promise.all([getSiteContent(), getStoredOverrides()]);

  return (
    <>
      <Link className={s.back} href="/admin/content">
        <Icon name="arrowLeft" size={16} />
        All sections
      </Link>

      <ContentEditor
        section={schema}
        initial={content[schema.id as keyof SiteContent]}
        isOverridden={id in overrides}
      />
    </>
  );
}
