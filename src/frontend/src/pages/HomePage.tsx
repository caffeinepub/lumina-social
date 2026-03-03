import { useAuthContext } from "@/components/auth/AuthContext";
import { PostCard } from "@/components/feed/PostCard";
import { StoryBar } from "@/components/feed/StoryBar";
import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { useApp } from "@/context/AppContext";
import { MOCK_USERS } from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

function SuggestedUser({
  user,
  index,
}: { user: (typeof MOCK_USERS)[0]; index: number }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing ?? false);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <GlassAvatar
          src={user.avatarUrl}
          alt={user.displayName}
          size="sm"
          hasStory={index < 3}
        />
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
        className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
          isFollowing
            ? "bg-white/10 text-white/60 border border-white/20 hover:bg-white/15"
            : "text-primary hover:text-primary/80"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </motion.button>
    </motion.div>
  );
}

export function HomePage() {
  const { posts } = useApp();
  const { currentUser } = useAuthContext();
  const sortedPosts = [...posts].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
  const suggestedUsers = MOCK_USERS.filter((u) => !u.isFollowing).slice(0, 5);

  const profileUsername = currentUser?.username ?? MOCK_USERS[1].username;
  const profileDisplayName =
    currentUser?.displayName ?? MOCK_USERS[1].displayName;
  const profileAvatarUrl =
    currentUser?.avatarUrl && currentUser.avatarUrl !== ""
      ? currentUser.avatarUrl
      : MOCK_USERS[1].avatarUrl;

  return (
    <div className="max-w-[1200px] mx-auto flex min-h-screen">
      {/* Main feed */}
      <div className="flex-1 max-w-[630px] mx-auto lg:mx-0 px-0 sm:px-4 py-4 sm:py-6">
        <StoryBar />

        {sortedPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}

        <div className="py-8 text-center">
          <p className="text-white/20 text-sm">You're all caught up ✨</p>
        </div>
      </div>

      {/* Right sidebar - desktop only */}
      <div className="hidden lg:block w-[300px] flex-shrink-0 px-6 py-6">
        <div className="sticky top-6 space-y-6">
          {/* Profile summary */}
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
              >
                {profileUsername}
              </Link>
              <p className="text-xs text-white/40">{profileDisplayName}</p>
            </div>
            <GlassButton
              variant="ghost"
              size="sm"
              className="ml-auto text-primary text-xs"
            >
              Switch
            </GlassButton>
          </div>

          {/* Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Suggested for you
              </h3>
              <GlassButton
                variant="ghost"
                size="sm"
                className="text-xs text-white/60"
              >
                See All
              </GlassButton>
            </div>
            <div className="space-y-4">
              {suggestedUsers.map((user, i) => (
                <SuggestedUser key={user.id} user={user} index={i} />
              ))}
            </div>
          </div>

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
