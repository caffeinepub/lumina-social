import { MOCK_CONVERSATIONS, MOCK_MESSAGES_BY_CONV } from "@/data/mockData";
import type {
  MockComment,
  MockConversation,
  MockMessage,
  MockNote,
  MockNotification,
  MockPost,
  MockReel,
  MockStory,
  MockUser,
} from "@/types";
import {
  type RegisteredUser,
  blockUser as blockUserFn,
  followUser as followUserFn,
  getAllUsers,
  isFollowing as isFollowingFn,
  muteUser as muteUserFn,
  unfollowUser as unfollowUserFn,
} from "@/utils/userRegistry";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

function parseDates<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj), (key, value) => {
    if (
      (key === "timestamp" || key === "expiresAt" || key === "createdAt") &&
      typeof value === "string"
    ) {
      return new Date(value);
    }
    return value;
  }) as T;
}

interface AppContextType {
  posts: MockPost[];
  savedPosts: MockPost[];
  reels: MockReel[];
  stories: MockStory[];
  notes: MockNote[];
  notifications: MockNotification[];
  unreadNotificationCount: number;
  messages: Record<string, MockMessage[]>;
  conversations: MockConversation[];
  allUsers: RegisteredUser[];
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleReelLike: (reelId: string) => void;
  toggleReelSave: (reelId: string) => void;
  addComment: (postId: string, text: string, author: MockUser) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deletePost: (postId: string) => void;
  addPost: (post: MockPost) => void;
  addReel: (reel: MockReel) => void;
  addStory: (story: MockStory) => void;
  addNote: (note: MockNote) => void;
  removeNote: (noteId: string) => void;
  likeNote: (noteId: string) => void;
  addNotification: (notif: MockNotification) => void;
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
  addConversation: (conv: MockConversation) => void;
  updateConversation: (id: string, updates: Partial<MockConversation>) => void;
  followUser: (targetUsername: string, myUsername: string) => void;
  unfollowUser: (targetUsername: string, myUsername: string) => void;
  isFollowing: (targetUsername: string, myUsername: string) => boolean;
  blockUser: (targetUsername: string, myUsername: string) => void;
  muteUser: (targetUsername: string, myUsername: string) => void;
  refreshAllUsers: () => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// One-time migration: remove old fake account data
function runMigrations(): void {
  const migKey = "lumina_migrated_v3";
  if (localStorage.getItem(migKey)) return;

  // Remove conversations for the 3 removed fake accounts
  const fakeConvIds = ["conv_choco", "conv_arey", "conv_shiv"];
  try {
    const stored = localStorage.getItem("lumina_conversations");
    if (stored) {
      const convs = JSON.parse(stored) as { id: string }[];
      const cleaned = convs.filter((c) => !fakeConvIds.includes(c.id));
      localStorage.setItem("lumina_conversations", JSON.stringify(cleaned));
    }
    // Remove messages for those conversations
    const msgs = localStorage.getItem("lumina_messages");
    if (msgs) {
      const msgRecord = JSON.parse(msgs) as Record<string, unknown>;
      for (const id of fakeConvIds) {
        delete msgRecord[id];
      }
      localStorage.setItem("lumina_messages", JSON.stringify(msgRecord));
    }
    // Remove fake user registrations
    const usersRaw = localStorage.getItem("lumina_all_users");
    if (usersRaw) {
      const usersAll = JSON.parse(usersRaw) as Record<string, unknown>;
      const fakeNames = [
        "chocolatecakekhanahai",
        "areymhuapkix",
        "shivislowkeycrazy",
      ];
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(usersAll)) {
        if (!fakeNames.includes(k)) cleaned[k] = v;
      }
      localStorage.setItem("lumina_all_users", JSON.stringify(cleaned));
    }
    // Remove fake notes
    const notesRaw = localStorage.getItem("lumina_notes");
    if (notesRaw) {
      const notes = JSON.parse(notesRaw) as {
        author?: { username?: string };
      }[];
      const cleaned = notes.filter(
        (n) =>
          n.author?.username !== "chocolatecakekhanahai" &&
          n.author?.username !== "areymhuapkix" &&
          n.author?.username !== "shivislowkeycrazy",
      );
      localStorage.setItem("lumina_notes", JSON.stringify(cleaned));
    }
  } catch {
    // ignore migration errors
  }
  localStorage.setItem(migKey, "1");
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Run migrations on first render (synchronously before state init)
  runMigrations();

