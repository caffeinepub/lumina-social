import { GlassButton } from "@/components/glass/GlassButton";
import { MusicSearchPicker } from "@/components/music/MusicSearchPicker";
import { Slider } from "@/components/ui/slider";
import { STORY_GRADIENTS } from "@/data/mockData";
import type { MockStory, MusicTrack } from "@/types";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Music,
  Paintbrush,
  Smile,
  Type,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TextOverlay {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  align: "left" | "center" | "right";
  x: number;
  y: number;
}

interface DrawStroke {
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

type ToolTab = "text" | "draw" | "stickers" | "music" | "background";

const TEXT_COLORS = [
  "#ffffff",
  "#000000",
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C77DFF",
  "#FF9A3C",
  "#00D9FF",
  "#FF85B3",
];

const DRAW_COLORS = [
  "#ffffff",
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C77DFF",
];

const STICKERS = [
  "🔥",
  "✨",
  "💫",
  "🎉",
  "🌸",
  "💕",
  "🤩",
  "🙌",
  "👏",
  "💖",
  "🌈",
  "⭐",
  "🦋",
  "🎵",
  "🎨",
  "💎",
  "🌙",
  "☁️",
  "🌊",
  "🏔️",
  "🎭",
  "🎪",
  "🎯",
  "🎲",
  "🎸",
  "🎤",
  "🌺",
  "🍀",
  "🦄",
  "🚀",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "😍",
  "🥰",
];

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
  const [activeTab, setActiveTab] = useState<ToolTab>("background");

  // Background
  const [selectedGradient, setSelectedGradient] = useState(STORY_GRADIENTS[0]);
  const [bgImage, setBgImage] = useState<string | undefined>(undefined);

