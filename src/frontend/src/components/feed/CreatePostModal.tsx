import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import { MOCK_USERS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockPost } from "@/types";
import { Globe, Lock, MapPin, Smile, Tag, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

function getRandomGradient() {
  const gradients = [
    "linear-gradient(135deg, oklch(0.25 0.15 290), oklch(0.15 0.12 320))",
    "linear-gradient(135deg, oklch(0.2 0.1 200), oklch(0.15 0.08 240))",
    "linear-gradient(135deg, oklch(0.3 0.18 30), oklch(0.2 0.15 0))",
    "linear-gradient(135deg, oklch(0.25 0.12 150), oklch(0.18 0.1 180))",
    "linear-gradient(135deg, oklch(0.22 0.14 270), oklch(0.16 0.12 300))",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addPost } = useApp();
  const { currentUser } = useAuthContext();

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith("video/")) {
      setMediaType("video");
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/") || file?.type.startsWith("video/")) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleSubmit = async () => {
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 800));

    const author = currentUser
      ? {
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
        }
      : MOCK_USERS[1];

    const newPost: MockPost = {
      id: `post_${Date.now()}`,
      author,
      imageUrl: preview || getRandomGradient(),
      caption,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      isLiked: false,
      isSaved: false,
      location: location || undefined,
      hasStory: false,
      tags: tags ? tags.split(" ").filter(Boolean) : [],
      isPublic,
      mediaType,
    };

    addPost(newPost);
    toast.success("Post shared successfully! ✨");
    setIsUploading(false);
    setCaption("");
    setLocation("");
    setTags("");
    setPreview(null);
    setMediaType("image");
    onClose();
  };

  const handleClose = () => {
    setCaption("");
    setLocation("");
    setTags("");
    setPreview(null);
    setMediaType("image");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="glass-heavy border-white/10 text-white max-w-lg w-full p-0 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header — always visible */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              New Post
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
          {/* Upload area */}
          {!preview ? (
            <button
              type="button"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "w-full border-2 border-dashed rounded-2xl h-44 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200",
                isDragging
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/15 hover:border-white/30 hover:bg-white/3",
              )}
              aria-label="Upload image or video"
            >
              <Upload size={28} className="text-white/30" />
              <div className="text-center">
                <p className="text-sm text-white/60">
                  Drop image or video here or click to browse
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  JPG, PNG, GIF, MP4, MOV up to 50MB
                </p>
              </div>
            </button>
          ) : (
            <div className="relative rounded-2xl overflow-hidden max-h-48">
              {mediaType === "video" ? (
                <video
                  src={preview}
                  className="w-full max-h-48 object-contain"
                  controls
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={preview}
                  alt="Post preview"
                  className="w-full max-h-48 object-contain"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setMediaType("image");
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Remove media"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {/* Caption */}
          <div>
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 resize-none rounded-xl"
            />
            <div className="flex justify-between items-center mt-1">
              <button
                type="button"
                className="text-white/40 hover:text-white/60 transition-colors"
                aria-label="Add emoji"
              >
                <Smile size={16} />
              </button>
              <span className="text-xs text-white/30">
                {caption.length}/2200
              </span>
            </div>
          </div>

          {/* Location */}
          <GlassInput
            icon={<MapPin size={14} />}
            placeholder="Add location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Tags */}
          <GlassInput
            icon={<Tag size={14} />}
            placeholder="Add hashtags (e.g. #photography #art)..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Visibility */}
          <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              {isPublic ? (
                <Globe size={16} className="text-accent" />
              ) : (
                <Lock size={16} className="text-white/50" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isPublic ? "Public" : "Followers only"}
                </p>
                <p className="text-xs text-white/40">
                  {isPublic
                    ? "Anyone can see this post"
                    : "Only your followers"}
                </p>
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              aria-label="Toggle post visibility"
            />
          </div>
        </div>

        {/* Footer — always visible, never pushed out */}
        <div className="px-6 pb-5 pt-3 border-t border-white/10 flex-shrink-0">
          <GlassButton
            variant="gradient"
            className="w-full"
            size="md"
            disabled={isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? "Sharing..." : "Share Post"}
          </GlassButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
