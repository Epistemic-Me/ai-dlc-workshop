import { fail, ok, type Result } from "../errors";
import type { AuthProvider, PublicUser, Session } from "./types";

export const SESSION_TTL_MS = 60 * 60 * 1000;

type Options = {
  now?: () => number;
  createToken?: () => string;
};

export class AuthService {
  private now: () => number;
  private createToken: () => string;

  constructor(
    private provider: AuthProvider,
    options: Options = {},
  ) {
    this.now = options.now ?? Date.now;
    this.createToken = options.createToken ?? (() => crypto.randomUUID());
  }

  login(email: string, password: string): Result<Session> {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) {
      return fail("invalid_input", "Email and password are required.");
    }
    const user = this.provider.findUserByEmail(normalized);
    if (!user || user.password !== password) {
      return fail("invalid_credentials", "Email or password is incorrect.");
    }
    const session: Session = {
      token: this.createToken(),
      userId: user.id,
      expiresAt: this.now() + SESSION_TTL_MS,
    };
    this.provider.saveSession(session);
    return ok(session);
  }

  getSession(token: string): Session | null {
    const session = this.provider.getSession(token);
    if (!session) return null;
    if (session.expiresAt <= this.now()) {
      this.provider.deleteSession(token);
      return null;
    }
    return session;
  }

  getUser(token: string): PublicUser | null {
    const session = this.getSession(token);
    if (!session) return null;
    const user = this.provider.findUserById(session.userId);
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name };
  }

  logout(token: string): void {
    this.provider.deleteSession(token);
  }
}
