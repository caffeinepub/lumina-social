import { useAuthContext } from "@/components/auth/AuthContext";
import { CommentDrawer } from "@/components/feed/CommentDrawer";
import { ShareModal } from "@/components/feed/ShareModal";
import { MOCK_REELS, formatCount } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockComment, MockReel } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function ReelCard({
  reel,
  isActive,
}: {
  reel: MockReel;
  isActive: boolean;
}) {
  const { currentUser } = useAuthContext();
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [isSaved, setIsSaved] = useState(reel.isSaved);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [localComments, setLocalComments] = useState<MockComment[]>([]);
  const [commentCountOffset, setCommentCountOffset] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play/pause with unmuted audio; fallback to muted if autoplay blocked
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      videoRef.current.play().catch(() => {
        // Autoplay with audio blocked by browser — retry muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          setAutoplayBlocked(true);
          videoRef.current.play().catch(() => {});
        }
      });
    } else {
      videoRef.current.pause();
      // Reset autoplay blocked state so the next time this reel becomes active
      // it tries with audio again
      setAutoplayBlocked(false);
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setShowLike(true);
      setTimeout(() => setShowLike(false), 800);
    }
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setAutoplayBlocked(false);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      videoRef.current.volume = newMuted ? 0 : 1;
    }
  };

  const handleTapToUnmute = () => {
    setIsMuted(false);
    setAutoplayBlocked(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
    }
  };

  const handleAddComment = (text: string) => {
    const newComment: MockComment = {
      id: `rc_${Date.now()}`,
      author: {
        id: "me",
        username: currentUser?.username ?? "you",
        displayName: currentUser?.displayName ?? "You",
        avatarUrl: currentUser?.avatarUrl ?? "",
        bio: currentUser?.bio ?? "",
        websiteUrl: "",
        isPrivate: false,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        isFollowing: false,
        isVerified: false,
      },
      text,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    };
    setLocalComments((prev) => [...prev, newComment]);
    setCommentCountOffset((prev) => prev + 1);
  };

  return (
    <div className="relative w-full h-full flex-shrink-0 bg-black">
      {/* Video element */}
      {reel.videoUrl ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnailUrl}
          autoPlay
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        >
          <track kind="captions" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
        />
      )}

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

      {/* Tap to unmute overlay */}
      <AnimatePresence>
        {autoplayBlocked && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={handleTapToUnmute}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 glass rounded-full px-4 py-2 text-white/90 text-sm font-medium hover:bg-white/20 transition-colors"
            aria-label="Tap to unmute"
          >
            <VolumeX size={15} />
            Tap to unmute
          </motion.button>
        )}
      </AnimatePresence>

      {/* Double tap like */}
      <AnimatePresence>
        {showLike && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <Heart size={80} className="text-white fill-white drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right controls */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-20">
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.85 }}
          className="flex flex-col items-center gap-1"
          aria-label={isLiked ? "Unlike reel" : "Like reel"}
        >
          <div
            className={cn(
              "w-11 h-11 rounded-full glass flex items-center justify-center transition-all",
              isLiked && "bg-secondary/30",
            )}
          >
            <Heart
              size={22}
              className={cn(
                isLiked ? "fill-secondary text-secondary" : "text-white",
              )}
            />
          </div>
          <span className="text-xs text-white font-medium">
            {formatCount(reel.likes + (isLiked && !reel.isLiked ? 1 : 0))}
          </span>
        </motion.button>

        <button
          type="button"
          onClick={() => setIsCommentDrawerOpen(true)}
          className="flex flex-col items-center gap-1"
          aria-label="Comment on reel"
        >
          <div className="w-11 h-11 rounded-full glass flex items-center justify-center">
            <MessageCircle size={22} className="text-white" />
          </div>
          <span className="text-xs text-white font-medium">
            {formatCount(reel.comments + commentCountOffset)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="flex flex-col items-center gap-1"
          aria-label="Share reel"
        >
          <div className="w-11 h-11 rounded-full glass flex items-center justify-center">
            <Share2 size={22} className="text-white" />
          </div>
          <span className="text-xs text-white font-medium">
            {formatCount(reel.shares)}
          </span>
        </button>

        <motion.button
          onClick={() => setIsSaved(!isSaved)}
          whileTap={{ scale: 0.85 }}
          className="flex flex-col items-center gap-1"
          aria-label={isSaved ? "Unsave reel" : "Save reel"}
        >
          <div
            className={cn(
              "w-11 h-11 rounded-full glass flex items-center justify-center transition-all",
              isSaved && "bg-primary/30",
            )}
          >
            <Bookmark
              size={22}
              className={cn(
                isSaved ? "fill-primary text-primary" : "text-white",
              )}
            />
          </div>
        </motion.button>

        <Link
          to="/profile/$username"
          params={{ username: reel.author.username }}
          className="mt-1"
        >
          <div className="w-11 h-11 rounded-full ring-2 ring-white overflow-hidden">
            <img
              src={reel.author.avatarUrl}
              alt={reel.author.displayName}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-6 left-4 right-20 z-20">
        <div className="flex items-center gap-2 mb-2">
          <Link
            to="/profile/$username"
            params={{ username: reel.author.username }}
            className="flex items-center gap-2 group"
          >
            <span className="text-sm font-semibold text-white drop-shadow group-hover:text-primary transition-colors">
              @{reel.author.username}
            </span>
          </Link>
        </div>
        <p className="text-sm text-white/85 drop-shadow mb-2 leading-snug">
          {reel.caption}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full gradient-bg flex-shrink-0"
            style={{ animation: "spin 4s linear infinite" }}
          />
          <p className="text-xs text-white/70 truncate">{reel.audioTrack}</p>
        </div>
        <p className="text-xs text-white/40 mt-1">
          {formatCount(reel.views)} views · {reel.duration}
        </p>
      </div>

      {/* Top controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          type="button"
          onClick={handleToggleMute}
          className="w-9 h-9 rounded-full glass flex items-center justify-center"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX size={16} className="text-white" />
          ) : (
            <Volume2 size={16} className="text-white" />
          )}
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-full glass flex items-center justify-center"
          aria-label="More options"
        >
          <MoreHorizontal size={16} className="text-white" />
        </button>
      </div>

      {/* Comment Drawer */}
      <CommentDrawer
        isOpen={isCommentDrawerOpen}
        onClose={() => setIsCommentDrawerOpen(false)}
        comments={localComments}
        onAddComment={handleAddComment}
        title="Comments"
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postId={reel.id}
        caption={reel.caption}
      />
    </div>
  );
}