  // ── Posts ──────────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState<MockPost[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_posts");
      if (stored) return parseDates(JSON.parse(stored) as MockPost[]);
    } catch {
      // fall through
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("lumina_posts", JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  // ── Reels ──────────────────────────────────────────────────────────────────
  const [reels, setReels] = useState<MockReel[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_reels");
      if (stored) return JSON.parse(stored) as MockReel[];
    } catch {
      // fall through
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("lumina_reels", JSON.stringify(reels));
    } catch {
      // ignore
    }
  }, [reels]);

  // ── Stories ────────────────────────────────────────────────────────────────
  const [stories, setStories] = useState<MockStory[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_stories");
      if (stored) {
        const parsed = parseDates(JSON.parse(stored) as MockStory[]);
        // filter out expired stories (older than 24h)
        const now = Date.now();
        return parsed.filter((s) => s.timestamp.getTime() > now - 24 * 3600000);
      }
    } catch {
      // fall through
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("lumina_stories", JSON.stringify(stories));
    } catch {
      // ignore
    }
  }, [stories]);

  // ── Notes ──────────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState<MockNote[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_notes");
      if (stored) {
        const parsed = parseDates(JSON.parse(stored) as MockNote[]);
        // filter expired
        const now = Date.now();
        return parsed.filter((n) => n.expiresAt.getTime() > now);
      }
    } catch {
      // fall through
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("lumina_notes", JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  // ── Notifications ──────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<MockNotification[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_notifications");
      if (stored) return parseDates(JSON.parse(stored) as MockNotification[]);
    } catch {
      // fall through
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "lumina_notifications",
        JSON.stringify(notifications),
      );
    } catch {
      // ignore
    }
  }, [notifications]);

  // ── Messages ───────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Record<string, MockMessage[]>>(
    () => {
      try {
        const stored = localStorage.getItem("lumina_messages");
        if (stored) {
          return parseDates(
            JSON.parse(stored) as Record<string, MockMessage[]>,
          );
        }
      } catch {
        // fall through
      }
      // No seed data — use empty record
      return { ...MOCK_MESSAGES_BY_CONV };
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem("lumina_messages", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // ── Conversations ──────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState<MockConversation[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_conversations");
      if (stored) {
        return parseDates(JSON.parse(stored) as MockConversation[]);
      }
    } catch {
      // fall through
    }
    // No seed conversations — only real user-created ones
    return [...MOCK_CONVERSATIONS];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "lumina_conversations",
        JSON.stringify(conversations),
      );
    } catch {
      // ignore
    }
  }, [conversations]);

  // ── All users ──────────────────────────────────────────────────────────────
  const [allUsers, setAllUsers] = useState<RegisteredUser[]>(() =>
    getAllUsers(),
  );

  const refreshAllUsers = useCallback(() => {
    setAllUsers(getAllUsers());
  }, []);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // ── Post actions ───────────────────────────────────────────────────────────
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

  const deletePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const addPost = useCallback((post: MockPost) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  // ── Reel actions ───────────────────────────────────────────────────────────
  const toggleReelLike = useCallback((reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              isLiked: !r.isLiked,
              likes: r.isLiked ? r.likes - 1 : r.likes + 1,
            }
          : r,
      ),
    );
  }, []);

  const toggleReelSave = useCallback((reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, isSaved: !r.isSaved } : r)),
    );
  }, []);

  const addReel = useCallback((reel: MockReel) => {
    setReels((prev) => [reel, ...prev]);
  }, []);

  // ── Story actions ──────────────────────────────────────────────────────────
  const addStory = useCallback((story: MockStory) => {
    setStories((prev) => {
      // Replace existing story by the same author or prepend
      const filtered = prev.filter((s) => s.author.id !== story.author.id);
      return [story, ...filtered];
    });
  }, []);

  // ── Note actions ───────────────────────────────────────────────────────────
  const addNote = useCallback((note: MockNote) => {
    setNotes((prev) => [
      note,
      ...prev.filter((n) => n.author.username !== note.author.username),
    ]);
  }, []);

  const removeNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }, []);

  const likeNote = useCallback((noteId: string) => {
    // notes don't have a likes field in the type, so we track via replies count as a proxy
    // Just a no-op to keep the interface consistent; UI manages like state locally
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n } : n)));
  }, []);

  // ── Notification actions ───────────────────────────────────────────────────
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((notif: MockNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  // ── Message actions ────────────────────────────────────────────────────────
  const sendMessage = useCallback((convId: string, msg: MockMessage) => {
    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] ?? []), msg],
    }));
    // Bump conversation to top
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, lastMessage: msg } : c)),
    );
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

  // ── Conversation actions ───────────────────────────────────────────────────
  const addConversation = useCallback((conv: MockConversation) => {
    setConversations((prev) => {
      if (prev.some((c) => c.id === conv.id)) return prev;
      return [conv, ...prev];
    });
  }, []);

  const updateConversation = useCallback(
    (id: string, updates: Partial<MockConversation>) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      );
    },
    [],
  );

  // ── Follow / Block / Mute ──────────────────────────────────────────────────
  const followUser = useCallback(
    (targetUsername: string, myUsername: string) => {
      followUserFn(myUsername, targetUsername);
      refreshAllUsers();
    },
    [refreshAllUsers],
  );

  const unfollowUser = useCallback(
    (targetUsername: string, myUsername: string) => {
      unfollowUserFn(myUsername, targetUsername);
      refreshAllUsers();
    },
    [refreshAllUsers],
  );

  const isFollowing = useCallback(
    (targetUsername: string, myUsername: string): boolean => {
      return isFollowingFn(myUsername, targetUsername);
    },
    [],
  );

  const blockUser = useCallback(
    (targetUsername: string, myUsername: string) => {
      blockUserFn(myUsername, targetUsername);
    },
    [],
  );

  const muteUser = useCallback((targetUsername: string, myUsername: string) => {
    muteUserFn(myUsername, targetUsername);
  }, []);

  const savedPosts = useMemo(() => posts.filter((p) => p.isSaved), [posts]);

  return (
    <AppContext.Provider
      value={{
        posts,
        savedPosts,
        reels,
        stories,
        notes,
        notifications,
        unreadNotificationCount,
        messages,
        conversations,
        allUsers,
        toggleLike,
        toggleSave,
        toggleReelLike,
        toggleReelSave,
        addComment,
        markNotificationRead,
        markAllNotificationsRead,
        deletePost,
        addPost,
        addReel,
        addStory,
        addNote,
        removeNote,
        likeNote,
        addNotification,
        sendMessage,
        sendSharedPost,
        addConversation,
        updateConversation,
        followUser,
        unfollowUser,
        isFollowing,
        blockUser,
        muteUser,
        refreshAllUsers,
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
