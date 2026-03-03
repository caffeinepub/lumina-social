import { NotesPanel } from "@/components/notes/NotesPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApp } from "@/context/AppContext";
import {
  MOCK_CONVERSATIONS,
  MOCK_USERS,
  formatRelativeTime,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockConversation, MockMessage } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Edit,
  ExternalLink,
  Flag,
  Forward,
  Image,
  Info,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  Pause,
  Phone,
  Pin,
  Play,
  Search,
  Send,
  Share2,
  Smile,
  Trash2,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ME_ID = "me";
const LOGGED_IN_USER_ID = "me";

// Quick reactions for message bubbles
const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "🔥", "👍", "👎", "🙌"];

// Expanded emoji groups with 300+ emojis
const EMOJI_GROUPS = [
  {
    label: "Smileys & People",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "☺️",
      "😚",
      "😙",
      "🥲",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😌",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
      "🥵",
      "🥶",
      "🥴",
      "😵",
      "💫",
      "🤯",
      "🤠",
      "🥳",
      "🥸",
      "😎",
      "🤓",
      "🧐",
      "😕",
      "😟",
      "🙁",
      "☹️",
      "😮",
      "😯",
      "😲",
      "😳",
      "🥺",
      "😦",
      "😧",
      "😨",
      "😰",
      "😥",
      "😢",
      "😭",
      "😱",
      "😖",
      "😣",
      "😞",
      "😓",
      "😩",
      "😫",
      "🥱",
      "😤",
      "😡",
      "😠",
      "🤬",
      "😈",
      "👿",
      "💀",
      "☠️",
      "💩",
      "🤡",
      "👹",
      "👺",
      "👻",
      "👽",
      "👾",
      "🤖",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "😿",
      "😾",
    ],
  },
  {
    label: "Gestures & Body",
    emojis: [
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👍",
      "👎",
      "✊",
      "👊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💅",
      "🤳",
      "💪",
      "🦾",
      "🦿",
      "🦵",
      "🦶",
      "👂",
      "🦻",
      "👃",
      "🧠",
      "🦷",
      "🦴",
      "👀",
      "👁️",
      "👅",
      "👄",
    ],
  },
  {
    label: "Hearts & Love",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "❤️‍🔥",
      "❤️‍🩹",
      "🫶",
      "💑",
      "👫",
      "👬",
      "👭",
      "💏",
      "💒",
      "💌",
      "💍",
      "💎",
      "🌹",
    ],
  },
  {
    label: "Food & Drink",
    emojis: [
      "🍕",
      "🍔",
      "🍟",
      "🌭",
      "🍿",
      "🥓",
      "🥚",
      "🍳",
      "🧇",
      "🥞",
      "🍞",
      "🥐",
      "🥖",
      "🧀",
      "🥗",
      "🥙",
      "🌮",
      "🌯",
      "🍱",
      "🍣",
      "🍜",
      "🍛",
      "🍝",
      "🍦",
      "🍧",
      "🍨",
      "🍩",
      "🍪",
      "🎂",
      "🍰",
      "🧁",
      "🍫",
      "🍬",
      "🍭",
      "🍷",
      "🍸",
      "🍹",
      "🍺",
      "🥂",
      "🥤",
      "☕",
      "🧋",
      "🍵",
      "🍾",
      "🥛",
      "🧃",
    ],
  },
  {
    label: "Animals & Nature",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🙈",
      "🙉",
      "🙊",
      "🐔",
      "🐧",
      "🐦",
      "🐤",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🦋",
      "🌸",
      "🌺",
      "🌻",
      "🌹",
      "🌷",
      "🍀",
      "🌿",
      "🌱",
      "🌲",
      "🌳",
      "🌴",
      "🌵",
      "🌊",
      "🌈",
      "🌙",
      "⭐",
    ],
  },
  {
    label: "Travel & Places",
    emojis: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🏎",
      "🚓",
      "🚑",
      "🚒",
      "🚲",
      "✈",
      "🛩",
      "🚀",
      "🛸",
      "🚁",
      "🚂",
      "🚄",
      "🚇",
      "⛵",
      "🚢",
      "🏔",
      "⛰",
      "🌋",
      "🗻",
      "🏕",
      "🏖",
      "🏙",
      "🏠",
      "🏡",
      "🏢",
      "🏦",
      "🏨",
      "🏩",
    ],
  },
  {
    label: "Activities",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🎾",
      "🏐",
      "🏉",
      "🎱",
      "🏓",
      "🏸",
      "⛳",
      "🎣",
      "🎿",
      "🎯",
      "🎳",
      "🎮",
      "🕹",
      "🎲",
      "♟",
      "🧩",
      "🎊",
      "🎉",
      "🎈",
      "🎀",
      "🎁",
      "🏆",
      "🥇",
      "🥈",
      "🥉",
      "🏅",
      "🎤",
      "🎵",
      "🎶",
    ],
  },
  {
    label: "Objects",
    emojis: [
      "📱",
      "💻",
      "⌨",
      "🖥",
      "📷",
      "📸",
      "📹",
      "🎥",
      "📞",
      "☎",
      "📺",
      "📻",
      "⌚",
      "💡",
      "🔦",
      "🕯",
      "💰",
      "💳",
      "🪙",
      "📈",
      "📉",
      "📊",
      "📋",
      "📌",
      "📎",
      "🔒",
      "🔓",
      "🔑",
      "🔨",
      "🔧",
      "🔩",
      "⚙",
    ],
  },
  {
    label: "Symbols",
    emojis: [
      "❤",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "💔",
      "❣",
      "💕",
      "💞",
      "❤️‍🔥",
      "⛎",
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "🔀",
      "🔁",
      "▶",
      "⏩",
      "◀",
      "⏪",
      "⏸",
      "⏹",
      "⏺",
    ],
  },
  {
    label: "Fun & Misc",
    emojis: [
      "🔥",
      "⭐",
      "🌟",
      "💫",
      "✨",
      "🌙",
      "☀️",
      "🌊",
      "🌈",
      "🎉",
      "🎊",
      "🎁",
      "🎂",
      "🎵",
      "🎶",
      "🎤",
      "🎸",
      "🎮",
      "🏆",
      "💯",
      "💥",
      "❗",
      "❓",
      "‼",
      "⁉",
      "🆕",
      "🆓",
      "🆙",
      "🆒",
      "🆗",
      "🆘",
      "🛸",
      "🌍",
      "🌎",
      "🌏",
      "🧿",
      "💎",
      "💍",
      "👑",
      "🎭",
      "🎪",
      "🎨",
      "🎬",
      "📸",
      "🎯",
      "🎲",
      "♟",
      "🧩",
      "⚡",
    ],
  },
];

