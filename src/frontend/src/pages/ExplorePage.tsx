import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { useApp } from "@/context/AppContext";
import {
  MOCK_REELS,
  MOCK_USERS,
  TRENDING_HASHTAGS,
  formatCount,
} from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import { Play, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const RECENT_SEARCHES = [
  "aurora.lens",
  "#digitalart",
  "tokyo photography",
  "velvet.sky",
];

// Extra explore-only posts with unique picsum seeds
const EXPLORE_EXTRA_POSTS = [
  {
    id: "ep1",
    imageUrl: "https://picsum.photos/seed/lumina_e1/600/600",
    author: MOCK_USERS[2],
    likes: 3412,
    comments: [] as { id: string }[],
  },
  {
    id: "ep2",
    imageUrl: "https://picsum.photos/seed/lumina_e2/600/600",
    author: MOCK_USERS[3],
    likes: 8901,
    comments: [] as { id: string }[],
  },
  {
    id: "ep3",
    imageUrl: "https://picsum.photos/seed/lumina_e3/600/600",
    author: MOCK_USERS[4],
    likes: 1234,
    comments: [] as { id: string }[],
  },
  {
    id: "ep4",
    imageUrl: "https://picsum.photos/seed/lumina_e4/600/600",
    author: MOCK_USERS[5],
    likes: 6789,
    comments: [] as { id: string }[],
  },
  {
    id: "ep5",
    imageUrl: "https://picsum.photos/seed/lumina_e5/600/600",
    author: MOCK_USERS[6],
    likes: 2345,
    comments: [] as { id: string }[],
  },
  {
    id: "ep6",
    imageUrl: "https://picsum.photos/seed/lumina_e6/600/600",
    author: MOCK_USERS[7],
    likes: 4567,
    comments: [] as { id: string }[],
  },
  {
    id: "ep7",
    imageUrl: "https://picsum.photos/seed/lumina_e7/600/600",
    author: MOCK_USERS[8],
    likes: 9012,
    comments: [] as { id: string }[],
  },
  {
    id: "ep8",
    imageUrl: "https://picsum.photos/seed/lumina_e8/600/600",
    author: MOCK_USERS[9],
    likes: 5678,
    comments: [] as { id: string }[],
  },
  {
    id: "ep9",
    imageUrl: "https://picsum.photos/seed/lumina_e9/600/600",
    author: MOCK_USERS[10],
    likes: 3456,
    comments: [] as { id: string }[],
  },
  {
    id: "ep10",
    imageUrl: "https://picsum.photos/seed/lumina_e10/600/600",
    author: MOCK_USERS[11],
    likes: 7890,
    comments: [] as { id: string }[],
  },
  {
    id: "ep11",
    imageUrl: "https://picsum.photos/seed/lumina_e11/600/600",
    author: MOCK_USERS[12],
    likes: 1234,
    comments: [] as { id: string }[],
  },
  {
    id: "ep12",
    imageUrl: "https://picsum.photos/seed/lumina_e12/600/600",
    author: MOCK_USERS[13] ?? MOCK_USERS[0],
    likes: 5432,
    comments: [] as { id: string }[],
  },
];

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const { posts } = useApp();

  const filteredUsers = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return MOCK_USERS.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q),
    );
  }, [query]);

  const filteredPosts = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.caption.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, posts]);

  const handleSearch = (term: string) => {
    setQuery(term);
    if (term && !recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  };

  // Combine feed posts + extra explore posts for the grid
  const allExplorePosts = useMemo(() => {
    return [
      ...posts.map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        author: p.author,
        likes: p.likes,
        comments: p.comments,
      })),
      ...EXPLORE_EXTRA_POSTS,
    ];
  }, [posts]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <GlassInput
          icon={<Search size={16} />}
          placeholder="Search users, posts, hashtags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-base py-4"
          rightIcon={
            query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : undefined
          }
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {!query ? (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white/60">
                    Recent
                  </h2>
                  <button
                    type="button"
                    onClick={() => setRecentSearches([])}
                    className="text-xs text-primary hover:text-primary/70 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full"
                    >
                      <button
                        type="button"
                        onClick={() => handleSearch(term)}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecent(term)}
                        className="text-white/30 hover:text-white/60 transition-colors"
                        aria-label="Remove from recent"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending hashtags */}
            <div>
              <h2 className="text-sm font-semibold text-white/60 mb-3">
                Trending
              </h2>
              <div className="space-y-2">
                {TRENDING_HASHTAGS.map((item, i) => (
                  <motion.button
                    key={item.tag}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSearch(item.tag)}
                    className="w-full flex items-center justify-between glass rounded-xl px-4 py-3 hover:bg-white/8 transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-primary">
                      {item.tag}
                    </span>
                    <span className="text-xs text-white/30">
                      {formatCount(item.posts)} posts
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Explore Posts grid */}
            <div>
              <h2 className="text-sm font-semibold text-white/60 mb-3">
                Explore
              </h2>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-1">
                {allExplorePosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200 relative group"
                    aria-label={`View post by ${post.author.username}`}
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.author.username}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold flex gap-3">
                        <span>♥ {formatCount(post.likes)}</span>
                        <span>💬 {post.comments.length}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reels section */}
            <div>
              <h2 className="text-sm font-semibold text-white/60 mb-3">
                Reels
              </h2>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-1">
                {MOCK_REELS.map((reel, i) => (
                  <motion.div
                    key={reel.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="aspect-[9/16] rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200 relative group"
                    aria-label={`View reel by ${reel.author.username}`}
                  >
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.author.username}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    {/* Play icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Play
                          size={14}
                          className="text-white fill-white ml-0.5"
                        />
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-semibold truncate">
                        {reel.author.username}
                      </p>
                      <p className="text-white/70 text-[10px]">
                        ♥ {formatCount(reel.likes)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* User results */}
            {filteredUsers.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/60 mb-3">
                  People
                </h2>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <Link
                      key={user.id}
                      to="/profile/$username"
                      params={{ username: user.username }}
                      className="flex items-center justify-between glass rounded-xl px-4 py-3 hover:bg-white/8 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <GlassAvatar
                          src={user.avatarUrl}
                          alt={user.displayName}
                          size="md"
                          hasStory={user.followersCount > 20000}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                            {user.username}
                          </p>
                          <p className="text-xs text-white/40">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-white/30">
                            {formatCount(user.followersCount)} followers
                          </p>
                        </div>
                      </div>
                      <GlassButton variant="outline" size="sm">
                        {user.isFollowing ? "Following" : "Follow"}
                      </GlassButton>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Post results */}
            {filteredPosts.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/60 mb-3">
                  Posts
                </h2>
                <div className="grid grid-cols-3 lg:grid-cols-4 gap-1">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200 relative group"
                      aria-label={`Post by ${post.author.username}`}
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.author.username}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold flex gap-3">
                          <span>♥ {formatCount(post.likes)}</span>
                          <span>💬 {post.comments.length}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {filteredUsers.length === 0 && filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <Search size={40} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/40">No results for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
