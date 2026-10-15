import { singleton } from "../singleton";
import { InMemoryAuthProvider } from "./provider";
import { AuthService } from "./service";

export * from "./types";
export { AuthService, SESSION_TTL_MS } from "./service";
export { InMemoryAuthProvider, DEMO_USERS } from "./provider";

export const authService = singleton("auth", () => new AuthService(new InMemoryAuthProvider()));

export function tokenFromHeader(header: string | null): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}
