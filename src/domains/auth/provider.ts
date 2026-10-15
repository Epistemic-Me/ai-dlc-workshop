import type { AuthProvider, Session, User } from "./types";

// Demo users for local use only. These are not real credentials.
export const DEMO_USERS: User[] = [
  { id: "user_1", email: "ada@example.com", name: "Ada", password: "demo-password" },
  { id: "user_2", email: "grace@example.com", name: "Grace", password: "demo-password" },
];

export class InMemoryAuthProvider implements AuthProvider {
  private users: User[];
  private sessions = new Map<string, Session>();

  constructor(users: User[] = DEMO_USERS) {
    this.users = users.map((u) => ({ ...u }));
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  saveSession(session: Session): void {
    this.sessions.set(session.token, session);
  }

  getSession(token: string): Session | undefined {
    return this.sessions.get(token);
  }

  deleteSession(token: string): void {
    this.sessions.delete(token);
  }
}
