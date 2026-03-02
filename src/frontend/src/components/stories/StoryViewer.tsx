import { GlassInput } from "@/components/glass/GlassInput";
import { MOCK_STORIES } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface StoryViewerProps {
  userId: string;
}

const STORY_DURATION = 5000;

export function StoryViewer({ userId }: StoryViewerProps) {
  const navigate = useNavigate();
  const userStories = MOCK_STORIES.filter((s) => s.author.id === userId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");

  const currentStory = userStories[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      navigate({ to: "/" });
    }
  }, [currentIndex, userStories.length, navigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentStory is intentionally excluded
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, goNext]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate({ to: "/" });
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, goNext, goPrev]);

  if (!currentStory) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Story container */}
      <div
        className="relative w-full max-w-sm h-full md:h-[90vh] md:rounded-3xl overflow-hidden"
        style={{ background: currentStory.imageGradient }}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1.5 p-3 pt-4">
          {userStories.map((story, i) => (
            <div
              key={story.id}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-0 right-0 z-10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.author.avatarUrl}
              alt={currentStory.author.displayName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50"
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
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white"
            aria-label="Close story"
          >
            <X size={20} />
          </button>
        </div>

        {/* Story content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
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

        {/* Navigation zones */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-20"
          aria-label="Previous story"
        />
        <button
          type="button"
          onClick={goNext}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-20"
          aria-label="Next story"
        />

        {/* Reaction bar */}
        <div className="absolute bottom-6 left-4 right-4 z-20 flex items-center gap-3">
          <div className="flex-1">
            <GlassInput
              placeholder="Send a message..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="text-white text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["❤️", "🔥", "😮", "😂"].map((emoji) => (
              <button
                type="button"
                key={emoji}
                className="text-xl hover:scale-125 transition-transform duration-150"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nav arrows for desktop */}
      <button
        type="button"
        onClick={goPrev}
        className={cn(
          "absolute left-4 md:left-8 z-30 w-10 h-10 glass rounded-full flex items-center justify-center text-white transition-all hover:scale-110",
          currentIndex === 0 && "opacity-30 pointer-events-none",
        )}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 md:right-8 z-30 w-10 h-10 glass rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
