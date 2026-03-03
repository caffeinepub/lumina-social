import { useAuthContext } from "@/components/auth/AuthContext";
import { CommentDrawer } from "@/components/feed/CommentDrawer";
import { ShareModal } from "@/components/feed/ShareModal";
import { GlassAvatar } from "@/components/glass/GlassAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";
import { MOCK_USERS, formatCount, formatRelativeTime } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockPost } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Edit,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface PostCardProps {
  post: MockPost;
}

export function PostCard({ post }: PostCardProps) {
  const { toggleLike, toggleSave, addComment } = useApp();
  const { currentUser } = useAuthContext();
  const [showHeart, setShowHeart] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const lastTapRef = useRef(0);

  // Check if this is the current user's own post
  const isOwnPost =
    currentUser?.username === post.author.username || post.author.id === "me";

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!post.isLiked) {
        toggleLike(post.id);
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
    lastTapRef.current = now;
  }, [post.id, post.isLiked, toggleLike]);

  const handleLike = useCallback(() => {
    toggleLike(post.id);
    if (!post.isLiked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
  }, [post.id, post.isLiked, toggleLike]);

  const handleSave = useCallback(() => {
    toggleSave(post.id);
    toast(post.isSaved ? "Removed from saved" : "Saved to collection", {
      duration: 2000,
    });
  }, [post.id, post.isSaved, toggleSave]);

  const getCommentAuthor = useCallback(() => {
    if (currentUser) {
      return {
        id: "me",
        username: currentUser.username,
        displayName: currentUser.displayName,
        bio: currentUser.bio ?? "",
        avatarUrl:
          currentUser.avatarUrl ||
          `https://i.pravatar.cc/150?u=${currentUser.username}`,
        websiteUrl: "",
        isPrivate: false,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        isFollowing: false,
        isVerified: false,
      };
    }
    return MOCK_USERS[1]; // aurora.lens is the default mock logged-in user
  }, [currentUser]);

  const handleAddComment = useCallback(
    (text: string) => {
      addComment(post.id, text, getCommentAuthor());
    },
    [post.id, addComment, getCommentAuthor],
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <GlassAvatar
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            size="md"
            hasStory={post.hasStory}
            isViewed={false}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                to="/profile/$username"
                params={{ username: post.author.username }}
                className="text-sm font-semibold text-white hover:text-primary transition-colors"
              >
                {post.author.username}
              </Link>
              {post.author.isVerified && (
                <div className="w-3.5 h-3.5 rounded-full gradient-bg flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              )}
            </div>
            {post.location && (
              <div className="flex items-center gap-1 text-xs text-white/40">
                <MapPin size={10} />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Post options"
            >
              <MoreHorizontal size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="glass border-white/10 bg-black/80 text-white min-w-[160px]"
          >
            {isOwnPost ? (
              <>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80 gap-2">
                  <Edit size={13} />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-red-500/20 cursor-pointer text-red-400 gap-2">
                  <Trash2 size={13} />
                  Delete post
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-white/10 cursor-pointer text-white/80"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  Share
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80">
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80">
                  Unfollow
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80">
                  Mute
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-white/10 cursor-pointer text-white/80"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  Share
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media area */}
      <button
        type="button"
        className="relative w-full aspect-square cursor-pointer overflow-hidden block"
        onClick={handleDoubleTap}
        aria-label="Double tap to like"
      >
        {post.mediaType === "video" ? (
          <video
            src={post.imageUrl}
            className="w-full aspect-square object-cover"
            autoPlay={false}
            loop
            playsInline
            controls
          >
            <track kind="captions" />
          </video>
        ) : (
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full aspect-square object-cover"
            loading="lazy"
          />
        )}

        {/* Double tap heart */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              key="heart"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart
                size={80}
                className="text-white fill-white drop-shadow-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <motion.button
              type="button"
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
              className="flex items-center gap-1.5 group min-w-[44px] min-h-[44px] justify-center"
              aria-label={post.isLiked ? "Unlike post" : "Like post"}
            >
              <Heart
                size={22}
                className={cn(
                  "transition-all duration-200",
                  post.isLiked
                    ? "fill-secondary text-secondary scale-110"
                    : "text-white/70 group-hover:text-white",
                )}
              />
            </motion.button>

            <button
              type="button"
              onClick={() => setIsCommentDrawerOpen(true)}
              className="text-white/70 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="View comments"
            >
              <MessageCircle size={22} />
            </button>

            <button
              type="button"
              className="text-white/70 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Share post"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Send size={20} />
            </button>
          </div>

          <motion.button
            type="button"
            onClick={handleSave}
            whileTap={{ scale: 0.85 }}
            aria-label={post.isSaved ? "Unsave post" : "Save post"}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Bookmark
              size={22}
              className={cn(
                "transition-all duration-200",
                post.isSaved
                  ? "fill-primary text-primary"
                  : "text-white/70 hover:text-white",
              )}
            />
          </motion.button>
        </div>

        {/* Likes */}
        <p className="text-sm font-semibold text-white/90 mb-0.5">
          {formatCount(post.likes)} likes
        </p>

        {/* Views */}
        <p className="text-xs text-white/40 mb-1 flex items-center gap-1">
          <Eye size={11} />
          {formatCount(post.likes * 3 + 100)} views
        </p>

        {/* Caption */}
        <p className="text-sm text-white/80 leading-relaxed mb-1">
          <Link
            to="/profile/$username"
            params={{ username: post.author.username }}
            className="font-semibold text-white mr-1.5 hover:text-primary transition-colors"
          >
            {post.author.username}
          </Link>
          {post.caption}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <p className="text-sm text-primary/70 mb-1">{post.tags.join(" ")}</p>
        )}

        {/* Comments count — opens the full drawer */}
        <button
          type="button"
          onClick={() => setIsCommentDrawerOpen(true)}
          className="text-xs text-white/40 hover:text-white/60 transition-colors mb-1"
        >
          {post.comments.length > 0
            ? `View all ${post.comments.length} comment${post.comments.length !== 1 ? "s" : ""}`
            : "Add a comment..."}
        </button>

        {/* Timestamp */}
        <p className="text-xs text-white/30 mt-1">
          {formatRelativeTime(post.timestamp)}
        </p>
      </div>

      {/* Comment Drawer — rendered via portal to escape motion stacking context */}
      {createPortal(
        <CommentDrawer
          isOpen={isCommentDrawerOpen}
          onClose={() => setIsCommentDrawerOpen(false)}
          comments={post.comments}
          onAddComment={handleAddComment}
          title="Comments"
        />,
        document.body,
      )}

      {/* Share Modal — rendered via portal to escape motion stacking context */}
      {createPortal(
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          postId={post.id}
          postImageUrl={post.imageUrl}
          caption={post.caption}
        />,
        document.body,
      )}
    </motion.article>
  );
}
