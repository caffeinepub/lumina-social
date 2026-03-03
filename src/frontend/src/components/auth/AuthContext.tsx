import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "lumina_user";

export interface StoredUser {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  websiteUrl?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  reelsCount?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  currentUser: StoredUser | null;
  login: (email: string, password: string) => boolean;
  signup: (data: StoredUser) => void;
  logout: () => void;
  updateUser: (partial: Partial<StoredUser>) => void;
  principalId: string | null;
  // Internet Identity
  iiLogin: () => void;
  iiLogout: () => void;
  iiIsLoggingIn: boolean;
  iiIsInitializing: boolean;
  hasCanisterProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localUser, setLocalUser] = useState<StoredUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as StoredUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hasCanisterProfile, setHasCanisterProfile] = useState(false);

  // Internet Identity
  const {
    identity,
    login: iiLoginFn,
    clear: iiClearFn,
    isLoggingIn: iiIsLoggingIn,
    isInitializing: iiIsInitializing,
  } = useInternetIdentity();

  const { actor } = useActor();

  // When II identity + actor both available, fetch canister profile and merge it
  useEffect(() => {
    if (!identity || !actor) return;

    let cancelled = false;
    void (async () => {
      try {
        const profile = await actor.getCallerUserProfile();
        if (cancelled) return;

        if (profile) {
          setHasCanisterProfile(true);
          // Merge canister profile into currentUser; prefer canister data
          setLocalUser((prev) => {
            const merged: StoredUser = {
              email: prev?.email ?? "",
              username: profile.username || prev?.username || "",
              displayName: profile.displayName || prev?.displayName || "",
              bio: profile.bio || prev?.bio || "",
              // keep local avatar if canister has none
              avatarUrl:
                profile.avatarUrl && profile.avatarUrl !== ""
                  ? profile.avatarUrl
                  : (prev?.avatarUrl ?? ""),
              websiteUrl: profile.websiteUrl || prev?.websiteUrl || undefined,
              followersCount: prev?.followersCount ?? 0,
              followingCount: prev?.followingCount ?? 0,
              postsCount: prev?.postsCount ?? 0,
              reelsCount: prev?.reelsCount ?? 0,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        } else {
          // No canister profile yet — mark for onboarding
          setHasCanisterProfile(false);
          // Pre-fill with principal as placeholder username if no local user exists
          const principalStr = identity.getPrincipal().toString();
          setLocalUser((prev) => {
            if (prev) return prev;
            const newUser: StoredUser = {
              email: "",
              username: principalStr.slice(0, 16).replace(/-/g, ""),
              displayName: "New User",
              bio: "",
              avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${principalStr}`,
              followersCount: 0,
              followingCount: 0,
              postsCount: 0,
              reelsCount: 0,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
            return newUser;
          });
        }
      } catch {
        // canister call failed silently
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [identity, actor]);

  // isAuthenticated: true when local user OR II identity (both paths)
  const isAuthenticated =
    localUser !== null ||
    (!!identity && !identity.getPrincipal().isAnonymous());

  // principalId from II identity if available
  const principalId = identity ? identity.getPrincipal().toString() : null;

  // current user: always the merged state
  const currentUser = localUser;

  // Derive overall initializing state
  const isInitializing = iiIsInitializing;

  function login(email: string, _password: string): boolean {
    setIsLoggingIn(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      const user = JSON.parse(stored) as StoredUser;
      if (user.email !== email) return false;
      setLocalUser(user);
      return true;
    } finally {
      setIsLoggingIn(false);
    }
  }

  function signup(data: StoredUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLocalUser(data);
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    setLocalUser(null);
  }

  function updateUser(partial: Partial<StoredUser>): void {
    setLocalUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  const iiLogin = useCallback(() => {
    iiLoginFn();
  }, [iiLoginFn]);

  const iiLogout = useCallback(() => {
    iiClearFn();
    localStorage.removeItem(STORAGE_KEY);
    setLocalUser(null);
    setHasCanisterProfile(false);
  }, [iiClearFn]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        isLoggingIn,
        currentUser,
        login,
        signup,
        logout,
        updateUser,
        principalId,
        iiLogin,
        iiLogout,
        iiIsLoggingIn,
        iiIsInitializing,
        hasCanisterProfile,
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
