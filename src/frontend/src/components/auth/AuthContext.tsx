import { type ReactNode, createContext, useContext, useState } from "react";

const STORAGE_KEY = "lumina_user";

export interface StoredUser {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  currentUser: StoredUser | null;
  login: (email: string, password: string) => boolean;
  signup: (data: StoredUser) => void;
  logout: () => void;
  principalId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as StoredUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isAuthenticated = currentUser !== null;

  function login(email: string, _password: string): boolean {
    setIsLoggingIn(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      const user = JSON.parse(stored) as StoredUser;
      if (user.email !== email) return false;
      setCurrentUser(user);
      return true;
    } finally {
      setIsLoggingIn(false);
    }
  }

  function signup(data: StoredUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setCurrentUser(data);
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitializing: false,
        isLoggingIn,
        currentUser,
        login,
        signup,
        logout,
        principalId: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
