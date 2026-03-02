import { MOCK_NOTIFICATIONS, MOCK_POSTS } from "@/data/mockData";
import type {
  MockComment,
  MockNotification,
  MockPost,
  MockUser,
} from "@/types";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface AppContextType {
  posts: MockPost[];
  savedPosts: MockPost[];
  notifications: MockNotification[];
  unreadNotificationCount: number;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string, author: MockUser) => void;
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

  const addComment = useCallback(
    (postId: string, text: string, author: MockUser) => {
      const newComment: MockComment = {
        id: `c_${Date.now()}`,
        author,
        text,
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
      };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
        ),
      );
    },
    [],
  );

  const savedPosts = useMemo(() => posts.filter((p) => p.isSaved), [posts]);

  return (
    <AppContext.Provider
      value={{
        posts,
        savedPosts,
        notifications,
        unreadNotificationCount,
        toggleLike,
        toggleSave,
        addComment,
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
