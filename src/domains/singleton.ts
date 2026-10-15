// Next.js dev mode can load a module once per route, which would give each
// route its own in-memory store. Keeping instances on globalThis makes every
// route share one store per domain.
export function singleton<T>(key: string, create: () => T): T {
  const store = globalThis as typeof globalThis & { __workshop?: Record<string, unknown> };
  store.__workshop ??= {};
  store.__workshop[key] ??= create();
  return store.__workshop[key] as T;
}
