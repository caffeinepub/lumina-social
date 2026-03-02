import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import {
  MOCK_HIGHLIGHTS,
  MOCK_STORIES,
  MOCK_USERS,
  formatCount,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Film,
  Globe,
  Grid,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Settings,
  Tag,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function PostGrid({ posts }: { posts: ReturnType<typeof useApp>["posts"] }) {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-white/30">
        <Grid size={40} className="mx-auto mb-3 opacity-50" />
        <p>No posts yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedPost(post.id)}
            onKeyDown={(e) => e.key === "Enter" && setSelectedPost(post.id)}
            className="aspect-square overflow-hidden cursor-pointer group relative"
            style={{ background: post.imageUrl }}
            aria-label="View post"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-4 text-white text-sm font-semibold">
                <span>♥ {formatCount(post.likes)}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post detail modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-sm w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const post = posts.find((p) => p.id === selectedPost);
                if (!post) return null;
                return (
                  <>
                    <div
                      className="aspect-square"
                      style={{ background: post.imageUrl }}
                    />
                    <div className="p-4">
                      <p className="text-sm text-white/80">{post.caption}</p>
                      <p className="text-xs text-white/40 mt-2">
                        {formatCount(post.likes)} likes · {post.comments.length}{" "}
                        comments
                      </p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ProfilePage() {
  const { username } = useParams({ strict: false });
  const navigate = useNavigate();
  const { posts } = useApp();
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = username === "me" || username === MOCK_USERS[0].username;
  const user = isOwnProfile
    ? MOCK_USERS[0]
    : (MOCK_USERS.find((u) => u.username === username) ?? MOCK_USERS[0]);

  const userPosts = posts.filter((p) => {
    if (isOwnProfile) return true;
    return p.author.username === username;
  });

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast(isFollowing ? "Unfollowed" : `Following ${user.username}`, {
      duration: 2000,
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <Toaster />
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        {/* Mobile header */}
        <div className="flex items-start gap-6 mb-6">
          <GlassAvatar
            src={user.avatarUrl}
            alt={user.displayName}
            size="xl"
            hasStory={MOCK_STORIES.some((s) => s.author.id === user.id)}
            isViewed={false}
            onClick={() =>
              navigate({ to: "/stories/$userId", params: { userId: user.id } })
            }
          />

          <div className="flex-1">
            {/* Name & actions */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold text-white">
                    {user.username}
                  </h1>
                  {user.isVerified && (
                    <div className="w-4.5 h-4.5 rounded-full gradient-bg flex items-center justify-center">
                      <span className="text-[9px] text-white font-bold">✓</span>
                    </div>
                  )}
                  {user.isPrivate && (
                    <Lock size={14} className="text-white/40" />
                  )}
                </div>
                <p className="text-sm text-white/60">{user.displayName}</p>
              </div>

              {isOwnProfile ? (
                <div className="flex gap-2">
                  <Link to="/profile/edit">
                    <GlassButton variant="glass" size="sm">
                      Edit
                    </GlassButton>
                  </Link>
                  <Link to="/settings">
                    <GlassButton variant="ghost" size="icon">
                      <Settings size={16} />
                    </GlassButton>
                  </Link>
                </div>
              ) : (
                <div className="flex gap-2">
                  <GlassButton
                    variant={isFollowing ? "glass" : "gradient"}
                    size="sm"
                    onClick={handleFollow}
                    glow={!isFollowing}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={14} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Follow
                      </>
                    )}
                  </GlassButton>
                  <Link to="/messages">
                    <GlassButton variant="glass" size="icon">
                      <MessageCircle size={16} />
                    </GlassButton>
                  </Link>
                  <GlassButton variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </GlassButton>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {[
                { label: "posts", value: userPosts.length || user.postsCount },
                {
                  label: "followers",
                  value:
                    user.followersCount +
                    (isFollowing && !user.isFollowing ? 1 : 0),
                },
                { label: "following", value: user.followingCount },
              ].map((stat) => (
                <button
                  type="button"
                  key={stat.label}
                  className="text-center group"
                >
                  <p className="text-base font-bold text-white group-hover:text-primary transition-colors">
                    {formatCount(stat.value)}
                  </p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          {user.bio && (
            <p className="text-sm text-white/80 leading-relaxed">{user.bio}</p>
          )}
          {user.websiteUrl && (
            <a
              href={`https://${user.websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-1"
            >
              <Globe size={12} />
              {user.websiteUrl}
            </a>
          )}
        </div>

        {/* Story highlights */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {/* Add highlights button */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              className="w-16 h-16 rounded-full glass border border-dashed border-white/30 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-200"
              aria-label="Add highlight"
            >
              <Plus size={20} className="text-white/50" />
            </button>
            <span className="text-xs text-white/40">New</span>
          </div>

          {MOCK_HIGHLIGHTS.map((h) => (
            <div
              key={h.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div
                className="w-16 h-16 rounded-full p-0.5 group-hover:scale-105 transition-transform duration-200"
                style={{ background: h.coverGradient }}
              >
                <div className="w-full h-full rounded-full bg-background p-0.5">
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ background: h.coverGradient, opacity: 0.8 }}
                  />
                </div>
              </div>
              <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                {h.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full glass rounded-none border-t border-b border-white/8 bg-transparent h-12 p-0">
          {[
            { value: "posts", icon: <Grid size={18} /> },
            { value: "reels", icon: <Film size={18} /> },
            { value: "tagged", icon: <Tag size={18} /> },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 rounded-none h-full data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/40 transition-colors"
            >
              {tab.icon}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <PostGrid posts={userPosts} />
        </TabsContent>
        <TabsContent value="reels" className="mt-0">
          <div className="text-center py-16 text-white/30">
            <Film size={40} className="mx-auto mb-3 opacity-50" />
            <p>No reels yet</p>
          </div>
        </TabsContent>
        <TabsContent value="tagged" className="mt-0">
          <div className="text-center py-16 text-white/30">
            <Tag size={40} className="mx-auto mb-3 opacity-50" />
            <p>No tagged posts</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
