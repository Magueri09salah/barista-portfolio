import Link from "next/link";
import { sections } from "@/lib/content-schema";
import { getStoredOverrides } from "@/lib/site-content";
import s from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ContentIndexPage() {
  const overrides = await getStoredOverrides();
  const editedCount = sections.filter((section) => section.id in overrides).length;

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <p className={s.kicker}>Content</p>
          <h1 className="h2">Edit the website</h1>
        </div>
      </div>

      <p className={`bodySm muted ${s.contentIntro}`}>
        Every section of the public site. Changes go live as soon as you save, and any section can
        be put back to how it shipped.
        {editedCount > 0
          ? ` ${editedCount} of ${sections.length} ${editedCount === 1 ? "section has" : "sections have"} been edited.`
          : " Nothing has been edited yet."}
      </p>

      <ul className={s.sectionList}>
        {sections.map((section) => (
          <li key={section.id as string}>
            <Link className={s.sectionRow} href={`/admin/content/${section.id as string}`}>
              <span className={s.sectionMain}>
                <span className={s.sectionName}>{section.title}</span>
                <span className={s.sectionBlurb}>{section.blurb}</span>
              </span>
              <span className={s.sectionWhere}>{section.where}</span>
              {section.id in overrides ? (
                <span className={s.status} data-status="contacted">
                  Edited
                </span>
              ) : (
                <span className={s.sectionDefault}>Default</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
