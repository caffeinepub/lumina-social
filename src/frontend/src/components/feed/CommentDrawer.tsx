import { GlassInput } from "@/components/glass/GlassInput";
import { formatRelativeTime } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockComment } from "@/types";
import { Heart, Reply, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: MockComment[];
  onAddComment: (text: string) => void;
  title?: string;
}

interface ReplyingTo {
  username: string;
  commentId: string;
}

function CommentItem({
  comment,
  onReply,
}: {
  comment: MockComment;
  onReply: (username: string, commentId: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
    >
      <img
        src={comment.author.avatarUrl}
        alt={comment.author.displayName}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-sm font-semibold text-white mr-2">
              {comment.author.username}
            </span>
            <span className="text-sm text-white/80 leading-relaxed">
              {comment.text}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLike}
            className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5"
            aria-label={isLiked ? "Unlike comment" : "Like comment"}
          >
            <Heart
              size={14}
              className={cn(
                "transition-all duration-200",
                isLiked
                  ? "fill-red-400 text-red-400"
                  : "text-white/40 hover:text-white/70",
              )}
            />
            {likeCount > 0 && (
              <span className="text-[10px] text-white/40">{likeCount}</span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs text-white/30">
            {formatRelativeTime(comment.timestamp)}
          </p>
          <button
            type="button"
            onClick={() => onReply(comment.author.username, comment.id)}
            className="flex items-center gap-1 text-xs text-white/30 hover:text-violet-400 transition-colors"
          >
            <Reply size={11} />
            Reply
          </button>
        </div>
        {/* Replies (nested) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2 pl-2 border-l border-white/10">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex items-start gap-2">
                <img
                  src={reply.author.avatarUrl}
                  alt={reply.author.username}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white mr-1.5">
                    {reply.author.username}
                  </span>
                  <span className="text-xs text-white/70">{reply.text}</span>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {formatRelativeTime(reply.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CommentDrawer({
  isOpen,
  onClose,
  comments,
  onAddComment,
  title = "Comments",
}: CommentDrawerProps) {
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReply = (username: string, commentId: string) => {
    setReplyingTo({ username, commentId });
    setInputText(`@${username} `);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setInputText("");
  };

  const handleSubmit = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setInputText("");
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && replyingTo) {
      handleCancelReply();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[600px]"
          >
            <div className="glass-card rounded-t-3xl rounded-b-none border-t border-white/10 flex flex-col max-h-[70vh]">
              {/* Handle + header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0 relative">
                <div className="w-10 h-1 rounded-full bg-white/20 absolute top-2.5 left-1/2 -translate-x-1/2" />
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center glass rounded-full text-white/60 hover:text-white transition-colors"
                  aria-label="Close comments"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto px-5 overscroll-contain">
                {comments.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-white/30 text-sm">
                      No comments yet. Be the first!
                    </p>
                  </div>
                ) : (
                  <div>
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Reply banner */}
              {replyingTo && (
                <div
                  className="flex items-center justify-between px-4 py-2 flex-shrink-0"
                  style={{
                    background: "rgba(124,58,237,0.1)",
                    borderTop: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  <p className="text-xs text-violet-400">
                    Replying to{" "}
                    <span className="font-semibold">
                      @{replyingTo.username}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={handleCancelReply}
                    className="text-white/40 hover:text-white transition-colors"
                    aria-label="Cancel reply"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Sticky input row */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-white/8 flex-shrink-0">
                <div className="flex-1">
                  <GlassInput
                    ref={inputRef}
                    placeholder={
                      replyingTo
                        ? `Reply to @${replyingTo.username}...`
                        : "Add a comment..."
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-sm"
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!inputText.trim()}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
                  aria-label="Send comment"
                >
                  <Send size={16} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
