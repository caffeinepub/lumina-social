import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { formatCount } from "@/data/mockData";
import type { MockPost, MockReel } from "@/types";
import { getUser } from "@/utils/userRegistry";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Bookmark,
  Film,
  Globe,
  Grid,
  Heart,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Send,
  Settings,
  Tag,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function PostDetailModal({
  post,
  onClose,
  isOwn,
}: {
  post: MockPost;
  onClose: () => void;
  isOwn: boolean;
}) {
  const { toggleLike, addComment, deletePost } = useApp();
  const { currentUser } = useAuthContext();
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);

  // Get the live post from context
  const { posts } = useApp();
  const livePost = posts.find((p) => p.id === post.id) ?? post;

  const handleAddComment = () => {
    if (!commentText.trim() || !currentUser) return;
    addComment(livePost.id, commentText.trim(), {
      id: "me",
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl ?? "",
      bio: "",
      websiteUrl: "",
      isPrivate: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isFollowing: false,
      isVerified: false,
    });
    setCommentText("");
  };

  const handleDelete = () => {
    deletePost(livePost.id);
    toast.success("Post deleted");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        className="max-w-md w-full overflow-hidden rounded-2xl flex flex-col max-h-[90vh]"
        style={{
          background: "rgba(14,14,20,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(40px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
          <p className="text-sm font-semibold text-white">Post</p>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Media */}
        <div className="flex-shrink-0">
          {livePost.mediaType === "video" ? (
            <video
              src={livePost.imageUrl}
              className="w-full aspect-square object-cover"
              controls
              autoPlay
              loop
              playsInline
            >
              <track kind="captions" />
            </video>
          ) : (
            <img
              src={livePost.imageUrl}
              alt={livePost.caption}
              className="w-full aspect-square object-cover"
            />
          )}
        </div>

        {/* Actions + caption */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="flex items-center gap-4 mb-2">
            <button
              type="button"
              onClick={() => toggleLike(livePost.id)}
              className="flex items-center gap-1.5 text-sm transition-all"
              aria-label="Like"
            >
              <Heart
                size={20}
                className={
                  livePost.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-white/60"
                }
              />
              <span
                className={livePost.isLiked ? "text-red-400" : "text-white/60"}
              >
                {formatCount(livePost.likes)}
              </span>
            </button>
            <div className="flex items-center gap-1.5 text-sm text-white/40">
              <MessageCircle size={18} />
              <span>{livePost.comments.length}</span>
            </div>
            {isOwn && (
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mb-2">
              <textarea
                className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                rows={2}
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
              />
              <div className="flex gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Caption updated");
                    setIsEditing(false);
                  }}
                  className="text-xs text-white font-medium px-3 py-1 rounded-lg transition-all"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            livePost.caption && (
              <p className="text-sm text-white/80 mb-2 leading-relaxed">
                {livePost.caption}
              </p>
            )
          )}
        </div>

        {/* Comments */}
        <div
          className="flex-1 overflow-y-auto px-4 pb-2 space-y-2 min-h-0"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}
        >
          {livePost.comments.length === 0 && (
            <p className="text-xs text-white/30 text-center py-4">
              No comments yet. Be the first!
            </p>
          )}
          {livePost.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                }}
              >
                {comment.author.avatarUrl ? (
                  <img
                    src={comment.author.avatarUrl}
                    alt={comment.author.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {comment.author.username[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white mr-1.5">
                  {comment.author.username}
                </span>
                <span className="text-xs text-white/70">{comment.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            className="flex-1 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 14,
            }}
          />
          <button
            type="button"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:opacity-80 transition-opacity"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
            aria-label="Post comment"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PostGrid({
  posts,
  isOwn = false,
}: {
  posts: ReturnType<typeof useApp>["posts"];
  isOwn?: boolean;
}) {
  const [selectedPost, setSelectedPost] = useState<MockPost | null>(null);

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
          <motion.button
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedPost(post)}
            type="button"
            className="aspect-square overflow-hidden cursor-pointer group relative bg-black/20"
            aria-label="View post"
          >
            {post.mediaType === "video" ? (
              <video
                src={post.imageUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
              >
                <track kind="captions" />
              </video>
            ) : (
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-4 text-white text-sm font-semibold">
                <span>♥ {formatCount(post.likes)}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            key="post-detail"
            post={selectedPost}
            isOwn={isOwn}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ReelOverlay({
  reel,
  onClose,
}: {
  reel: MockReel;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-[360px] rounded-3xl overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
        style={{ aspectRatio: "9/16", maxHeight: "85vh" }}
      >
        {reel.videoUrl ? (
          <video
            src={reel.videoUrl}
            poster={reel.thumbnailUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            playsInline
            controls={false}
          >
            <track kind="captions" />
          </video>
        ) : (
          <img
            src={reel.thumbnailUrl}
            alt={reel.caption}
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
          aria-label="Close reel"
        >
          <X size={18} />
        </button>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={reel.author.avatarUrl}
              alt={reel.author.username}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white/50"
            />
            <span className="text-sm font-semibold text-white">
              @{reel.author.username}
            </span>
          </div>
          <p className="text-sm text-white/85 leading-snug mb-3">
            {reel.caption}
          </p>
          <div className="flex items-center gap-5 text-white/80">
            <div className="flex items-center gap-1.5 text-sm">
              <Heart size={16} />
              <span>{formatCount(reel.likes)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <MessageCircle size={16} />
              <span>{formatCount(reel.comments)}</span>
            </div>
            <div className="text-xs text-white/50">
              {formatCount(reel.views)} views
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReelGrid({ reels }: { reels: MockReel[] }) {
  const [selectedReel, setSelectedReel] = useState<MockReel | null>(null);

  if (reels.length === 0) {
    return (
      <div className="text-center py-16 text-white/30">
        <Film size={40} className="mx-auto mb-3 opacity-50" />
        <p>No reels yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5">
        {reels.map((reel, i) => (
          <motion.button
            key={reel.id}
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setSelectedReel(reel)}
            aria-label="View reel"
            className="aspect-square overflow-hidden cursor-pointer group relative bg-black/20"
          >
            <img
              src={reel.thumbnailUrl}
              alt={reel.caption}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Play icon overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1 text-white">
                <Play size={28} className="fill-white drop-shadow" />
                <span className="text-xs font-medium drop-shadow">
                  {formatCount(reel.views)}
                </span>
              </div>
            </div>
            {/* Duration badge */}
            <div className="absolute bottom-1.5 right-1.5 text-[10px] text-white/80 bg-black/50 rounded px-1 py-0.5 font-medium">
              {reel.duration}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedReel && (
          <ReelOverlay
            reel={selectedReel}
            onClose={() => setSelectedReel(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function ProfilePage() {
  const { username } = useParams({ strict: false });
  const navigate = useNavigate();
  const {
    posts,
    savedPosts,
    reels,
    stories,
    followUser,
    unfollowUser,
    isFollowing,
  } = useApp();
  const { currentUser } = useAuthContext();

  const isOwnProfile =
    username === "me" ||
    username === currentUser?.username ||
    (!username && !!currentUser);

  // Build a user object from registry or defaults
  const registryUser = username && !isOwnProfile ? getUser(username) : null;

  const fallbackUser = {
    id: username ?? "me",
    username:
      registryUser?.username ?? username ?? currentUser?.username ?? "user",
    displayName:
      registryUser?.displayName ??
      username ??
      currentUser?.displayName ??
      "User",
    avatarUrl: registryUser?.avatarUrl ?? "",
    bio: registryUser?.bio ?? "",
    websiteUrl: registryUser?.websiteUrl ?? "",
    isPrivate: registryUser?.isPrivate ?? false,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isFollowing: false,
    isVerified: false,
  };

  // For own profile, build a user object that reflects stored account data
  const ownProfileUser =
    isOwnProfile && currentUser
      ? {
          ...fallbackUser,
          username: currentUser.username ?? fallbackUser.username,
          displayName: currentUser.displayName ?? fallbackUser.displayName,
          avatarUrl:
            currentUser.avatarUrl && currentUser.avatarUrl !== ""
              ? currentUser.avatarUrl
              : fallbackUser.avatarUrl,
          bio: currentUser.bio ?? fallbackUser.bio,
          followersCount: currentUser.followersCount ?? 0,
          followingCount: currentUser.followingCount ?? 0,
          postsCount: currentUser.postsCount ?? 0,
        }
      : null;

  const user = isOwnProfile && ownProfileUser ? ownProfileUser : fallbackUser;

  const myUsername = currentUser?.username ?? "";
  const targetUsername = user.username;
  const followed = isFollowing(targetUsername, myUsername);

  const userPosts = posts.filter((p) => {
    if (isOwnProfile)
      return p.author.username === myUsername || p.author.id === "me";
    return p.author.username === username;
  });

  const userReels = reels.filter((r) => {
    if (isOwnProfile)
      return r.author.username === myUsername || r.author.id === "me";
    return r.author.username === username;
  });

  const hasStory = stories.some(
    (s) =>
      s.author.username === user.username ||
      (isOwnProfile && s.author.id === "me"),
  );

  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);

  const handleFollow = () => {
    if (followed) {
      unfollowUser(targetUsername, myUsername);
      toast(`Unfollowed @${targetUsername}`, { duration: 2000 });
    } else {
      followUser(targetUsername, myUsername);
      toast(`Following @${targetUsername}`, { duration: 2000 });
    }
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
            hasStory={hasStory}
            isViewed={false}
            onClick={() =>
              navigate({
                to: "/stories/$userId",
                params: { userId: user.id },
              })
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
                  {user.isPrivate && (
                    <Lock size={14} className="text-white/40" />
                  )}
                </div>
                <p className="text-sm text-white/60">{user.displayName}</p>
              </div>

              {isOwnProfile ? (
                <div className="flex gap-2 flex-shrink-0">
                  <Link to="/profile/edit">
                    <GlassButton
                      variant="glass"
                      size="sm"
                      className="min-h-[36px]"
                    >
                      Edit
                    </GlassButton>
                  </Link>
                  <Link to="/settings">
                    <GlassButton
                      variant="ghost"
                      size="icon"
                      className="min-h-[36px] min-w-[36px]"
                    >
                      <Settings size={16} />
                    </GlassButton>
                  </Link>
                </div>
              ) : (
                <div className="flex gap-2">
                  <GlassButton
                    variant={followed ? "glass" : "gradient"}
                    size="sm"
                    onClick={handleFollow}
                    glow={!followed}
                  >
                    {followed ? (
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
                {
                  label: "posts",
                  value: userPosts.length,
                },
                {
                  label: "followers",
                  value: isOwnProfile
                    ? (user.followersCount ?? 0)
                    : fallbackUser.followersCount + (followed ? 1 : 0),
                },
                {
                  label: "following",
                  value: isOwnProfile
                    ? (user.followingCount ?? 0)
                    : fallbackUser.followingCount,
                },
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
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
              {user.bio}
            </p>
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

        {/* Own profile stat strip */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 glass rounded-xl px-4 py-2.5 mb-4"
          >
            <div className="flex items-center gap-1.5 text-sm">
              <Heart size={14} className="text-secondary" />
              <span className="text-white/60 text-xs">Total Likes:</span>
              <span className="text-white font-semibold text-xs">
                {formatCount(totalLikes)}
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-sm">
              <Grid size={14} className="text-primary" />
              <span className="text-white/60 text-xs">Total Posts:</span>
              <span className="text-white font-semibold text-xs">
                {userPosts.length}
              </span>
            </div>
          </motion.div>
        )}

        {/* Story highlights — "New" button only, no fake highlights */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              className="w-16 h-16 rounded-full glass border border-dashed border-white/30 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-200"
              aria-label="Add highlight"
              onClick={() => toast.info("Highlights coming soon")}
            >
              <Plus size={20} className="text-white/50" />
            </button>
            <span className="text-xs text-white/40">New</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full glass rounded-none border-t border-b border-white/8 bg-transparent h-12 p-0">
          {[
            { value: "posts", icon: <Grid size={18} /> },
            { value: "reels", icon: <Film size={18} /> },
            { value: "tagged", icon: <Tag size={18} /> },
            { value: "saved", icon: <Bookmark size={18} /> },
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
          <PostGrid posts={userPosts} isOwn={isOwnProfile} />
        </TabsContent>
        <TabsContent value="reels" className="mt-0">
          <ReelGrid reels={userReels} />
        </TabsContent>
        <TabsContent value="tagged" className="mt-0">
          <div className="text-center py-16 text-white/30">
            <Tag size={40} className="mx-auto mb-3 opacity-50" />
            <p>No tagged posts</p>
          </div>
        </TabsContent>
        <TabsContent value="saved" className="mt-0">
          {savedPosts.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <Bookmark size={40} className="mx-auto mb-3 opacity-50" />
              <p>No saved posts yet</p>
            </div>
          ) : (
            <PostGrid posts={savedPosts} isOwn={false} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