export function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    setCurrentIndex(index);
  };

  return (
    <div style={{ height: "100dvh", overflow: "hidden" }}>
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
        onScroll={handleScroll}
      >
        {MOCK_REELS.map((reel, i) => (
          <div
            key={reel.id}
            className="w-full snap-start snap-always flex items-center justify-center lg:gap-8"
            style={{ height: "100dvh" }}
          >
            {/* Reel player — proper 9:16 aspect ratio that fits the viewport */}
            <div
              className="relative flex-shrink-0 rounded-none md:rounded-3xl overflow-hidden"
              style={{
                width: "min(420px, calc(100dvh * 9 / 16))",
                height: "min(100dvh, calc(420px * 16 / 9))",
                maxHeight: "100dvh",
              }}
            >
              <ReelCard reel={reel} isActive={i === currentIndex} />
            </div>

            {/* Desktop metadata panel */}
            {i === currentIndex && (
              <div className="hidden lg:flex flex-col gap-6 w-[280px] flex-shrink-0 py-8">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile/$username"
                    params={{ username: reel.author.username }}
                  >
                    <img
                      src={reel.author.avatarUrl}
                      alt={reel.author.displayName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40"
                    />
                  </Link>
                  <div>
                    <Link
                      to="/profile/$username"
                      params={{ username: reel.author.username }}
                      className="text-sm font-semibold text-white hover:text-primary transition-colors"
                    >
                      @{reel.author.username}
                    </Link>
                    <p className="text-xs text-white/40">
                      {formatCount(reel.views)} views · {reel.duration}
                    </p>
                  </div>
                </div>

                {/* Caption */}
                <div className="glass rounded-2xl p-4">
                  <p className="text-sm text-white/85 leading-relaxed">
                    {reel.caption}
                  </p>
                </div>

                {/* Audio */}
                <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                  <div
                    className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center"
                    style={{ animation: "spin 4s linear infinite" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">
                      {reel.audioTrack}
                    </p>
                    <p className="text-[10px] text-white/40">Original audio</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3">
                  <ReelStat
                    icon={
                      <Heart
                        size={20}
                        className={cn(
                          reel.isLiked
                            ? "fill-secondary text-secondary"
                            : "text-white",
                        )}
                      />
                    }
                    label={formatCount(reel.likes)}
                    sublabel="Likes"
                  />
                  <ReelStat
                    icon={<MessageCircle size={20} className="text-white" />}
                    label={formatCount(reel.comments)}
                    sublabel="Comments"
                  />
                  <ReelStat
                    icon={<Share2 size={20} className="text-white" />}
                    label={formatCount(reel.shares)}
                    sublabel="Shares"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReelStat({
  icon,
  label,
  sublabel,
}: { icon: React.ReactNode; label: string; sublabel: string }) {
  return (
    <div className="flex items-center gap-3 glass rounded-xl px-4 py-3 cursor-pointer hover:bg-white/8 transition-colors">
      <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/40">{sublabel}</p>
      </div>
    </div>
  );
}
