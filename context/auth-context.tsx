import { createContext, useContext } from "react";
import { Role } from "@/lib/rbac/roles";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  return (
    <AuthContext.Provider
      value={{ user, login: async () => {}, logout: () => {} }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
