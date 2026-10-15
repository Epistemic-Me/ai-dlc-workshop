"use client";

const TOKEN_KEY = "workshop.session";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) window.sessionStorage.setItem(TOKEN_KEY, token);
  else window.sessionStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(path, { ...init, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? `Request failed (${res.status})`);
  return data as T;
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
