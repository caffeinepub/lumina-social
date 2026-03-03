import {
  MOCK_MESSAGES_BY_CONV,
  MOCK_NOTIFICATIONS,
  MOCK_POSTS,
} from "@/data/mockData";
import type {
  MockComment,
  MockMessage,
  MockNotification,
  MockPost,
  MockUser,
} from "@/types";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AppContextType {
  posts: MockPost[];
  savedPosts: MockPost[];
  notifications: MockNotification[];
  unreadNotificationCount: number;
  messages: Record<string, MockMessage[]>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string, author: MockUser) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deletePost: (postId: string) => void;
  addPost: (post: MockPost) => void;
  sendMessage: (convId: string, msg: MockMessage) => void;
  sendSharedPost: (
    convId: string,
    post: {
      id: string;
      imageUrl: string;
      caption: string;
      authorUsername: string;
    },
  ) => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<MockPost[]>(MOCK_POSTS);
  const [notifications, setNotifications] =
    useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const [messages, setMessages] = useState<Record<string, MockMessage[]>>(
    () => {
      try {
        const stored = localStorage.getItem("lumina_messages");
        if (stored) {
          return JSON.parse(stored, (key, value) => {
            if (key === "timestamp" && typeof value === "string")
              return new Date(value);
            return value;
          }) as Record<string, MockMessage[]>;
        }
      } catch {
        // fall through to default
      }
      return MOCK_MESSAGES_BY_CONV;
    },
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Persist messages to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("lumina_messages", JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages]);

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

  const sendMessage = useCallback((convId: string, msg: MockMessage) => {
    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] ?? []), msg],
    }));
  }, []);

  const sendSharedPost = useCallback(
    (
      convId: string,
      post: {
        id: string;
        imageUrl: string;
        caption: string;
        authorUsername: string;
      },
    ) => {
      const msg: MockMessage = {
        id: `shared_${Date.now()}`,
        senderId: "me",
        timestamp: new Date(),
        isRead: false,
        type: "shared_post",
        sharedPost: post,
      };
      setMessages((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] ?? []), msg],
      }));
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
        messages,
        toggleLike,
        toggleSave,
        addComment,
        markNotificationRead,
        markAllNotificationsRead,
        deletePost,
        addPost,
        sendMessage,
        sendSharedPost,
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