function getConvName(conv: MockConversation): string {
  if (conv.isGroup) return conv.groupName ?? "Group";
  return (
    conv.participants.find((p) => p.id !== LOGGED_IN_USER_ID)?.displayName ??
    conv.participants.find((p) => p.id !== LOGGED_IN_USER_ID)?.username ??
    conv.participants[0]?.username ??
    "Unknown"
  );
}

function getConvUsername(conv: MockConversation): string {
  if (conv.isGroup) return "";
  const other = conv.participants.find((p) => p.id !== LOGGED_IN_USER_ID);
  return other?.username ?? "";
}

function getConvAvatar(conv: MockConversation): string {
  if (conv.isGroup) return MOCK_USERS[2].avatarUrl;
  const other = conv.participants.find((p) => p.id !== LOGGED_IN_USER_ID);
  return other?.avatarUrl ?? MOCK_USERS[1].avatarUrl;
}

function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm w-14"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot w-1.5 h-1.5 rounded-full inline-block"
          style={{
            background: "rgba(255,255,255,0.5)",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function SharedPostBubble({ msg, isMe }: { msg: MockMessage; isMe: boolean }) {
  if (!msg.sharedPost) return null;
  const { imageUrl, authorUsername, caption } = msg.sharedPost;

  return (
    <div
      className={cn(
        "max-w-[70%] rounded-2xl overflow-hidden text-white/90",
        isMe ? "rounded-br-sm" : "rounded-bl-sm",
      )}
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center gap-3 p-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Shared post"
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          {authorUsername && (
            <p className="text-[10px] text-white/50 mb-0.5">
              @{authorUsername}
            </p>
          )}
          <p className="text-xs text-white/80 truncate leading-snug">
            {caption || "Shared a post"}
          </p>
          <p className="text-[10px] text-violet-400 mt-1 flex items-center gap-1">
            <ExternalLink size={10} />
            View Post
          </p>
        </div>
      </div>
    </div>
  );
}

function MediaBubble({ msg, isMe }: { msg: MockMessage; isMe: boolean }) {
  if (!msg.mediaUrl) return null;
  return (
    <div className={cn("max-w-[70%]", isMe ? "self-end" : "self-start")}>
      {msg.mediaType === "video" ? (
        // biome-ignore lint/a11y/useMediaCaption: user-generated voice/video in chat
        <video
          src={msg.mediaUrl}
          className="max-w-[240px] rounded-2xl object-cover"
          controls
          style={{ maxHeight: 320 }}
        />
      ) : (
        <img
          src={msg.mediaUrl}
          alt="Shared media"
          className="max-w-[240px] rounded-2xl object-cover cursor-pointer"
          style={{ maxHeight: 320 }}
        />
      )}
    </div>
  );
}

function VoiceBubble({ msg, isMe }: { msg: MockMessage; isMe: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!msg.audioUrl) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(msg.audioUrl);
        audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          toast.error("Could not play voice note");
        });
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const durationLabel = msg.duration
    ? `${Math.floor(msg.duration / 60)}:${String(msg.duration % 60).padStart(2, "0")}`
    : "0:00";

  const bars = Array.from({ length: 20 }, (_, i) => {
    const seed = (i * 7 + 3) % 10;
    return 20 + seed * 6;
  });

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-2xl max-w-[240px]",
        isMe ? "rounded-br-sm" : "rounded-bl-sm",
      )}
      style={
        isMe
          ? { background: "linear-gradient(135deg, #7c3aed, #db2777)" }
          : {
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.06)",
            }
      }
    >
      <button
        type="button"
        onClick={togglePlay}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
        style={{ background: "rgba(255,255,255,0.2)" }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <div className="flex items-center gap-0.5 flex-1">
        {bars.map((h, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: stable decorative waveform bars
            key={i}
            className="w-0.5 rounded-full transition-colors"
            style={{
              height: h,
              background: isPlaying ? "white" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
      <span className="text-[10px] opacity-70 flex-shrink-0">
        {durationLabel}
      </span>
    </div>
  );
}

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState(0);

  const filteredGroups = search.trim()
    ? [
        {
          label: "Search Results",
          emojis: EMOJI_GROUPS.flatMap((g) => g.emojis),
        },
      ]
    : EMOJI_GROUPS;

  const groupIcons = [
    "😀",
    "👋",
    "❤️",
    "🍕",
    "🐶",
    "🚗",
    "⚽",
    "📱",
    "🔷",
    "🔥",
  ];

  return (
    <div className="w-80 max-h-96 flex flex-col">
      <div className="p-2 border-b border-white/10">
        <input
          type="text"
          placeholder="Search emoji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      {!search.trim() && (
        <div
          className="flex gap-0 border-b border-white/10 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {EMOJI_GROUPS.map((g, i) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setActiveGroup(i)}
              className={cn(
                "flex-shrink-0 px-2 py-1.5 text-base hover:bg-white/10 transition-colors",
                activeGroup === i
                  ? "bg-white/10 border-b-2 border-violet-400"
                  : "",
              )}
              title={g.label}
            >
              {groupIcons[i] ?? "😀"}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-y-auto flex-1 p-2">
        {filteredGroups
          .filter((_, i) => search.trim() || i === activeGroup)
          .map((group) => (
            <div key={group.label}>
              <p
                className="text-[9px] text-white/30 uppercase tracking-wider mb-1.5 px-1 sticky top-0 py-0.5"
                style={{ background: "rgba(18,18,24,0.9)" }}
              >
                {group.label}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {group.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onSelect(emoji)}
                    className="text-lg p-1.5 rounded hover:bg-white/10 transition-colors hover:scale-110 active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function MessageReactionPicker({
  onSelect,
  onClose,
}: { onSelect: (emoji: string) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 8 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-1 rounded-full px-3 py-2 shadow-xl"
      style={{
        background: "rgba(30,30,40,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="text-xl hover:scale-130 transition-transform duration-150 active:scale-95 px-0.5"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
}

type MessageReactions = Record<string, { emoji: string; count: number }[]>;

// ─── Forward Modal ───────────────────────────────────────────────────────────
function ForwardModal({
  open,
  onClose,
  message,
  conversations,
  onForward,
}: {
  open: boolean;
  onClose: () => void;
  message: MockMessage | null;
  conversations: MockConversation[];
  onForward: (convId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = conversations.filter((c) => {
    const name = getConvName(c).toLowerCase();
    return !search || name.includes(search.toLowerCase());
  });

  const handleSend = () => {
    if (!selected) return;
    onForward(selected);
    setSelected(null);
    setSearch("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="border-white/10 p-0 overflow-hidden max-w-sm"
        style={{
          background: "rgba(14,14,20,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-white/08">
          <DialogTitle className="text-white text-base font-semibold flex items-center gap-2">
            <Share2 size={16} className="text-violet-400" />
            Forward message
          </DialogTitle>
        </DialogHeader>

        {/* Message preview */}
        {message?.text && (
          <div className="px-5 py-3 border-b border-white/06">
            <p
              className="text-xs rounded-xl px-3 py-2 text-white/70 italic line-clamp-2"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              "{message.text}"
            </p>
          </div>
        )}

        {/* Search */}
        <div className="px-5 py-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm text-white placeholder:text-white/30 outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div
          className="overflow-y-auto max-h-64 px-2 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {filtered.map((conv) => {
            const name = getConvName(conv);
            const avatar = getConvAvatar(conv);
            const isChecked = selected === conv.id;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelected(isChecked ? null : conv.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/05 transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {isChecked && (
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-full"
                      style={{ background: "rgba(124,58,237,0.85)" }}
                    >
                      <span className="text-white text-base">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm text-white font-medium truncate">
                    {name}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {conv.lastMessage.text ?? ""}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all",
                    isChecked
                      ? "border-violet-500 bg-violet-500"
                      : "border-white/20 bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Send button */}
        <div className="px-5 py-4 border-t border-white/08">
          <button
            type="button"
            onClick={handleSend}
            disabled={!selected}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
              selected
                ? "text-white hover:opacity-90"
                : "text-white/30 cursor-not-allowed",
            )}
            style={{
              background: selected
                ? "linear-gradient(135deg, #7c3aed, #db2777)"
                : "rgba(255,255,255,0.05)",
            }}
          >
            {selected ? "Send" : "Select a chat"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Report Modal ────────────────────────────────────────────────────────────
const REPORT_REASONS = [
  "Spam",
  "Harassment",
  "Inappropriate content",
  "Hate speech",
  "Misinformation",
  "Other",
] as const;

function ReportModal({
  open,
  onClose,
  onReport,
}: {
  open: boolean;
  onClose: () => void;
  onReport: (reason: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selected) return;
    onReport(selected);
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="border-white/10 p-0 overflow-hidden max-w-sm"
        style={{
          background: "rgba(14,14,20,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-white/08">
          <DialogTitle className="text-white text-base font-semibold flex items-center gap-2">
            <Flag size={16} className="text-red-400" />
            Report message
          </DialogTitle>
          <p className="text-xs text-white/40 mt-1">
            Why are you reporting this message?
          </p>
        </DialogHeader>

        <div className="px-5 py-3 space-y-1.5">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => setSelected(reason)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all",
                selected === reason
                  ? "text-white"
                  : "text-white/70 hover:text-white hover:bg-white/05",
              )}
              style={
                selected === reason
                  ? {
                      background: "rgba(124,58,237,0.2)",
                      border: "1px solid rgba(124,58,237,0.4)",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                    }
              }
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center",
                  selected === reason ? "border-violet-400" : "border-white/25",
                )}
              >
                {selected === reason && (
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
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
              selected
                ? "text-white hover:opacity-90"
                : "text-white/30 cursor-not-allowed",
            )}
            style={{
              background: selected
                ? "rgba(239,68,68,0.8)"
                : "rgba(255,255,255,0.05)",
            }}
          >
            Report
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────
function DeleteConfirmModal({
  open,
  onClose,
  isMyMessage,
  onDeleteForMe,
  onDeleteForEveryone,
}: {
  open: boolean;
  onClose: () => void;
  isMyMessage: boolean;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="border-white/10 p-0 overflow-hidden max-w-xs"
        style={{
          background: "rgba(14,14,20,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-white text-base font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            Delete message
          </DialogTitle>
          <p className="text-xs text-white/40 mt-1">
            {isMyMessage
              ? "Choose who to delete this message for."
              : "This will remove the message from your view only."}
          </p>
        </DialogHeader>

        <div className="px-5 py-3 space-y-2">
          {isMyMessage && (
            <button
              type="button"
              onClick={() => {
                onDeleteForEveryone();
                onClose();
              }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.6))",
              }}
            >
              <Trash2 size={14} />
              Delete for everyone
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onDeleteForMe();
              onClose();
            }}
            className="w-full py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white transition-colors"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Delete for me
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState<MockConversation | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const { messages, sendMessage } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [messageReactions, setMessageReactions] = useState<MessageReactions>(
    {},
  );
  const [reactionPickerMsgId, setReactionPickerMsgId] = useState<string | null>(
    null,
  );
  const [msgMenuOpenId, setMsgMenuOpenId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<
    Record<string, MockMessage[]>
  >({});
  // Forward modal state
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [forwardMessage, setForwardMessage] = useState<MockMessage | null>(
    null,
  );
  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  // Delete confirm modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    isMe: boolean;
  } | null>(null);
  // Messages deleted "for everyone" — shown as a deleted placeholder
  const [deletedForEveryone, setDeletedForEveryone] = useState<Set<string>>(
    new Set(),
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const mediaFileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filteredConvs = [...MOCK_CONVERSATIONS]
    .filter((c) => {
      const name = getConvName(c).toLowerCase();
      const uname = getConvUsername(c).toLowerCase();
      return (
        !searchQuery ||
        name.includes(searchQuery.toLowerCase()) ||
        uname.includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (
        b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
      );
    });

  // Merge app-level messages with local deletions
  const currentMessages = selectedConv
    ? (messages[selectedConv.id] ?? []).filter(
        (m) =>
          !(localMessages[selectedConv.id] ?? []).some((d) => d.id === m.id),
      )
    : [];

  // Scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message change is intentional
  useEffect(() => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop =
        messagesScrollRef.current.scrollHeight;
    }
  }, [currentMessages.length]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      mediaRecorderRef.current?.stop();
    };
  }, []);

  // Close reaction picker when clicking outside
  useEffect(() => {
    if (!reactionPickerMsgId) return;
    const handler = () => setReactionPickerMsgId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [reactionPickerMsgId]);

  const handleAddReaction = (msgId: string, emoji: string) => {
    setMessageReactions((prev) => {
      const existing = prev[msgId] ?? [];
      const idx = existing.findIndex((r) => r.emoji === emoji);
      if (idx >= 0) {
        const updated = [...existing];
        updated[idx] = { ...updated[idx], count: updated[idx].count + 1 };
        return { ...prev, [msgId]: updated };
      }
      return { ...prev, [msgId]: [...existing, { emoji, count: 1 }] };
    });
  };

  const handleDeleteForMe = (msgId: string) => {
    if (!selectedConv) return;
    setLocalMessages((prev) => {
      const convId = selectedConv.id;
      const existing = prev[convId] ?? [];
      const msgToDelete = currentMessages.find((m) => m.id === msgId);
      if (!msgToDelete) return prev;
      return { ...prev, [convId]: [...existing, msgToDelete] };
    });
    toast.success("Message deleted");
  };

  const handleDeleteForEveryone = (msgId: string) => {
    setDeletedForEveryone((prev) => new Set([...prev, msgId]));
    toast.success("Message deleted for everyone");
  };

  const handleForwardMessage = (convId: string) => {
    if (!forwardMessage) return;
    const forwardedMsg: MockMessage = {
      id: `msg_fwd_${Date.now()}`,
      senderId: ME_ID,
      text: forwardMessage.text,
      timestamp: new Date(),
      isRead: false,
      type: "text",
    };
    sendMessage(convId, forwardedMsg);
    toast.success("Message forwarded");
  };

  const handleReport = (reason: string) => {
    toast.success(`Message reported: ${reason}`, {
      description: "Thanks for keeping the community safe.",
      duration: 3000,
    });
  };

  const handleSend = (text?: string) => {
    const msg = text ?? messageText;
    if (!msg.trim() || !selectedConv) return;
    const newMsg: MockMessage = {
      id: `msg_${Date.now()}`,
      senderId: ME_ID,
      text: msg.trim(),
      timestamp: new Date(),
      isRead: false,
      type: "text",
    };
    sendMessage(selectedConv.id, newMsg);
    setMessageText("");
    simulateReply(selectedConv);
  };

  const simulateReply = (conv: MockConversation) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const isChocoChat = conv.id === "conv_choco";
      const isAreyChat = conv.id === "conv_arey";
      const chocoReplies = [
        "okay but why",
        "no you're projecting",
        "I was literally just thinking about this",
        "existing is exhausting but go on",
        "that's very you of you",
        "okay and? 😐",
        "I felt that",
        "bro same honestly",
        "you need sleep",
        "this is sending me",
        "I'm not surprised but continue",
        "lowkey valid though",
      ];
      const areyReplies = [
        "abe sun mujhe 🫶🏻",
        "tu theek hai na?",
        "main hun na yahan",
        "khaana khaaya?",
        "bhai seriously...",
        "always rooting for you 💕",
        "teri fav hun remember 🤤",
      ];
      const genericReplies = [
        "That's interesting! 🔥",
        "Love that perspective ✨",
        "Totally agree! 🙌",
        "Let's catch up soon 💫",
        "Amazing work as always 🎨",
      ];
      const responses = isChocoChat
        ? chocoReplies
        : isAreyChat
          ? areyReplies
          : genericReplies;
      const reply: MockMessage = {
        id: `msg_reply_${Date.now()}`,
        senderId: conv.participants[0]?.id ?? "other",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isRead: false,
        type: "text",
      };
      sendMessage(conv.id, reply);
    }, 1800);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConv) return;
    const objectUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/");
    const newMsg: MockMessage = {
      id: `msg_media_${Date.now()}`,
      senderId: ME_ID,
      timestamp: new Date(),
      isRead: false,
      type: "media",
      mediaUrl: objectUrl,
      mediaType: isVideo ? "video" : "image",
    };
    sendMessage(selectedConv.id, newMsg);
    if (mediaFileRef.current) mediaFileRef.current.value = "";
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(blob);
          const duration = recordingSeconds;
          for (const t of stream.getTracks()) t.stop();

          if (selectedConv) {
            const voiceMsg: MockMessage = {
              id: `msg_voice_${Date.now()}`,
              senderId: ME_ID,
              timestamp: new Date(),
              isRead: false,
              type: "voice",
              audioUrl,
              duration,
            };
            sendMessage(selectedConv.id, voiceMsg);
          }
          setRecordingSeconds(0);
        };

        recorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((s) => s + 1);
        }, 1000);
      } catch {
        toast.error("Microphone access denied");
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
    setEmojiOpen(false);
  };

  // ─── Chat View ──────────────────────────────────────────────────────────────

  const ChatViewContent = selectedConv ? (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-5 flex-shrink-0"
        style={{
          paddingTop: 14,
          paddingBottom: 14,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#0a0a0a",
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedConv(null)}
          className="lg:hidden text-white/60 hover:text-white transition-colors mr-1"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={getConvAvatar(selectedConv)}
            alt={getConvName(selectedConv)}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {!selectedConv.isGroup && getConvUsername(selectedConv) ? (
            <Link
              to="/profile/$username"
              params={{ username: getConvUsername(selectedConv) }}
              className="font-bold text-white text-sm truncate leading-tight block hover:text-violet-400 transition-colors"
            >
              {getConvName(selectedConv)}
            </Link>
          ) : (
            <p className="font-bold text-white text-sm truncate leading-tight">
              {getConvName(selectedConv)}
            </p>
          )}
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Active now
          </p>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Voice call"
          >
            <Phone size={18} />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Video call"
          >
            <Video size={18} />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Chat info"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Messages scroll area */}
      <div
        ref={messagesScrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          padding: "16px 20px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        <div className="space-y-2">
          {currentMessages.map((msg, i) => {
            const isMe = msg.senderId === ME_ID;
            const showAvatar =
              !isMe &&
              (i === 0 || currentMessages[i - 1]?.senderId !== msg.senderId);
            const msgReactions = messageReactions[msg.id] ?? [];
            const isMenuOpen = msgMenuOpenId === msg.id;
            const isDeletedForEveryone = deletedForEveryone.has(msg.id);

            // ─ Shared dropdown menu items (same for isMe and !isMe, with delete variant) ─
            const MessageMenu = (
              <DropdownMenu
                open={isMenuOpen}
                onOpenChange={(open) => setMsgMenuOpenId(open ? msg.id : null)}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Message options"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isMe ? "end" : "start"}
                  side="top"
                  className="border-white/10 text-white min-w-[160px] z-50"
                  style={{
                    background: "rgba(20,20,28,0.97)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {/* React */}
                  <DropdownMenuItem
                    className="hover:bg-white/10 cursor-pointer text-white/80 gap-2 text-sm"
                    onClick={() => {
                      setReactionPickerMsgId(msg.id);
                      setMsgMenuOpenId(null);
                    }}
                  >
                    <span className="text-base leading-none">😊</span>
                    <span>React</span>
                  </DropdownMenuItem>

                  {/* Forward */}
                  <DropdownMenuItem
                    className="hover:bg-white/10 cursor-pointer text-white/80 gap-2 text-sm"
                    onClick={() => {
                      setForwardMessage(msg);
                      setForwardModalOpen(true);
                      setMsgMenuOpenId(null);
                    }}
                  >
                    <Forward size={14} className="text-white/60" />
                    <span>Forward</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/08" />

                  {/* Delete */}
                  <DropdownMenuItem
                    className="hover:bg-red-500/15 cursor-pointer text-red-400 gap-2 text-sm"
                    onClick={() => {
                      setDeleteTarget({ id: msg.id, isMe });
                      setDeleteModalOpen(true);
                      setMsgMenuOpenId(null);
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </DropdownMenuItem>

                  {/* Report — only for others' messages */}
                  {!isMe && (
                    <DropdownMenuItem
                      className="hover:bg-white/08 cursor-pointer text-white/50 gap-2 text-sm"
                      onClick={() => {
                        setReportModalOpen(true);
                        setMsgMenuOpenId(null);
                      }}
                    >
                      <Flag size={14} className="text-white/40" />
                      <span>Report</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );

            return (
              <div key={msg.id}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-end gap-2 relative group",
                    isMe ? "justify-end" : "justify-start",
                  )}
                >
                  {!isMe && (
                    <div className="w-7 h-7 flex-shrink-0">
                      {showAvatar && (
                        <img
                          src={getConvAvatar(selectedConv)}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Three-dot menu — left of bubble for "me", right for others */}
                  {isMe && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {MessageMenu}
                    </div>
                  )}

                  <div
                    className="relative"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setReactionPickerMsgId(
                        reactionPickerMsgId === msg.id ? null : msg.id,
                      );
                    }}
                  >
                    {/* Deleted-for-everyone placeholder */}
                    {isDeletedForEveryone ? (
                      <div
                        className="px-4 py-2.5 rounded-2xl text-sm italic"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        🚫 This message was deleted
                      </div>
                    ) : msg.type === "shared_post" ? (
                      <SharedPostBubble msg={msg} isMe={isMe} />
                    ) : msg.type === "media" ? (
                      <MediaBubble msg={msg} isMe={isMe} />
                    ) : msg.type === "voice" ? (
                      <VoiceBubble msg={msg} isMe={isMe} />
                    ) : (
                      <div
                        className={cn(
                          "max-w-[340px] px-4 py-2.5 rounded-2xl text-sm select-text",
                          isMe ? "rounded-br-sm" : "rounded-bl-sm",
                        )}
                        style={
                          isMe
                            ? {
                                background:
                                  "linear-gradient(135deg, #7c3aed, #db2777)",
                                color: "white",
                              }
                            : {
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.9)",
                              }
                        }
                      >
                        {msg.text}
                        <p className="text-[10px] mt-0.5 opacity-50">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}

                    {/* Reaction picker */}
                    <AnimatePresence>
                      {reactionPickerMsgId === msg.id && (
                        // biome-ignore lint/a11y/useKeyWithClickEvents: reaction picker stops propagation, keyboard handled by inner buttons
                        <div
                          className={cn(
                            "absolute z-50",
                            isMe
                              ? "right-0 bottom-full mb-2"
                              : "left-0 bottom-full mb-2",
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageReactionPicker
                            onSelect={(emoji) =>
                              handleAddReaction(msg.id, emoji)
                            }
                            onClose={() => setReactionPickerMsgId(null)}
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Three-dot menu — right of bubble for received messages */}
                  {!isMe && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {MessageMenu}
                    </div>
                  )}
                </motion.div>

                {/* Reactions display */}
                {msgReactions.length > 0 && (
                  <div
                    className={cn(
                      "flex flex-wrap gap-1 mt-1 px-9",
                      isMe ? "justify-end" : "justify-start",
                    )}
                  >
                    {msgReactions.map((r) => (
                      <motion.button
                        key={r.emoji}
                        type="button"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => handleAddReaction(msg.id, r.emoji)}
                        className="text-xs rounded-full px-1.5 py-0.5 hover:bg-white/10 transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {r.emoji} {r.count > 1 ? r.count : ""}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              <img
                src={getConvAvatar(selectedConv)}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#0a0a0a",
        }}
      >
        {isRecording && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400">
              Recording... {Math.floor(recordingSeconds / 60)}:
              {String(recordingSeconds % 60).padStart(2, "0")}
            </span>
            <span
              className="text-xs ml-auto"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Tap mic to stop
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*,video/*"
            ref={mediaFileRef}
            className="hidden"
            onChange={handleMediaSelect}
          />
          <button
            type="button"
            onClick={() => mediaFileRef.current?.click()}
            className="text-white/50 hover:text-white transition-colors flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/8"
            aria-label="Attach image or video"
          >
            <Image size={20} />
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              className="w-full rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 16,
              }}
            />
          </div>

          {/* Emoji picker */}
          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "text-white/50 hover:text-white transition-colors flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/8",
                  emojiOpen && "text-violet-400",
                )}
                aria-label="Add emoji"
              >
                <Smile size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              className="p-0 border rounded-2xl shadow-2xl"
              style={{
                background: "#121218",
                border: "1px solid rgba(255,255,255,0.1)",
                width: "auto",
              }}
            >
              <EmojiPicker onSelect={handleEmojiSelect} />
            </PopoverContent>
          </Popover>

          {messageText ? (
            <button
              type="button"
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
              }}
              aria-label="Send message"
            >
              <Send size={16} className="text-white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                isRecording
                  ? "text-red-400 bg-red-400/10"
                  : "text-white/50 hover:text-white hover:bg-white/8",
              )}
              aria-label={isRecording ? "Stop recording" : "Voice message"}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;

  // ─── Empty state ────────────────────────────────────────────────────────────

  const EmptyState = (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        height: "100%",
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ border: "2px solid rgba(255,255,255,0.15)" }}
      >
        <MessageCircle size={28} style={{ color: "rgba(255,255,255,0.3)" }} />
      </div>
      <p className="text-white font-semibold text-lg mb-1">Your messages</p>
      <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
        Send a message to start a chat.
      </p>
      <button
        type="button"
        className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        Send message
      </button>
    </div>
  );

  // ─── Page layout ────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 lg:left-[260px] flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "flex-col flex-shrink-0 h-full overflow-hidden border-r border-white/[0.06]",
          selectedConv
            ? "hidden lg:flex lg:w-[360px]"
            : "flex w-full lg:w-[360px]",
        )}
        style={{ background: "#0a0a0a" }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="flex items-center gap-1.5 font-bold text-white text-base hover:opacity-70 transition-opacity"
            >
              <span>Messages</span>
              <ChevronDown size={16} className="text-white/60" />
            </button>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/8 transition-colors"
              aria-label="New message"
            >
              <Edit size={20} />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm text-white placeholder:text-white/30 outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "none",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* Notes strip */}
        <div
          className="flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <NotesPanel compact />
        </div>

        {/* Messages heading + Requests link */}
        <div className="flex items-center justify-between px-5 py-2.5 flex-shrink-0">
          <span className="text-sm font-semibold text-white">Messages</span>
          <button
            type="button"
            className="text-xs hover:text-white/70 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Requests
          </button>
        </div>

        {/* Conversation list — CRITICAL: plain div with overflow-y: auto */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
          }}
        >
          {filteredConvs.map((conv) => {
            const name = getConvName(conv);
            const avatar = getConvAvatar(conv);
            const isSelected = selectedConv?.id === conv.id;
            const lastMsgText =
              conv.lastMessage.senderId === ME_ID
                ? `You: ${conv.lastMessage.text ?? (conv.lastMessage.type === "media" ? "📷 Photo" : conv.lastMessage.type === "voice" ? "🎤 Voice note" : "")}`
                : (conv.lastMessage.text ??
                  (conv.lastMessage.type === "media"
                    ? "📷 Photo"
                    : conv.lastMessage.type === "voice"
                      ? "🎤 Voice note"
                      : ""));

            return (
              <motion.button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                whileTap={{ scale: 0.985 }}
                className="w-full flex items-center gap-3 px-4 text-left transition-colors"
                style={{
                  minHeight: 72,
                  paddingTop: 10,
                  paddingBottom: 10,
                  background: isSelected
                    ? "rgba(255,255,255,0.07)"
                    : "transparent",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-[50px] h-[50px] rounded-full overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    }}
                  >
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  {conv.isPinned && (
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#0a0a0a" }}
                    >
                      <Pin size={9} className="text-white/40" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span
                      className="text-sm truncate"
                      style={{
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {name}
                    </span>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{
                        color:
                          conv.unreadCount > 0
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {formatRelativeTime(conv.lastMessage.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-xs truncate flex-1 min-w-0"
                      style={{
                        color:
                          conv.unreadCount > 0
                            ? "rgba(255,255,255,0.65)"
                            : "rgba(255,255,255,0.35)",
                        fontWeight: conv.unreadCount > 0 ? 500 : 400,
                      }}
                    >
                      {lastMsgText}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: "#3b82f6" }}
                      />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div
        className={cn(
          "flex-1 min-w-0 h-full overflow-hidden flex-col",
          selectedConv ? "flex" : "hidden lg:flex",
        )}
      >
        {selectedConv ? ChatViewContent : EmptyState}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────── */}

      {/* Forward modal */}
      <ForwardModal
        open={forwardModalOpen}
        onClose={() => {
          setForwardModalOpen(false);
          setForwardMessage(null);
        }}
        message={forwardMessage}
        conversations={MOCK_CONVERSATIONS}
        onForward={handleForwardMessage}
      />

      {/* Report modal */}
      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReport={handleReport}
      />

      {/* Delete confirm modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        isMyMessage={deleteTarget?.isMe ?? false}
        onDeleteForMe={() => {
          if (deleteTarget) handleDeleteForMe(deleteTarget.id);
        }}
        onDeleteForEveryone={() => {
          if (deleteTarget) handleDeleteForEveryone(deleteTarget.id);
        }}
      />
    </div>
  );
}
