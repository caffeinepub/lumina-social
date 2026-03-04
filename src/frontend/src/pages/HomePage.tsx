import { useAuthContext } from "@/components/auth/AuthContext";
import { PostCard } from "@/components/feed/PostCard";
import { StoryBar } from "@/components/feed/StoryBar";
import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { useApp } from "@/context/AppContext";
import { getAllUsers, isFollowing } from "@/utils/userRegistry";
import { Link, useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

function SuggestedUser({
  user,
  index,
  onFollow,
}: {
  user: ReturnType<typeof getAllUsers>[0];
  index: number;
  onFollow: (username: string) => void;
}) {
  const { currentUser } = useAuthContext();
  const alreadyFollowing = currentUser
    ? isFollowing(currentUser.username, user.username)
    : false;
  const [localFollowing, setLocalFollowing] = useState(alreadyFollowing);

  const handleFollow = () => {
    setLocalFollowing((prev) => !prev);
    onFollow(user.username);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
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
              className="w-full h-full flex items-center justify-center text-white/60 text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
              }}
            >
              {user.username[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            className="text-sm font-medium text-white hover:text-primary transition-colors"
          >
            {user.username}
          </Link>
          <p className="text-xs text-white/40">{user.displayName}</p>
        </div>
      </div>
      <motion.button
        type="button"
        onClick={handleFollow}
        whileTap={{ scale: 0.92 }}
        data-ocid="home.toggle"
        className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
          localFollowing
            ? "bg-white/10 text-white/60 border border-white/20 hover:bg-white/15"
            : "text-primary hover:text-primary/80"
        }`}
      >
        {localFollowing ? "Following" : "Follow"}
      </motion.button>
    </motion.div>
  );
}

export function HomePage() {
  const { posts, followUser } = useApp();
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  // Filter posts: show own posts + posts from followed users
  const filteredPosts = useMemo(() => {
    if (!currentUser) return [];
    return [...posts]
      .filter((p) => {
        if (p.author.username === currentUser.username || p.author.id === "me")
          return true;
        return isFollowing(currentUser.username, p.author.username);
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [posts, currentUser]);

  // Suggested users — registered users not yet followed
  const suggestedUsers = useMemo(() => {
    if (!currentUser) return [];
    const allUsers = getAllUsers();
    return allUsers
      .filter(
        (u) =>
          u.username !== currentUser.username &&
          !isFollowing(currentUser.username, u.username),
      )
      .slice(0, 5);
  }, [currentUser]);

  const profileUsername = currentUser?.username ?? "";
  const profileDisplayName = currentUser?.displayName ?? "";
  const profileAvatarUrl = currentUser?.avatarUrl ?? "";

  const handleFollowFromSuggested = (targetUsername: string) => {
    if (!currentUser) return;
    if (isFollowing(currentUser.username, targetUsername)) {
      followUser(targetUsername, currentUser.username);
    } else {
      followUser(targetUsername, currentUser.username);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex min-h-screen">
      {/* Main feed */}
      <div className="flex-1 max-w-[470px] mx-auto lg:mx-0 px-0 sm:px-4 py-4 sm:py-6">
        <StoryBar />

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
            data-ocid="home.empty_state"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ border: "2px solid rgba(255,255,255,0.15)" }}
            >
              <Users size={28} style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>
            <p className="text-white font-semibold text-lg mb-1">
              Your feed is empty
            </p>
            <p
              className="text-sm mb-5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Follow people to see their posts here
            </p>
            <button
              type="button"
              onClick={() => void navigate({ to: "/explore" })}
              data-ocid="home.primary_button"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
              }}
            >
              Discover People
            </button>
          </motion.div>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        )}

        {filteredPosts.length > 0 && (
          <div className="py-8 text-center">
            <p className="text-white/20 text-sm">You're all caught up ✨</p>
          </div>
        )}
      </div>

      {/* Right sidebar - desktop only */}
      <div className="hidden lg:block w-[300px] flex-shrink-0 px-6 py-6">
        <div className="sticky top-6 space-y-6">
          {/* Profile summary */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <GlassAvatar
                src={profileAvatarUrl}
                alt={profileDisplayName}
                size="md"
              />
              <div>
                <Link
                  to="/profile/$username"
                  params={{ username: profileUsername }}
                  className="text-sm font-semibold text-white hover:text-primary transition-colors"
                  data-ocid="home.link"
                >
                  {profileUsername}
                </Link>
                <p className="text-xs text-white/40">{profileDisplayName}</p>
              </div>
              <Link to="/accounts-centre">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-primary text-xs"
                  data-ocid="home.secondary_button"
                >
                  Switch
                </GlassButton>
              </Link>
            </div>
          )}

          {/* Suggestions */}
          {suggestedUsers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Suggested for you
                </h3>
                <Link to="/explore">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white/60"
                  >
                    See All
                  </GlassButton>
                </Link>
              </div>
              <div className="space-y-4">
                {suggestedUsers.map((user, i) => (
                  <SuggestedUser
                    key={user.username}
                    user={user}
                    index={i}
                    onFollow={handleFollowFromSuggested}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Trending hashtags */}
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Trending
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "#digitalart",
                "#streetphotography",
                "#generativeart",
                "#filmmaking",
                "#fashionweek",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs glass px-3 py-1.5 rounded-full text-primary/80 hover:text-primary cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
