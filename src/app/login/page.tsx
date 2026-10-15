"use client";

import { useEffect, useState } from "react";
import type { PublicUser, Session } from "@/domains/auth/types";
import { api, setToken } from "@/lib/client";

export default function LoginPage() {
  const [email, setEmail] = useState("ada@example.com");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await api<{ user: PublicUser | null }>("/api/auth/session");
    setUser(res.user);
  }

  useEffect(() => {
    refresh().catch(() => setUser(null));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api<{ session: Session }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(res.session.token);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setToken(null);
    setUser(null);
  }

  if (user) {
    return (
      <>
        <h1>Logged in</h1>
        <p>
          {user.name} ({user.email})
        </p>
        <button onClick={logout}>Log out</button>
      </>
    );
  }

  return (
    <>
      <h1>Log in</h1>
      <p className="muted">Demo account: ada@example.com / demo-password</p>
      <form onSubmit={login}>
        <input
          aria-label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          aria-label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
      {error && <p className="error">{error}</p>}
    </>
  );
}
