import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassInput } from "@/components/glass/GlassInput";
import { useApp } from "@/context/AppContext";
import { TRENDING_HASHTAGS, formatCount } from "@/data/mockData";
import {
  followUser,
  getAllUsers,
  isFollowing,
  unfollowUser,
} from "@/utils/userRegistry";
import { Link } from "@tanstack/react-router";
import { Play, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { posts, reels } = useApp();
  const { currentUser } = useAuthContext();
  const [followStateVersion, setFollowStateVersion] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: followStateVersion forces refresh on follow/unfollow
  const allUsers = useMemo(() => getAllUsers(), [followStateVersion]);

  const filteredUsers = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q),
    );
  }, [query, allUsers]);

  const filteredPosts = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.caption.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.author.username.toLowerCase().includes(q),
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

  const handleToggleFollow = (targetUsername: string) => {
    if (!currentUser) return;
    if (isFollowing(currentUser.username, targetUsername)) {
      unfollowUser(currentUser.username, targetUsername);
    } else {
      followUser(currentUser.username, targetUsername);
    }
    setFollowStateVersion((v) => v + 1);
  };

  // All explore posts from real data
  const allExplorePosts = useMemo(() => {
    return posts.map((p) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      author: p.author,
      likes: p.likes,
      comments: p.comments,
    }));
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
          data-ocid="explore.search_input"
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

            {/* Registered users */}
            {allUsers.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/60 mb-3">
                  People to Follow
                </h2>
                <div className="space-y-2">
                  {allUsers
                    .filter((u) => u.username !== currentUser?.username)
                    .slice(0, 8)
                    .map((user, i) => {
                      const following = currentUser
                        ? isFollowing(currentUser.username, user.username)
                        : false;
                      return (
                        <motion.div
                          key={user.username}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center justify-between glass rounded-xl px-4 py-3"
                          data-ocid={`explore.item.${i + 1}`}
                        >
                          <Link
                            to="/profile/$username"
                            params={{ username: user.username }}
                            className="flex items-center gap-3 flex-1 min-w-0"
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              {user.avatarUrl ? (
                                <img
                                  src={user.avatarUrl}
                                  alt={user.displayName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center text-white font-bold"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #7c3aed, #db2777)",
                                  }}
                                >
                                  {user.username[0]?.toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {user.username}
                              </p>
                              <p className="text-xs text-white/40 truncate">
                                {user.displayName}
                              </p>
                            </div>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleToggleFollow(user.username)}
                            data-ocid="explore.toggle"
                            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ml-3 flex-shrink-0 ${
                              following
                                ? "bg-white/10 text-white/60 border border-white/20"
                                : "text-white"
                            }`}
                            style={
                              following
                                ? undefined
                                : {
                                    background:
                                      "linear-gradient(135deg, #7c3aed, #db2777)",
                                  }
                            }
                          >
                            {following ? "Following" : "Follow"}
                          </button>
                        </motion.div>
                      );
                    })}
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
            {allExplorePosts.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/60 mb-3">
                  Posts
                </h2>
                <div
                  className="grid grid-cols-3 lg:grid-cols-4 gap-1"
                  data-ocid="explore.list"
                >
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
            )}

            {/* Reels section */}
            {reels.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/60 mb-3">
                  Reels
                </h2>
                <div className="grid grid-cols-3 lg:grid-cols-4 gap-1">
                  {reels.map((reel, i) => (
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
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
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
            )}

            {allUsers.length === 0 &&
              allExplorePosts.length === 0 &&
              reels.length === 0 && (
                <div
                  className="text-center py-16 text-white/30"
                  data-ocid="explore.empty_state"
                >
                  <Search size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No content yet. Start following people!</p>
                </div>
              )}
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
                  {filteredUsers.map((user) => {
                    const following = currentUser
                      ? isFollowing(currentUser.username, user.username)
                      : false;
                    return (
                      <div
                        key={user.username}
                        className="flex items-center justify-between glass rounded-xl px-4 py-3 hover:bg-white/8 transition-all duration-200"
                      >
                        <Link
                          to="/profile/$username"
                          params={{ username: user.username }}
                          className="flex items-center gap-3 flex-1 min-w-0 group"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.displayName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-white font-bold"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #7c3aed, #db2777)",
                                }}
                              >
                                {user.username[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors truncate">
                              {user.username}
                            </p>
                            <p className="text-xs text-white/40 truncate">
                              {user.displayName}
                            </p>
                          </div>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleFollow(user.username)}
                          data-ocid="explore.toggle"
                          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ml-3 flex-shrink-0 ${
                            following
                              ? "bg-white/10 text-white/60 border border-white/20"
                              : "text-white"
                          }`}
                          style={
                            following
                              ? undefined
                              : {
                                  background:
                                    "linear-gradient(135deg, #7c3aed, #db2777)",
                                }
                          }
                        >
                          {following ? "Following" : "Follow"}
                        </button>
                      </div>
                    );
                  })}
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
              <div
                className="text-center py-16"
                data-ocid="explore.empty_state"
              >
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