  // Text overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [textInput, setTextInput] = useState("");
  const [textFontSize, setTextFontSize] = useState(20);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center",
  );

  // Draw
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [drawColor, setDrawColor] = useState("#ffffff");
  const [drawSize, setDrawSize] = useState(4);

  // Music
  const [music, setMusic] = useState<MusicTrack | undefined>(undefined);

  // Background image upload
  const bgFileRef = useRef<HTMLInputElement>(null);

  const previewWidth = 270;
  const previewHeight = 480;

  // Redraw canvas strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (const pt of stroke.points.slice(1)) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
  }, [strokes]);

  const getCanvasPos = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: getCanvasPos is a stable inline helper with no state deps
  const startDraw = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      if (activeTab !== "draw") return;
      e.preventDefault();
      isDrawingRef.current = true;
      const pos = getCanvasPos(e);
      currentStrokeRef.current = [pos];
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    },
    [activeTab],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: getCanvasPos is a stable inline helper with no state deps
  const continueDraw = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      if (!isDrawingRef.current || activeTab !== "draw") return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      currentStrokeRef.current.push(pos);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    },
    [activeTab, drawColor, drawSize],
  );

  const endDraw = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (currentStrokeRef.current.length > 1) {
      setStrokes((prev) => [
        ...prev,
        {
          color: drawColor,
          size: drawSize,
          points: [...currentStrokeRef.current],
        },
      ]);
    }
    currentStrokeRef.current = [];
  }, [drawColor, drawSize]);

  const handleAddText = () => {
    if (!textInput.trim()) return;
    const overlay: TextOverlay = {
      id: `text_${Date.now()}`,
      text: textInput.trim(),
      fontSize: textFontSize,
      color: textColor,
      align: textAlign,
      x: 50,
      y: 40 + textOverlays.length * 12,
    };
    setTextOverlays((prev) => [...prev, overlay]);
    setTextInput("");
  };

  const handleAddSticker = (emoji: string) => {
    const overlay: TextOverlay = {
      id: `sticker_${Date.now()}`,
      text: emoji,
      fontSize: 36,
      color: "transparent",
      align: "center",
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
    };
    setTextOverlays((prev) => [...prev, overlay]);
  };

  const handleRemoveOverlay = (id: string) => {
    setTextOverlays((prev) => prev.filter((o) => o.id !== id));
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
  };

  const handleShare = () => {
    const allText = textOverlays
      .filter((o) => o.fontSize < 30) // non-stickers
      .map((o) => o.text)
      .join(" ");

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
      imageGradient: bgImage ? "none" : selectedGradient,
      text: allText.trim() || undefined,
      musicTrack: music,
      timestamp: new Date(),
      isViewed: false,
      duration: 5000,
    };
    onShare(story);
    // Reset
    setTextOverlays([]);
    setStrokes([]);
    setMusic(undefined);
    setBgImage(undefined);
    setSelectedGradient(STORY_GRADIENTS[0]);
    setActiveTab("background");
    onClose();
  };

  const tabs: { id: ToolTab; icon: React.ReactNode; label: string }[] = [
    {
      id: "background",
      icon: (
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
      ),
      label: "BG",
    },
    { id: "text", icon: <Type size={16} />, label: "Text" },
    { id: "draw", icon: <Paintbrush size={16} />, label: "Draw" },
    { id: "stickers", icon: <Smile size={16} />, label: "Stickers" },
    { id: "music", icon: <Music size={16} />, label: "Music" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl h-[calc(100vh-40px)] max-h-[800px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors border border-white/10"
              >
                <X size={14} />
                Cancel
              </button>
              <h2 className="text-white font-bold text-base tracking-wide">
                Create Story
              </h2>
              <GlassButton
                variant="gradient"
                size="sm"
                onClick={handleShare}
                glow
                className="px-5"
              >
                Share Story
              </GlassButton>
            </div>

            {/* Main content */}
            <div className="flex flex-1 gap-4 px-5 pb-5 min-h-0">
              {/* Left sidebar - tools */}
              <div className="w-72 flex-shrink-0 glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                {/* Tab buttons */}
                <div className="flex border-b border-white/8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all ${
                        activeTab === tab.id
                          ? "text-primary border-b-2 border-primary bg-primary/5"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Background tab */}
                  {activeTab === "background" && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-white/50 mb-3 font-medium uppercase tracking-wider">
                          Gradients
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {STORY_GRADIENTS.map((grad, i) => (
                            <button
                              // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                              key={i}
                              type="button"
                              onClick={() => {
                                setSelectedGradient(grad);
                                setBgImage(undefined);
                              }}
                              className={`w-full aspect-square rounded-xl transition-all duration-200 ${
                                selectedGradient === grad && !bgImage
                                  ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-105"
                                  : "opacity-70 hover:opacity-100 hover:scale-105"
                              }`}
                              style={{ background: grad }}
                              aria-label={`Gradient ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-3 font-medium uppercase tracking-wider">
                          Upload Image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={bgFileRef}
                          className="hidden"
                          onChange={handleBgImageUpload}
                        />
                        <button
                          type="button"
                          onClick={() => bgFileRef.current?.click()}
                          className={`w-full glass rounded-xl py-3 flex items-center justify-center gap-2 text-sm transition-all border ${
                            bgImage
                              ? "border-primary/50 text-primary"
                              : "border-white/10 text-white/60 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <Upload size={14} />
                          {bgImage ? "Image selected ✓" : "Upload background"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Text tab */}
                  {activeTab === "text" && (
                    <div className="space-y-4">
                      <textarea
                        className="w-full glass rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 bg-white/5 border border-white/10 outline-none focus:border-primary/50 transition-all resize-none"
                        placeholder="Add text to your story..."
                        value={textInput}
                        rows={3}
                        onChange={(e) => setTextInput(e.target.value)}
                      />

                      <div>
                        <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">
                          Font Size: {textFontSize}px
                        </p>
                        <Slider
                          min={12}
                          max={48}
                          step={2}
                          value={[textFontSize]}
                          onValueChange={(v) => setTextFontSize(v[0] ?? 20)}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">
                          Color
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {TEXT_COLORS.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setTextColor(c)}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${
                                textColor === c
                                  ? "border-white scale-110"
                                  : "border-white/20 hover:scale-105"
                              }`}
                              style={{ backgroundColor: c }}
                              aria-label={`Color ${c}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">
                          Alignment
                        </p>
                        <div className="flex gap-2">
                          {(["left", "center", "right"] as const).map((a) => (
                            <button
                              key={a}
                              type="button"
                              onClick={() => setTextAlign(a)}
                              className={`flex-1 py-2 glass rounded-lg flex items-center justify-center transition-all ${
                                textAlign === a
                                  ? "bg-primary/20 border border-primary/40 text-primary"
                                  : "border border-white/10 text-white/50 hover:text-white"
                              }`}
                            >
                              {a === "left" ? (
                                <AlignLeft size={14} />
                              ) : a === "center" ? (
                                <AlignCenter size={14} />
                              ) : (
                                <AlignRight size={14} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <GlassButton
                        variant="gradient"
                        size="sm"
                        onClick={handleAddText}
                        disabled={!textInput.trim()}
                        className="w-full"
                      >
                        Add Text
                      </GlassButton>

                      {textOverlays.filter((o) => o.fontSize < 30).length >
                        0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">
                            Added text
                          </p>
                          {textOverlays
                            .filter((o) => o.fontSize < 30)
                            .map((o) => (
                              <div
                                key={o.id}
                                className="flex items-center gap-2 glass rounded-lg px-2.5 py-1.5"
                              >
                                <span
                                  className="flex-1 text-xs truncate"
                                  style={{
                                    color:
                                      o.color === "transparent"
                                        ? "#fff"
                                        : o.color,
                                  }}
                                >
                                  {o.text}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOverlay(o.id)}
                                  className="text-white/30 hover:text-red-400 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Draw tab */}
                  {activeTab === "draw" && (
                    <div className="space-y-4">
                      <div className="glass rounded-xl p-3 border border-white/10 text-center">
                        <p className="text-xs text-white/60">
                          Draw directly on the canvas preview →
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">
                          Color
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {DRAW_COLORS.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setDrawColor(c)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                drawColor === c
                                  ? "border-white scale-110"
                                  : "border-white/20 hover:scale-105"
                              }`}
                              style={{ backgroundColor: c }}
                              aria-label={`Draw color ${c}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">
                          Brush Size: {drawSize}px
                        </p>
                        <div className="flex gap-2">
                          {[2, 4, 8, 14].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setDrawSize(s)}
                              className={`flex-1 py-2.5 glass rounded-lg flex items-center justify-center transition-all border ${
                                drawSize === s
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-white/10 hover:border-white/20"
                              }`}
                            >
                              <div
                                className="rounded-full bg-white"
                                style={{
                                  width: Math.min(s, 14),
                                  height: Math.min(s, 14),
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStrokes([])}
                        className="w-full glass rounded-xl py-2.5 text-sm text-red-400/80 hover:text-red-400 border border-white/10 hover:border-red-400/20 transition-all"
                      >
                        Clear Drawing
                      </button>
                    </div>
                  )}

                  {/* Stickers tab */}
                  {activeTab === "stickers" && (
                    <div>
                      <p className="text-[10px] text-white/40 mb-3 uppercase tracking-wider">
                        Tap to add
                      </p>
                      <div className="grid grid-cols-5 gap-1">
                        {STICKERS.map((sticker) => (
                          <button
                            key={sticker}
                            type="button"
                            onClick={() => handleAddSticker(sticker)}
                            className="text-2xl p-2 rounded-lg hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
                          >
                            {sticker}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Music tab */}
                  {activeTab === "music" && (
                    <div className="space-y-3">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">
                        Add music to story
                      </p>
                      <MusicSearchPicker value={music} onChange={setMusic} />
                    </div>
                  )}
                </div>
              </div>

              {/* Center: large canvas preview */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  style={{
                    width: previewWidth,
                    height: previewHeight,
                    background: bgImage ? undefined : selectedGradient,
                  }}
                >
                  {/* Background image */}
                  {bgImage && (
                    <img
                      src={bgImage}
                      alt="Story background"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Text & sticker overlays */}
                  {textOverlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      className="absolute group"
                      style={{
                        left: `${overlay.x}%`,
                        top: `${overlay.y}%`,
                        transform: "translate(-50%, -50%)",
                        textAlign: overlay.align,
                        maxWidth: "80%",
                      }}
                    >
                      <span
                        className="drop-shadow-lg select-none leading-tight inline-block"
                        style={{
                          fontSize: overlay.fontSize,
                          color:
                            overlay.color === "transparent"
                              ? undefined
                              : overlay.color,
                        }}
                      >
                        {overlay.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOverlay(overlay.id)}
                        className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {/* Drawing canvas */}
                  <canvas
                    ref={canvasRef}
                    width={previewWidth}
                    height={previewHeight}
                    className="absolute inset-0 w-full h-full"
                    style={{
                      cursor: activeTab === "draw" ? "crosshair" : "default",
                      touchAction: activeTab === "draw" ? "none" : "auto",
                    }}
                    onMouseDown={startDraw}
                    onMouseMove={continueDraw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={continueDraw}
                    onTouchEnd={endDraw}
                  />

                  {/* Music mini-bar */}
                  {music && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2">
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ animation: "spin 3s linear infinite" }}
                      >
                        {music.artworkUrl ? (
                          <img
                            src={music.artworkUrl}
                            alt={music.title}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full gradient-bg flex items-center justify-center">
                            <Music size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[10px] font-medium truncate">
                          {music.title}
                        </p>
                        <p className="text-white/60 text-[9px] truncate">
                          {music.artist}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Draw hint overlay */}
                  {activeTab === "draw" && strokes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-white/30 text-xs text-center">
                        <Paintbrush
                          size={24}
                          className="mx-auto mb-2 opacity-50"
                        />
                        Draw here
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-white/30 text-xs mt-3">
                  {activeTab === "draw"
                    ? "Draw on the canvas above"
                    : "Preview"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
