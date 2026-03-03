import { GlassInput } from "@/components/glass/GlassInput";
import { MOCK_STORIES } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Send,
  Share2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface StoryViewerProps {
  userId: string;
}

const STORY_DURATION = 5000;
const REACTIONS = ["❤️", "🔥", "😮", "😂", "🙌"];

// Group stories by author
function groupStoriesByAuthor(
  stories: typeof MOCK_STORIES,
): { userId: string; stories: typeof MOCK_STORIES }[] {
  const map = new Map<string, typeof MOCK_STORIES>();
  for (const story of stories) {
    const uid = story.author.id;
    if (!map.has(uid)) map.set(uid, []);
    map.get(uid)!.push(story);
  }
  return Array.from(map.entries()).map(([userId, stories]) => ({
    userId,
    stories,
  }));
}

export function StoryViewer({ userId }: StoryViewerProps) {
  const navigate = useNavigate();

  // All stories grouped by user
  const userGroups = useMemo(() => groupStoriesByAuthor(MOCK_STORIES), []);

  // Find starting group index
  const startGroupIndex = useMemo(
    () =>
      Math.max(
        userGroups.findIndex((g) => g.userId === userId),
        0,
      ),
    [userGroups, userId],
  );

  const [groupIndex, setGroupIndex] = useState(startGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsTrayOpen, setCommentsTrayOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [storyComments, setStoryComments] = useState<
    { id: string; text: string; author: string; time: string }[]
  >([
    {
      id: "sc1",
      text: "This is amazing! 🔥",
      author: "aurora.lens",
      time: "2m",
    },
    { id: "sc2", text: "Love the vibes ✨", author: "neon.nomad", time: "5m" },
    {
      id: "sc3",
      text: "Iconic as always 👑",
      author: "velvet.sky",
      time: "8m",
    },
  ]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentGroup = userGroups[groupIndex];
  const currentUserStories = currentGroup?.stories ?? [];
  const currentStory = currentUserStories[storyIndex];

  // Viewer counts stable per session
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable per group
  const viewerCount = useMemo(
    () => currentUserStories.map(() => Math.floor(Math.random() * 500 + 100)),
    [groupIndex],
  );

  const goNext = useCallback(() => {
    // Try to advance to next story in current user group
    if (storyIndex < currentUserStories.length - 1) {
      setStoryIndex((i) => i + 1);
      setProgress(0);
    } else if (groupIndex < userGroups.length - 1) {
      // Advance to next user's stories
      setGroupIndex((g) => g + 1);
      setStoryIndex(0);
      setProgress(0);
      setIsLiked(false);
    } else {
      navigate({ to: "/" });
    }
  }, [
    storyIndex,
    currentUserStories.length,
    groupIndex,
    userGroups.length,
    navigate,
  ]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      setProgress(0);
    } else if (groupIndex > 0) {
      // Go back to previous user's last story
      const prevGroup = userGroups[groupIndex - 1];
      setGroupIndex((g) => g - 1);
      setStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
      setIsLiked(false);
    }
  }, [storyIndex, groupIndex, userGroups]);

  // Handle music playback when story changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: storyIndex/groupIndex triggers effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (currentStory?.musicTrack?.previewUrl) {
      const audio = new Audio(currentStory.musicTrack.previewUrl);
      audio.loop = true;
      audioRef.current = audio;
      audio.play().catch(() => {
        // Silently swallow autoplay errors
      });
    }
  }, [storyIndex, groupIndex]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Progress ticker
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (isPaused || !currentStory) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          goNext();
          return 0;
        }
        return p + 100 / (STORY_DURATION / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [storyIndex, groupIndex, isPaused, goNext]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate({ to: "/" });
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, goNext, goPrev]);

  const handleReaction = (emoji: string) => {
    setFloatingReaction(emoji);
    setTimeout(() => setFloatingReaction(null), 700);
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      setFloatingReaction("❤️");
      setTimeout(() => setFloatingReaction(null), 700);
    }
  };

  const handleShare = () => {
    toast.success("Story link copied!");
  };

  if (!currentStory) {
    navigate({ to: "/" });
    return null;
  }

  const canGoPrev = storyIndex > 0 || groupIndex > 0;
  const canGoNext =
    storyIndex < currentUserStories.length - 1 ||
    groupIndex < userGroups.length - 1;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      {/* Blurred background layer */}
      <div
        className="absolute inset-0"
        style={{
          background: currentStory.imageGradient,
          filter: "blur(40px)",
          transform: "scale(1.1)",
          opacity: 0.6,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Desktop nav arrows — safe position */}
      <button
        type="button"
        onClick={goPrev}
        className={cn(
          "absolute left-4 z-30 w-10 h-10 glass rounded-full flex items-center justify-center text-white transition-all hover:scale-110",
          !canGoPrev && "opacity-30 pointer-events-none",
        )}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={goNext}
        className={cn(
          "absolute right-4 z-30 w-10 h-10 glass rounded-full flex items-center justify-center text-white transition-all hover:scale-110",
          !canGoNext && "opacity-30 pointer-events-none",
        )}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Story container */}
      <div
        className="relative w-full max-w-[420px] h-full md:h-[90vh] md:rounded-3xl overflow-hidden z-10"
        style={{ background: currentStory.imageGradient }}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress bars — only for current user's stories */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1.5 p-3 pt-4">
          {currentUserStories.map((story, i) => (
            <div
              key={story.id}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    i < storyIndex
                      ? "100%"
                      : i === storyIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header — z-30 to sit above nav zones (z-20) */}
        <div className="absolute top-8 left-0 right-0 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.author.avatarUrl}
              alt={currentStory.author.displayName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <p className="text-sm font-semibold text-white drop-shadow">
                {currentStory.author.username}
              </p>
              <p className="text-xs text-white/70">
                {Math.round(
                  (Date.now() - currentStory.timestamp.getTime()) / 3600000,
                )}
                h ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Viewer count */}
            <div className="flex items-center gap-1 bg-black/30 rounded-full px-2 py-0.5">
              <Eye size={12} className="text-white/70" />
              <span className="text-xs text-white/70">
                {viewerCount[storyIndex] ?? 0}
              </span>
            </div>
            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Share story"
            >
              <Share2 size={18} />
            </button>
            {/* Close */}
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white relative z-40"
              aria-label="Close story"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Story content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${groupIndex}-${storyIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {currentStory.text && (
              <div className="px-8 text-center">
                <p className="text-2xl font-bold text-white drop-shadow-lg">
                  {currentStory.text}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating emoji reaction */}
        <AnimatePresence>
          {floatingReaction && (
            <motion.div
              key={floatingReaction + Date.now()}
              initial={{ scale: 1, opacity: 1, y: 0 }}
              animate={{ scale: 1.6, opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-3xl"
            >
              {floatingReaction}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation zones — start below header (top:80) so close/share/like buttons stay clickable */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-0 bottom-0 w-1/3 z-20"
          style={{ top: 80 }}
          aria-label="Previous story"
        />
        <button
          type="button"
          onClick={goNext}
          className="absolute right-0 bottom-0 w-1/3 z-20"
          style={{ top: 80 }}
          aria-label="Next story"
        />

        {/* Bottom: music bar + reply + reaction bar */}
        <div className="absolute bottom-6 left-4 right-4 z-20 space-y-2">
          {/* Music track mini-bar */}
          {currentStory.musicTrack && (
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
              <div className="w-4 h-4 rounded-full gradient-bg animate-spin flex-shrink-0" />
              <span className="text-xs text-white truncate max-w-[140px]">
                {currentStory.musicTrack.title} —{" "}
                {currentStory.musicTrack.artist}
              </span>
            </div>
          )}

          {/* Emoji reactions */}
          <div className="flex justify-center gap-3">
            {REACTIONS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-xl hover:scale-125 transition-transform duration-150 active:scale-110"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply input + like + comments button */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <GlassInput
                placeholder="Send a message..."
                value={replyText}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  setIsPaused(true);
                }}
                onFocus={() => setIsPaused(true)}
                onBlur={() => {
                  if (!replyText) setIsPaused(false);
                }}
                className="text-white text-sm"
              />
            </div>
            {/* Comments button */}
            <motion.button
              type="button"
              onClick={() => {
                setCommentsTrayOpen(true);
                setIsPaused(true);
              }}
              whileTap={{ scale: 0.85 }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.15)" }}
              aria-label="View comments"
            >
              <MessageCircle size={18} />
            </motion.button>
            <motion.button
              type="button"
              onClick={handleLike}
              whileTap={{ scale: 0.8 }}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Like story"
            >
              <Heart
                size={20}
                className={cn(
                  "transition-all duration-200",
                  isLiked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-white/60",
                )}
              />
            </motion.button>
          </div>
        </div>

        {/* Comments tray */}
        <AnimatePresence>
          {commentsTrayOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="absolute left-0 right-0 bottom-0 z-30 flex flex-col"
              style={{
                height: "60%",
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px 24px 0 0",
                border: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tray header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
                <h3 className="text-sm font-semibold text-white">Comments</h3>
                <button
                  type="button"
                  onClick={() => {
                    setCommentsTrayOpen(false);
                    setIsPaused(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Close comments"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Handle bar */}
              <div className="flex justify-center pb-2 flex-shrink-0">
                <div className="w-8 h-0.5 rounded-full bg-white/20" />
              </div>

              {/* Comments list */}
              <div
                className="flex-1 overflow-y-auto px-4 space-y-3 pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {storyComments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #db2777)",
                      }}
                    >
                      {c.author[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-white mr-1.5">
                        {c.author}
                      </span>
                      <span className="text-xs text-white/80">{c.text}</span>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {c.time} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <div
                className="flex-shrink-0 flex items-center gap-2 px-4 py-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && commentText.trim()) {
                      setStoryComments((prev) => [
                        ...prev,
                        {
                          id: `sc_${Date.now()}`,
                          text: commentText.trim(),
                          author: "you",
                          time: "just now",
                        },
                      ]);
                      setCommentText("");
                    }
                  }}
                  className="flex-1 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontSize: 14,
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!commentText.trim()) return;
                    setStoryComments((prev) => [
                      ...prev,
                      {
                        id: `sc_${Date.now()}`,
                        text: commentText.trim(),
                        author: "you",
                        time: "just now",
                      },
                    ]);
                    setCommentText("");
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  }}
                  aria-label="Post comment"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
