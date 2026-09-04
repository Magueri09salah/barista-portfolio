import Link from "next/link";
import { budgetLabel, formatDate, statusLabels, statuses, timelineLabel } from "@/lib/requests";
import { listRequests } from "@/lib/store";
import s from "../admin.module.css";

export const dynamic = "force-dynamic";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: statusFilter, q } = await searchParams;
  const all = await listRequests();

  const query = (q ?? "").trim().toLowerCase();
  const activeStatus = statuses.includes(statusFilter as never) ? statusFilter : undefined;

  const requests = all.filter((request) => {
    if (activeStatus && request.status !== activeStatus) return false;
    if (!query) return true;
    return [request.name, request.city, request.email, request.phone]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  const now = Date.now();
  const tiles = [
    { label: "Total", value: all.length },
    { label: "Unread", value: all.filter((request) => request.unread).length },
    {
      label: "This week",
      value: all.filter((request) => now - new Date(request.createdAt).getTime() < WEEK_MS).length,
    },
    { label: "Won", value: all.filter((request) => request.status === "won").length },
  ];

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <p className={s.kicker}>Inbox</p>
          <h1 className="h2">Setup requests</h1>
        </div>

        <form className={s.search} action="/admin">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, city, email…"
            aria-label="Search requests"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <dl className={s.tiles}>
        {tiles.map((tile) => (
          <div key={tile.label}>
            <dt>{tile.label}</dt>
            <dd>{tile.value}</dd>
          </div>
        ))}
      </dl>

      <nav className={s.filters} aria-label="Filter by status">
        <Link
          className={s.filter}
          data-on={!activeStatus}
          href={query ? `/admin?q=${encodeURIComponent(query)}` : "/admin"}
        >
          All
          <em>{all.length}</em>
        </Link>
        {statuses.map((status) => {
          const count = all.filter((request) => request.status === status).length;
          const params = new URLSearchParams({ status });
          if (query) params.set("q", query);
          return (
            <Link
              key={status}
              className={s.filter}
              data-on={activeStatus === status}
              href={`/admin?${params.toString()}`}
            >
              {statusLabels[status]}
              <em>{count}</em>
            </Link>
          );
        })}
      </nav>

      {requests.length === 0 ? (
        <div className={s.empty}>
          <p className="h4">
            {all.length === 0 ? "No requests yet." : "Nothing matches that filter."}
          </p>
          <p className="bodySm muted">
            {all.length === 0 ? (
              <>
                Requests sent from <Link href="/services">/services</Link> land here the moment they
                arrive.
              </>
            ) : (
              <Link href="/admin">Clear the filters</Link>
            )}
          </p>
        </div>
      ) : (
        <ul className={s.list}>
          {requests.map((request) => (
            <li key={request.id}>
              <Link className={s.row} href={`/admin/requests/${request.id}`} data-unread={request.unread}>
                <span className={s.rowDot} aria-hidden="true" />

                <span className={s.rowMain}>
                  <span className={s.rowName}>
                    {request.name}
                    {request.unread ? <span className="srOnly"> (unread)</span> : null}
                  </span>
                  <span className={s.rowMeta}>
                    {request.city || "City not given"} · {request.services.length} service
                    {request.services.length === 1 ? "" : "s"} · {timelineLabel(request.timeline)}
                  </span>
                </span>

                <span className={s.rowBudget}>{budgetLabel(request.budget)}</span>

                <span className={s.status} data-status={request.status}>
                  {statusLabels[request.status]}
                </span>

                <span className={s.rowDate}>{formatDate(request.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
