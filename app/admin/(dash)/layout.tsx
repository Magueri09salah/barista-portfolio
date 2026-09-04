import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { unreadCount } from "@/lib/store";
import s from "../admin.module.css";

export const metadata: Metadata = {
  title: "Back office — Setup requests",
  robots: { index: false, follow: false },
};

/* Leads change between page loads; never serve a cached inbox. */
export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const unread = await unreadCount();

  return (
    <div className={s.shell}>
      <header className={s.bar}>
        <div className={s.barInner}>
          <Link className={s.barMark} href="/admin">
            Qasbili <span>Back office</span>
            {unread > 0 ? <em className={s.barBadge}>{unread}</em> : null}
          </Link>

          <div className={s.barActions}>
            <Link className={s.barLink} href="/services">
              View the form
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className={s.main}>{children}</main>
    </div>
  );
}
