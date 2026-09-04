"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Icon } from "@/components/ui/Primitives";
import s from "@/app/admin/admin.module.css";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error ?? "Could not sign in.");
        setPassword("");
        setBusy(false);
        return;
      }

      /* Replace rather than push: the login page should not sit in history
         behind the inbox, where Back would bounce through it. */
      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setBusy(false);
    }
  }

  return (
    <form className={s.loginForm} onSubmit={onSubmit}>
      <div className={s.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {error ? (
        <p className={`bodySm ${s.loginError}`} role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="gold" disabled={busy || !password}>
        {busy ? "Checking…" : "Sign in"}
        <Icon name="arrowRight" size={20} />
      </Button>
    </form>
  );
}
