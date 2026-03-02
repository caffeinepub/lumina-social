import { GlassAvatar } from "@/components/glass/GlassAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";
import { formatCount, formatRelativeTime } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockPost } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface PostCardProps {
  post: MockPost;
}

export function PostCard({ post }: PostCardProps) {
  const { toggleLike, toggleSave } = useApp();
  const [showHeart, setShowHeart] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const lastTapRef = useRef(0);

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
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80">
              Report
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80">
              Unfollow
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80">
              Mute
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white/80">
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image area - using button for semantic correctness */}
      <button
        type="button"
        className="relative w-full aspect-square cursor-pointer overflow-hidden block"
        onClick={handleDoubleTap}
        aria-label="Double tap to like"
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: post.imageUrl }}
        >
          <div className="text-white/10 text-6xl font-display font-bold select-none">
            {post.author.username.charAt(0).toUpperCase()}
          </div>
        </div>

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
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
              className="flex items-center gap-1.5 group"
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
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="View comments"
            >
              <MessageCircle size={22} />
            </button>

            <button
              type="button"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Share post"
              onClick={() =>
                toast("Link copied to clipboard!", { duration: 2000 })
              }
            >
              <Send size={20} />
            </button>
          </div>

          <motion.button
            type="button"
            onClick={handleSave}
            whileTap={{ scale: 0.85 }}
            aria-label={post.isSaved ? "Unsave post" : "Save post"}
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
        <p className="text-sm font-semibold text-white/90 mb-1">
          {formatCount(post.likes)} likes
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

        {/* Comments toggle */}
        {post.comments.length > 0 && (
          <button
            type="button"
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="text-xs text-white/40 hover:text-white/60 transition-colors mb-1"
          >
            View all {post.comments.length} comments
          </button>
        )}

        {/* Comments expanded */}
        <AnimatePresence>
          {isCommentsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {post.comments.slice(0, 3).map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 mb-1.5">
                  <img
                    src={comment.author.avatarUrl}
                    alt={comment.author.username}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                  <p className="text-xs text-white/70">
                    <span className="font-semibold text-white/90 mr-1">
                      {comment.author.username}
                    </span>
                    {comment.text}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp */}
        <p className="text-xs text-white/30 mt-1">
          {formatRelativeTime(post.timestamp)}
        </p>
      </div>
    </motion.article>
  );
}
