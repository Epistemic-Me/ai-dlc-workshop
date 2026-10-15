export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export type PublicUser = Omit<User, "password">;

export type Session = {
  token: string;
  userId: string;
  expiresAt: number;
};

export interface AuthProvider {
  findUserByEmail(email: string): User | undefined;
  findUserById(id: string): User | undefined;
  saveSession(session: Session): void;
  getSession(token: string): Session | undefined;
  deleteSession(token: string): void;
}
