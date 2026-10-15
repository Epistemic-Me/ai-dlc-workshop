import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAuthProvider } from "./provider";
import { AuthService, SESSION_TTL_MS } from "./service";

describe("AuthService", () => {
  let now: number;
  let service: AuthService;

  beforeEach(() => {
    now = 1_000_000;
    let n = 0;
    service = new AuthService(new InMemoryAuthProvider(), {
      now: () => now,
      createToken: () => `token_${++n}`,
    });
  });

  it("returns a session for valid credentials", () => {
    const result = service.login("ada@example.com", "demo-password");
    expect(result).toEqual({
      ok: true,
      value: { token: "token_1", userId: "user_1", expiresAt: now + SESSION_TTL_MS },
    });
  });

  it("rejects a wrong password", () => {
    const result = service.login("ada@example.com", "wrong");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_credentials");
  });

  it("rejects an unknown user", () => {
    const result = service.login("nobody@example.com", "demo-password");
    expect(result.ok).toBe(false);
  });

  it("treats email as case-insensitive and trims it", () => {
    const result = service.login("  ADA@Example.com ", "demo-password");
    expect(result.ok).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = service.login("ada@example.com", "");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("returns the session and user for a valid token", () => {
    service.login("ada@example.com", "demo-password");
    expect(service.getSession("token_1")?.userId).toBe("user_1");
    expect(service.getUser("token_1")).toEqual({
      id: "user_1",
      email: "ada@example.com",
      name: "Ada",
    });
  });

  it("returns null for an expired session", () => {
    service.login("ada@example.com", "demo-password");
    now += SESSION_TTL_MS;
    expect(service.getSession("token_1")).toBeNull();
  });

  it("removes the session on logout", () => {
    service.login("ada@example.com", "demo-password");
    service.logout("token_1");
    expect(service.getSession("token_1")).toBeNull();
  });
});
