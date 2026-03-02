import { useApp } from "@/context/AppContext";
import { MOCK_CONVERSATIONS } from "@/data/mockData";
import { Link2, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postImageUrl?: string;
  caption?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  postId,
  postImageUrl,
  caption,
}: ShareModalProps) {
  const { sendSharedPost } = useApp();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.href}?post=${postId}`,
      );
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
    onClose();
  };

  const handleShareToStory = () => {
    toast.success("Shared to your story!");
    onClose();
  };

  const handleSendToConversation = (convId: string, name: string) => {
    sendSharedPost(convId, {
      id: postId,
      imageUrl: postImageUrl ?? "",
      caption: caption ?? "",
      authorUsername: "",
    });
    toast.success(`Sent to ${name}!`);
    onClose();
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Centered modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="glass-card w-full max-w-sm p-6 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Share</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center glass rounded-full text-white/60 hover:text-white transition-colors"
                  aria-label="Close share modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Caption preview */}
              {caption && (
                <p className="text-xs text-white/40 mb-5 line-clamp-2 leading-relaxed">
                  {caption}
                </p>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-2 glass rounded-2xl py-4 px-3 hover:bg-white/8 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Link2 size={18} className="text-white" />
                  </div>
                  <span className="text-xs text-white/70">Copy Link</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareToStory}
                  className="flex flex-col items-center gap-2 glass rounded-2xl py-4 px-3 hover:bg-white/8 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Share2 size={18} className="text-white" />
                  </div>
                  <span className="text-xs text-white/70">Share to Story</span>
                </button>
              </div>

              {/* Send to conversation */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-3">
                  Send to
                </p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {MOCK_CONVERSATIONS.map((conv) => {
                    const other = conv.isGroup
                      ? null
                      : conv.participants.find((p) => p.id !== "1");
                    const name = conv.isGroup
                      ? (conv.groupName ?? "Group")
                      : (other?.displayName ?? "Unknown");
                    const avatar = conv.isGroup
                      ? conv.participants[0]?.avatarUrl
                      : other?.avatarUrl;

                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => handleSendToConversation(conv.id, name)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/8 transition-colors"
                      >
                        <img
                          src={avatar}
                          alt={name}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {name}
                          </p>
                          {conv.isGroup && (
                            <p className="text-xs text-white/40">
                              {conv.participants.length} members
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
