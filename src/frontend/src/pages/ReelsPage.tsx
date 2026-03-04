import { useAuthContext } from "@/components/auth/AuthContext";
import { CommentDrawer } from "@/components/feed/CommentDrawer";
import { ShareModal } from "@/components/feed/ShareModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";
import { formatCount } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockComment, MockReel } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function ReelCard({
  reel,
  isActive,
}: {
  reel: MockReel;
  isActive: boolean;
}) {
  const { currentUser } = useAuthContext();
  const { toggleReelLike, toggleReelSave } = useApp();
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [isSaved, setIsSaved] = useState(reel.isSaved);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [localComments, setLocalComments] = useState<MockComment[]>([]);
  const [commentCountOffset, setCommentCountOffset] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState<
    string | null
  >(null);
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
      setAutoplayBlocked(false);
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toggleReelLike(reel.id);
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

  const handleSave = () => {
    setIsSaved(!isSaved);
    toggleReelSave(reel.id);
    toast(isSaved ? "Removed from saved" : "Reel saved", { duration: 2000 });
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

  const handleReportSubmit = () => {
    if (!selectedReportReason) return;
    toast.success(`Report submitted: ${selectedReportReason}`, {
      description: "Thanks for keeping Lumina safe.",
    });
    setReportOpen(false);
    setSelectedReportReason(null);
  };

  const REPORT_REASONS = [
    "Inappropriate",
    "Spam",
    "Misinformation",
    "Other",
  ] as const;

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
          data-ocid="reels.toggle"
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
          data-ocid="reels.secondary_button"
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
          data-ocid="reels.button"
        >
          <div className="w-11 h-11 rounded-full glass flex items-center justify-center">
            <Share2 size={22} className="text-white" />
          </div>
          <span className="text-xs text-white font-medium">
            {formatCount(reel.shares)}
          </span>
        </button>

        <motion.button
          onClick={handleSave}
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
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
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

        {/* ── Triple-dot menu (now working) ── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-9 h-9 rounded-full glass flex items-center justify-center"
              aria-label="More options"
              data-ocid="reels.dropdown_menu"
            >
              <MoreHorizontal size={16} className="text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-white/10 text-white min-w-[180px]"
            style={{
              background: "rgba(14,14,20,0.97)",
              backdropFilter: "blur(16px)",
            }}
          >
            <DropdownMenuItem
              className="hover:bg-white/10 cursor-pointer gap-2 text-sm"
              onClick={handleSave}
            >
              <Bookmark size={14} className="text-white/60" />
              {isSaved ? "Unsave Reel" : "Save Reel"}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="hover:bg-white/10 cursor-pointer gap-2 text-sm"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 size={14} className="text-white/60" />
              Share
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/08" />

            <DropdownMenuItem
              className="hover:bg-white/10 cursor-pointer gap-2 text-sm"
              onClick={() => {
                toast("We'll show you less of this");
              }}
            >
              <ThumbsDown size={14} className="text-white/60" />
              Not Interested
            </DropdownMenuItem>

            <DropdownMenuItem
              className="hover:bg-red-500/15 cursor-pointer gap-2 text-sm text-red-400"
              onClick={() => setReportOpen(true)}
            >
              <Flag size={14} />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Report dialog */}
      <AnimatePresence>
        {reportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
            onClick={() => setReportOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
              style={{
                background: "rgba(14,14,20,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 pt-5 pb-3 border-b border-white/08">
                <p className="text-white text-base font-semibold flex items-center gap-2">
                  <Flag size={16} className="text-red-400" />
                  Report Reel
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Why are you reporting this reel?
                </p>
              </div>
              <div className="px-5 py-3 space-y-1.5">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReportReason(reason)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all",
                      selectedReportReason === reason
                        ? "text-white bg-violet-500/20 border border-violet-500/40"
                        : "text-white/70 hover:text-white hover:bg-white/05 border border-transparent",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                        selectedReportReason === reason
                          ? "border-violet-400"
                          : "border-white/25",
                      )}
                    >
                      {selectedReportReason === reason && (
                        <div className="w-2 h-2 rounded-full bg-violet-400" />
                      )}
                    </div>
                    {reason}
                  </button>
                ))}
              </div>
              <div className="px-5 py-4 flex gap-3 border-t border-white/08">
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReportSubmit}
                  disabled={!selectedReportReason}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    selectedReportReason
                      ? "text-white hover:opacity-90"
                      : "text-white/30 cursor-not-allowed",
                  )}
                  style={{
                    background: selectedReportReason
                      ? "rgba(239,68,68,0.8)"
                      : "rgba(255,255,255,0.05)",
                  }}
                >
                  Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
  const { reels } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    setCurrentIndex(index);
  };

  if (reels.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-white/30"
        style={{ height: "100dvh" }}
        data-ocid="reels.empty_state"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-white/15 flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="opacity-30" />
          </div>
          <p className="text-lg font-semibold text-white/50 mb-1">
            No Reels Yet
          </p>
          <p className="text-sm text-white/30">
            Upload your first reel to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100dvh", overflow: "hidden" }}>
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
        onScroll={handleScroll}
      >
        {reels.map((reel, i) => (
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
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
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
