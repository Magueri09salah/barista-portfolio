import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryById } from "@/lib/catalogue";
import {
  budgetLabel,
  formatDate,
  servicesByCategory,
  statusLabels,
  timelineLabel,
} from "@/lib/requests";
import { getRequest, updateRequest } from "@/lib/store";
import { RequestControls } from "@/components/admin/RequestControls";
import { Icon } from "@/components/ui/Primitives";
import s from "../../../admin.module.css";

export const dynamic = "force-dynamic";

/** Digits only — what wa.me expects. */
function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) notFound();

  /* Opening a request is what "read" means, so clear the flag here rather than
     asking the operator to press anything. Idempotent, and the page is
     force-dynamic, so there is no cache to invalidate. */
  if (request.unread) await updateRequest(request.id, { unread: false });

  const grouped = servicesByCategory(request);
  const noteEntries = Object.entries(request.categoryNotes);

  return (
    <>
      <Link className={s.back} href="/admin">
        <Icon name="arrowLeft" size={16} />
        All requests
      </Link>

      <div className={s.detailHead}>
        <div>
          <p className={s.kicker}>
            Ref {request.id} · {formatDate(request.createdAt)}
          </p>
          <h1 className="h2">{request.name}</h1>
        </div>
        <span className={s.status} data-status={request.status}>
          {statusLabels[request.status]}
        </span>
      </div>

      <div className={s.detailGrid}>
        <div className={s.detailMain}>
          {/* --------------------------------------------------- Requested */}
          <section className={s.card}>
            <h2 className={s.cardTitle}>
              Requested
              <em>
                {request.services.length} service{request.services.length === 1 ? "" : "s"}
              </em>
            </h2>

            {grouped.length === 0 ? (
              <p className="bodySm muted">
                No services on this request — the catalogue entries it referenced no longer exist.
              </p>
            ) : (
              <ul className={s.serviceGroups}>
                {grouped.map(({ category, items }) => (
                  <li key={category.id}>
                    <p className={s.serviceCat}>
                      {category.index} · {category.title}
                    </p>
                    <ul className={s.serviceItems}>
                      {items.map((label) => (
                        <li key={label}>{label}</li>
                      ))}
                    </ul>
                    {request.categoryNotes[category.id] ? (
                      <blockquote className={s.note}>
                        {request.categoryNotes[category.id]}
                      </blockquote>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes left on a phase where nothing was ticked still matter. */}
          {noteEntries.some(([key]) => !grouped.some((group) => group.category.id === key)) ? (
            <section className={s.card}>
              <h2 className={s.cardTitle}>Notes on phases with nothing selected</h2>
              <ul className={s.serviceGroups}>
                {noteEntries
                  .filter(([key]) => !grouped.some((group) => group.category.id === key))
                  .map(([key, note]) => (
                    <li key={key}>
                      <p className={s.serviceCat}>{categoryById.get(key)?.title ?? key}</p>
                      <blockquote className={s.note}>{note}</blockquote>
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}

          {request.message ? (
            <section className={s.card}>
              <h2 className={s.cardTitle}>Anything else</h2>
              <p className={s.message}>{request.message}</p>
            </section>
          ) : null}
        </div>

        <aside className={s.detailSide}>
          <section className={s.card}>
            <h2 className={s.cardTitle}>Contact</h2>
            <dl className={s.meta}>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${request.email}`}>{request.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${request.phone.replace(/\s+/g, "")}`}>{request.phone}</a>
                </dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{request.city || "Not given"}</dd>
              </div>
              <div>
                <dt>Opening</dt>
                <dd>{timelineLabel(request.timeline)}</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{budgetLabel(request.budget)}</dd>
              </div>
            </dl>

            <div className={s.replyRow}>
              <a
                className={s.reply}
                href={whatsappHref(request.phone)}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <a
                className={s.reply}
                href={`mailto:${request.email}?subject=${encodeURIComponent(
                  "Your coffee shop setup request",
                )}`}
              >
                Email
              </a>
            </div>
          </section>

          <section className={s.card}>
            <RequestControls
              id={request.id}
              status={request.status}
              adminNotes={request.adminNotes}
            />
          </section>
        </aside>
      </div>
    </>
  );
}
