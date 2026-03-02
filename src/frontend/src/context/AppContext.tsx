import { MOCK_NOTIFICATIONS, MOCK_POSTS } from "@/data/mockData";
import type { MockNotification, MockPost } from "@/types";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface AppContextType {
  posts: MockPost[];
  notifications: MockNotification[];
  unreadNotificationCount: number;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deletePost: (postId: string) => void;
  addPost: (post: MockPost) => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<MockPost[]>(MOCK_POSTS);
  const [notifications, setNotifications] =
    useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p)),
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deletePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const addPost = useCallback((post: MockPost) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        posts,
        notifications,
        unreadNotificationCount,
        toggleLike,
        toggleSave,
        markNotificationRead,
        markAllNotificationsRead,
        deletePost,
        addPost,
        isCreateOpen,
        setIsCreateOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
