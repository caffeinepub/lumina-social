import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import { MusicSearchPicker } from "@/components/music/MusicSearchPicker";
import { MOCK_NOTES, formatRelativeTime } from "@/data/mockData";
import type { MockNote, MockUser, MusicTrack } from "@/types";
import {
  Music,
  Pause,
  Pencil,
  Play,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Own Note Popup (Instagram-style) ──────────────────────────────────────
interface OwnNotePopupProps {
  note: MockNote;
  me: MockUser;
  onClose: () => void;
  onNewNote: () => void;
  onDeleteNote: () => void;
}

function OwnNotePopup({
  note,
  me,
  onClose,
  onNewNote,
  onDeleteNote,
}: OwnNotePopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect for auto-play
  useEffect(() => {
    if (note.musicTrack?.previewUrl) {
      const audio = new Audio(note.musicTrack.previewUrl);
      audioRef.current = audio;
      audio.addEventListener("ended", () => setIsPlaying(false));
      const startAt = note.musicTrack.startSeconds ?? 0;
      audio.currentTime = startAt;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser blocked autoplay
        });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!note.musicTrack?.previewUrl) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(note.musicTrack.previewUrl);
        audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      }
      audioRef.current.currentTime = note.musicTrack.startSeconds ?? 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          toast.error("Preview unavailable");
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-[300px] relative rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(219,39,119,0.10) 50%, rgba(14,14,22,0.95) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow:
            "0 0 60px rgba(124,58,237,0.2), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
          filter: "drop-shadow(0 0 30px rgba(124,58,237,0.3))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner glow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 60%)",
            pointerEvents: "none",
            borderRadius: "inherit",
          }}
        />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <div className="px-5 pt-5 pb-5 flex flex-col items-center gap-0">
          {/* Music section */}
          {note.musicTrack && (
            <button
              type="button"
              onClick={handlePlayPause}
              className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 mb-4 group transition-all"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(219,39,119,0.10))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
              aria-label={isPlaying ? "Pause" : "Play music"}
            >
              {/* Artwork or music icon */}
              <div className="relative flex-shrink-0">
                {note.musicTrack.artworkUrl ? (
                  <img
                    src={note.musicTrack.artworkUrl}
                    alt={note.musicTrack.title}
                    className={`w-10 h-10 rounded-xl object-cover ${isPlaying ? "animate-spin" : ""}`}
                    style={{ animationDuration: "4s" }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                    <Music size={16} className="text-white" />
                  </div>
                )}
                {/* Spinning disc overlay when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/30">
                    <div className="flex items-end gap-[2px]">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-[2px] rounded-full bg-white"
                          style={{
                            height: `${6 + i * 2}px`,
                            animation: `pulse 0.5s ease-in-out ${i * 0.12}s infinite alternate`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-white truncate leading-tight">
                  {note.musicTrack.title}
                </p>
                <p className="text-xs text-white/50 truncate mt-0.5">
                  {note.musicTrack.artist}
                </p>
              </div>

              {/* Play/pause indicator */}
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-colors">
                {isPlaying ? (
                  <Pause size={12} className="text-white" />
                ) : (
                  <Play size={12} className="text-white ml-0.5" />
                )}
              </div>
            </button>
          )}

          {/* Large profile picture */}
          <div
            className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 mb-3"
            style={{
              boxShadow:
                "0 0 0 2px rgba(139,92,246,0.5), 0 0 20px rgba(124,58,237,0.3)",
            }}
          >
            {me.avatarUrl ? (
              <img
                src={me.avatarUrl}
                alt={me.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {(me.displayName || me.username || "?")[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Username */}
          <p className="text-base font-bold text-white mb-1 text-center">
            {me.displayName || me.username}
          </p>

          {/* Subtitle */}
          <p className="text-xs text-white/45 text-center mb-5 leading-relaxed">
            Shared with followers you follow back
          </p>

          {/* "Leave a new note" button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onNewNote();
            }}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] mb-2"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            }}
          >
            Leave a new note
          </button>

          {/* "Delete note" link */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onDeleteNote();
            }}
            className="text-sm font-medium transition-colors py-1"
            style={{ color: "#7c88f5" }}
          >
            Delete note
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getExpiryLabel(note: MockNote): string {
  const msLeft = note.expiresAt.getTime() - Date.now();
  if (msLeft <= 0) return "expired";
  const hoursLeft = Math.floor(msLeft / 3600000);
  const minsLeft = Math.floor((msLeft % 3600000) / 60000);
  if (hoursLeft > 0) return `${hoursLeft}h left`;
  if (minsLeft > 0) return `${minsLeft}m left`;
  return "< 1m left";
}

interface NoteDetailProps {
  note: MockNote;
  onClose: () => void;
  me: MockUser;
}

function NoteDetail({ note, onClose }: NoteDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect for auto-play
  useEffect(() => {
    if (note.musicTrack?.previewUrl) {
      const audio = new Audio(note.musicTrack.previewUrl);
      audioRef.current = audio;
      audio.addEventListener("ended", () => setIsPlaying(false));
      const startAt = note.musicTrack.startSeconds ?? 0;
      audio.currentTime = startAt;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser blocked autoplay — that's okay
        });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!note.musicTrack?.previewUrl) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(note.musicTrack.previewUrl);
        audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      }
      audioRef.current.currentTime = note.musicTrack.startSeconds ?? 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          toast.error("Preview unavailable");
        });
    }
  };

  const expiryLabel = getExpiryLabel(note);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-xs relative overflow-hidden rounded-3xl"
        style={{
          background:
            "linear-gradient(160deg, #1a0a2e 0%, #0f0f1a 60%, #0a0a12 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close note"
        >
          <X size={16} />
        </button>

        {/* Avatar + note bubble */}
        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          {/* Note speech bubble */}
          <div
            className="mb-3 w-full max-w-[220px] rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-white text-center leading-relaxed relative"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span>{note.text}</span>
            {/* Bubble tail */}
            <div
              className="absolute -bottom-2 left-5 w-0 h-0"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "0px solid transparent",
                borderTop: "8px solid rgba(255,255,255,0.07)",
              }}
            />
          </div>

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20 mt-1 flex-shrink-0">
            {note.author.avatarUrl ? (
              <img
                src={note.author.avatarUrl}
                alt={note.author.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {(note.author.displayName ||
                    note.author.username ||
                    "?")[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm font-semibold text-white mt-2">
            {note.author.username}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {formatRelativeTime(note.timestamp)} · {expiryLabel}
          </p>

          {/* Music track mini player */}
          {note.musicTrack && (
            <div
              className="flex items-center gap-3 mt-4 w-full rounded-xl px-3 py-2.5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {note.musicTrack.artworkUrl ? (
                <img
                  src={note.musicTrack.artworkUrl}
                  alt={note.musicTrack.title}
                  className={`w-9 h-9 rounded-lg object-cover flex-shrink-0 ${isPlaying ? "animate-spin" : ""}`}
                  style={{ animationDuration: "3s" }}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex-shrink-0 flex items-center justify-center">
                  <Music size={12} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {note.musicTrack.title}
                </p>
                <p className="text-[10px] text-white/50 truncate">
                  {note.musicTrack.artist}
                </p>
              </div>
              {isPlaying && (
                <div className="flex items-end gap-0.5 mr-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full bg-violet-400"
                      style={{
                        height: `${8 + i * 3}px`,
                        animation: `pulse 0.6s ease-in-out ${i * 0.15}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}
              {note.musicTrack.previewUrl && (
                <button
                  type="button"
                  onClick={handlePlayPause}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  aria-label={isPlaying ? "Pause preview" : "Play preview"}
                >
                  {isPlaying ? (
                    <Pause size={14} className="text-violet-400" />
                  ) : (
                    <Play size={14} className="text-white" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface CreateNoteProps {
  existingNote?: MockNote;
  onClose: () => void;
  onShare: (note: MockNote) => void;
  me: MockUser;
}

function CreateNoteModal({
  existingNote,
  onClose,
  onShare,
  me,
}: CreateNoteProps) {
  const [text, setText] = useState(existingNote?.text ?? "");
  const [music, setMusic] = useState<MusicTrack | undefined>(
    existingNote?.musicTrack,
  );
  const MAX_CHARS = 60;

  const handleShare = () => {
    if (!text.trim()) return;
    const note: MockNote = {
      id: `note_${Date.now()}`,
      author: me,
      text: text.trim().slice(0, MAX_CHARS),
      musicTrack: music,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 24 * 3600000),
      replies: [],
    };
    onShare(note);
    onClose();
    toast.success("Note shared!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-sm relative overflow-hidden rounded-3xl"
        style={{
          background:
            "linear-gradient(160deg, #1a0a2e 0%, #0f0f1a 60%, #0a0a12 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-6 pb-6">
          <h2 className="text-base font-semibold text-white mb-5 text-center">
            {existingNote ? "Edit Note" : "New Note"}
          </h2>

          {/* Avatar + preview bubble */}
          <div className="flex flex-col items-center gap-3 mb-5">
            {text && (
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-white/90 text-center max-w-[200px]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {text}
              </div>
            )}
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-violet-500/40 flex-shrink-0">
              {me.avatarUrl ? (
                <img
                  src={me.avatarUrl}
                  alt={me.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {(me.displayName || me.username || "?")[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Text input */}
          <div className="mb-2">
            <textarea
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 transition-all duration-200 resize-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              placeholder="Share what's on your mind..."
              value={text}
              maxLength={MAX_CHARS}
              rows={3}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            />
            <p className="text-right text-xs text-white/30 mt-1">
              {text.length}/{MAX_CHARS}
            </p>
          </div>

          {/* Music picker */}
          <div className="mb-5">
            <MusicSearchPicker value={music} onChange={setMusic} />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-colors"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={!text.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
              }}
            >
              Share Note
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface NotesPanelProps {
  compact?: boolean;
}

export function NotesPanel({ compact = false }: NotesPanelProps) {
  const { currentUser } = useAuthContext();
  const ME: MockUser = {
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
  };

  const [notes, setNotes] = useState<MockNote[]>(MOCK_NOTES);
  const [selectedNote, setSelectedNote] = useState<MockNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [myNotePopupOpen, setMyNotePopupOpen] = useState(false);

  const myNote = notes.find((n) => n.author.id === ME.id);
  const otherNotes = notes.filter((n) => n.author.id !== ME.id);

  const handleShare = (note: MockNote) => {
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.author.id !== ME.id);
      return [note, ...filtered];
    });
  };

  const handleRemoveMyNote = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.author.id !== ME.id));
    toast.success("Note removed");
  };

  const AVATAR_SIZE = compact ? "w-11 h-11" : "w-[52px] h-[52px]";

  return (
    <>
      {/* Notes strip — horizontal scroll */}
      <div
        className="flex overflow-x-auto px-4 py-2 notes-scroll-strip"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: compact ? 118 : 128,
          alignItems: "flex-end",
          gap: 20,
        }}
      >
        {/* My note bubble */}
        <div
          className="flex flex-col items-center flex-shrink-0"
          style={{ minWidth: 70 }}
        >
          {/* Speech bubble above avatar — click to open own-note popup */}
          <div className="relative mb-1" style={{ minHeight: 52 }}>
            {myNote ? (
              <button
                type="button"
                onClick={() => setMyNotePopupOpen(true)}
                className="relative rounded-2xl rounded-bl-sm px-2.5 py-2 text-center w-full"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  maxWidth: 80,
                  minWidth: 64,
                }}
                aria-label="View your note"
              >
                <p
                  className="text-white/90 leading-tight text-center"
                  style={{
                    fontSize: 10,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {myNote.text}
                </p>
                {/* Bubble tail */}
                <div
                  className="absolute -bottom-2 left-4"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "7px solid transparent",
                    borderRight: "0",
                    borderTop: "7px solid rgba(255,255,255,0.07)",
                  }}
                />
                {/* Music indicator */}
                {myNote.musicTrack && (
                  <div
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    }}
                  >
                    <Music size={7} className="text-white" />
                  </div>
                )}
              </button>
            ) : (
              <div style={{ height: 40 }} />
            )}
          </div>

          {/* Avatar — opens popup if note exists, else opens create */}
          <button
            type="button"
            onClick={() => {
              if (myNote) {
                setMyNotePopupOpen(true);
              } else {
                setIsCreating(true);
              }
            }}
            className={`${AVATAR_SIZE} rounded-full overflow-hidden flex-shrink-0 relative`}
            style={{
              border: "2px solid rgba(139,92,246,0.5)",
            }}
            aria-label={myNote ? "View your note" : "Add a note"}
          >
            {ME.avatarUrl ? (
              <img
                src={ME.avatarUrl}
                alt={ME.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {(ME.displayName || ME.username || "?")[0]?.toUpperCase()}
                </span>
              </div>
            )}
            {!myNote && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <Plus size={14} className="text-white" />
              </div>
            )}
          </button>

          {/* Label below avatar */}
          {!myNote && (
            <span
              className="text-white/40 mt-1.5 text-center truncate"
              style={{ fontSize: 10, maxWidth: 60 }}
            >
              Add note
            </span>
          )}
          {myNote && (
            <span
              className="text-white/40 mt-1.5 text-center truncate"
              style={{ fontSize: 10, maxWidth: 64 }}
            >
              Your note
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          className="flex-shrink-0 self-center"
          style={{
            width: 1,
            height: 48,
            background: "rgba(255,255,255,0.06)",
            marginTop: -8,
          }}
        />

        {/* Other users' notes */}
        {otherNotes.map((note) => (
          <div
            key={note.id}
            className="flex flex-col items-center flex-shrink-0"
            style={{ minWidth: 70 }}
          >
            {/* Speech bubble */}
            <div className="relative mb-1" style={{ minHeight: 52 }}>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: avatar button handles keyboard */}
              <div
                className="relative rounded-2xl rounded-bl-sm px-2.5 py-2 text-center cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  maxWidth: 80,
                  minWidth: 64,
                }}
                onClick={() => setSelectedNote(note)}
              >
                <p
                  className="text-white/90 leading-tight"
                  style={{
                    fontSize: 10,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {note.text}
                </p>
                {/* Bubble tail */}
                <div
                  className="absolute -bottom-2 left-4"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "7px solid transparent",
                    borderRight: "0",
                    borderTop: "7px solid rgba(255,255,255,0.07)",
                  }}
                />
                {/* Music note indicator */}
                {note.musicTrack && (
                  <div
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    }}
                  >
                    <Music size={7} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Avatar */}
            <button
              type="button"
              onClick={() => setSelectedNote(note)}
              className={`${AVATAR_SIZE} rounded-full overflow-hidden flex-shrink-0`}
              style={{ border: "2px solid rgba(255,255,255,0.15)" }}
              aria-label={`View ${note.author.username}'s note`}
            >
              {note.author.avatarUrl ? (
                <img
                  src={note.author.avatarUrl}
                  alt={note.author.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      e.currentTarget.style.display = "none";
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {(note.author.displayName ||
                      note.author.username ||
                      "?")[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </button>

            {/* Username */}
            <span
              className="text-white/40 mt-1.5 text-center truncate"
              style={{ fontSize: 10, maxWidth: 64 }}
            >
              {note.author.username}
            </span>
          </div>
        ))}
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {myNote && myNotePopupOpen && (
          <OwnNotePopup
            key="own-note-popup"
            note={myNote}
            me={ME}
            onClose={() => setMyNotePopupOpen(false)}
            onNewNote={() => {
              setMyNotePopupOpen(false);
              setIsCreating(true);
            }}
            onDeleteNote={() => {
              setMyNotePopupOpen(false);
              handleRemoveMyNote();
            }}
          />
        )}
        {selectedNote && (
          <NoteDetail
            key="note-detail"
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            me={ME}
          />
        )}
        {isCreating && (
          <CreateNoteModal
            key="create-note"
            existingNote={myNote}
            onClose={() => setIsCreating(false)}
            onShare={handleShare}
            me={ME}
          />
        )}
      </AnimatePresence>
    </>
  );
}
