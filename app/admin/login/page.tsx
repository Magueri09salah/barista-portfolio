import type { Metadata } from "next";
import { isConfigured } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import s from "../admin.module.css";

export const metadata: Metadata = {
  title: "Sign in — Back office",
  // Never index the operator's door.
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  /* Only ever redirect within this site — an open redirect here would be a
     ready-made phishing hop. */
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  return (
    <main className={s.loginPage}>
      <div className={s.loginCard}>
        <p className={s.loginMark}>
          Qasbili <span>Back office</span>
        </p>
        <h1 className="h3">Setup requests</h1>

        {isConfigured() ? (
          <>
            <p className={`bodySm ${s.loginBlurb}`}>
              Enter the password from your <code>ADMIN_PASSWORD</code> environment variable.
            </p>
            <LoginForm next={destination} />
          </>
        ) : (
          <div className={s.loginWarn} role="alert">
            <p className="bodySm">
              <strong>No password is configured</strong>, so the back office is closed. Set{" "}
              <code>ADMIN_PASSWORD</code> (and ideally <code>ADMIN_SECRET</code>) in your{" "}
              <code>.env.local</code>, then restart the server.
            </p>
            <p className="bodySm">
              See <code>.env.example</code> for the two lines you need.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
