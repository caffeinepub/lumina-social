import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/context/AppContext";
import { MOCK_USERS, TRENDING_HASHTAGS } from "@/data/mockData";
import { formatCount } from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const RECENT_SEARCHES = [
  "aurora.lens",
  "#digitalart",
  "tokyo photography",
  "velvet.sky",
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

      {!query ? (
        <div className="space-y-6">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white/60">Recent</h2>
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

          {/* Explore grid */}
          <div>
            <h2 className="text-sm font-semibold text-white/60 mb-3">
              Explore
            </h2>
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-1">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] hover:opacity-90 transition-all duration-200 relative group"
                  style={{ background: post.imageUrl }}
                  aria-label={`View post by ${post.author.username}`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-medium bg-black/50 px-1.5 py-0.5 rounded-full">
                      {post.author.username}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
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
                  <div
                    key={post.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ background: post.imageUrl }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Post by ${post.author.username}`}
                  />
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
        </div>
      )}
    </div>
  );
}
