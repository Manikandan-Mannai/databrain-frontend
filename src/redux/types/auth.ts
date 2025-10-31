export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}
