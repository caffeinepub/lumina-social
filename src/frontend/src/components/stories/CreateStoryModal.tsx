import { GlassButton } from "@/components/glass/GlassButton";
import { MusicSearchPicker } from "@/components/music/MusicSearchPicker";
import { STORY_GRADIENTS } from "@/data/mockData";
import type { MockStory, MusicTrack } from "@/types";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface CreateStoryModalProps {
  open: boolean;
  onClose: () => void;
  onShare: (story: MockStory) => void;
  currentUserId: string;
  currentUserAvatarUrl: string;
  currentUserDisplayName: string;
  currentUsername: string;
}

export function CreateStoryModal({
  open,
  onClose,
  onShare,
  currentUserId,
  currentUserAvatarUrl,
  currentUserDisplayName,
  currentUsername,
}: CreateStoryModalProps) {
  const [selectedGradient, setSelectedGradient] = useState(STORY_GRADIENTS[0]);
  const [text, setText] = useState("");
  const [music, setMusic] = useState<MusicTrack | undefined>(undefined);

  const handleShare = () => {
    const story: MockStory = {
      id: `story_new_${Date.now()}`,
      author: {
        id: currentUserId,
        username: currentUsername,
        displayName: currentUserDisplayName,
        bio: "",
        avatarUrl: currentUserAvatarUrl,
        websiteUrl: "",
        isPrivate: false,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        isFollowing: false,
        isVerified: false,
      },
      imageGradient: selectedGradient,
      text: text.trim() || undefined,
      musicTrack: music,
      timestamp: new Date(),
      isViewed: false,
      duration: 5000,
    };
    onShare(story);
    setText("");
    setMusic(undefined);
    setSelectedGradient(STORY_GRADIENTS[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-card w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Create Story</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center glass rounded-full text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-5">
              {/* Left: controls */}
              <div className="flex-1 space-y-4">
                {/* Gradient picker */}
                <div>
                  <p className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">
                    Background
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STORY_GRADIENTS.map((grad, i) => (
                      <button
                        // biome-ignore lint/suspicious/noArrayIndexKey: gradient list is stable
                        key={i}
                        type="button"
                        onClick={() => setSelectedGradient(grad)}
                        className={`w-8 h-8 rounded-full transition-all duration-200 ${
                          selectedGradient === grad
                            ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110"
                            : "opacity-70 hover:opacity-100 hover:scale-105"
                        }`}
                        style={{ background: grad }}
                        aria-label={`Select gradient ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Text input */}
                <div>
                  <p className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">
                    Text (optional)
                  </p>
                  <textarea
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 bg-white/5 border border-white/10 outline-none focus:border-primary/50 focus:bg-white/8 transition-all duration-200 resize-none"
                    placeholder="What's on your mind?"
                    value={text}
                    maxLength={120}
                    rows={2}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                {/* Music */}
                <div>
                  <p className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">
                    Music (optional)
                  </p>
                  <MusicSearchPicker value={music} onChange={setMusic} />
                </div>
              </div>

              {/* Right: preview */}
              <div className="flex-shrink-0">
                <p className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">
                  Preview
                </p>
                <div
                  className="w-24 h-40 rounded-2xl overflow-hidden flex items-end justify-center pb-3 relative"
                  style={{ background: selectedGradient }}
                >
                  {text && (
                    <p className="text-white text-[10px] font-semibold text-center drop-shadow-lg px-2 leading-tight">
                      {text}
                    </p>
                  )}
                  {!text && (
                    <p className="text-white/30 text-[10px] text-center px-2">
                      Your story
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <GlassButton
                variant="glass"
                size="sm"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="gradient"
                size="sm"
                onClick={handleShare}
                glow
                className="flex-1"
              >
                Share Story
              </GlassButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
