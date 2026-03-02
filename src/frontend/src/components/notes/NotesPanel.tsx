import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { MusicSearchPicker } from "@/components/music/MusicSearchPicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_NOTES, MOCK_USERS, formatRelativeTime } from "@/data/mockData";
import type { MockNote, MusicTrack } from "@/types";
import { Music, Pause, Play, Plus, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ME = MOCK_USERS[0];
const HOURS_23 = 23 * 3600000;

function isNearExpiry(note: MockNote): boolean {
  return Date.now() - note.timestamp.getTime() >= HOURS_23;
}

interface NoteDetailProps {
  note: MockNote;
  onClose: () => void;
}

function NoteDetail({ note, onClose }: NoteDetailProps) {
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState(note.replies);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
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
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const newReply = {
      id: `reply_${Date.now()}`,
      author: ME,
      text: replyText.trim(),
      timestamp: new Date(),
    };
    setLocalReplies((prev) => [newReply, ...prev]);
    setReplyText("");
    toast.success(`Replied to ${note.author.username}'s note`);
  };

  const visibleReplies = localReplies.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="glass-card w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center glass rounded-full text-white/60 hover:text-white transition-colors"
          aria-label="Close note"
        >
          <X size={16} />
        </button>

        {/* Author */}
        <div className="flex flex-col items-center gap-3 mb-5">
          <img
            src={note.author.avatarUrl}
            alt={note.author.displayName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/40"
          />
          <div className="text-center">
            <p className="font-semibold text-white text-sm">
              {note.author.username}
            </p>
            <p className="text-xs text-white/40">
              {formatRelativeTime(note.timestamp)}
            </p>
          </div>
        </div>

        {/* Note speech bubble */}
        <div className="relative mb-4">
          <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-white/90 leading-relaxed text-center">
            {note.text}
          </div>
          {/* Triangle */}
          <div className="absolute -bottom-2.5 left-5 w-0 h-0 border-l-8 border-l-transparent border-r-0 border-t-8 border-t-white/10" />
        </div>

        {/* Music track mini player */}
        {note.musicTrack && (
          <div className="flex items-center gap-3 mb-5 glass rounded-xl px-3 py-2.5 border border-white/10">
            {note.musicTrack.artworkUrl ? (
              <img
                src={note.musicTrack.artworkUrl}
                alt={note.musicTrack.title}
                className="w-8 h-8 rounded-md object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center">
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
            {note.musicTrack.previewUrl && (
              <button
                type="button"
                onClick={handlePlayPause}
                className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
              >
                {isPlaying ? (
                  <Pause size={14} className="text-primary" />
                ) : (
                  <Play size={14} className="text-white" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Replies list */}
        {visibleReplies.length > 0 && (
          <div className="mb-4 space-y-2">
            {visibleReplies.map((reply) => (
              <div key={reply.id} className="flex items-start gap-2">
                <img
                  src={reply.author.avatarUrl}
                  alt={reply.author.displayName}
                  className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 object-cover"
                />
                <div className="flex-1 glass rounded-xl rounded-tl-sm px-3 py-2">
                  <p className="text-xs font-medium text-primary">
                    {reply.author.username}
                  </p>
                  <p className="text-xs text-white/80">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply input */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <GlassInput
              placeholder={`Reply to ${note.author.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
              className="text-sm"
            />
          </div>
          <GlassButton
            variant="gradient"
            size="icon"
            onClick={handleReply}
            disabled={!replyText.trim()}
            aria-label="Send reply"
          >
            <Send size={14} />
          </GlassButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface CreateNoteProps {
  existingNote?: MockNote;
  onClose: () => void;
  onShare: (note: MockNote) => void;
}

function CreateNoteModal({ existingNote, onClose, onShare }: CreateNoteProps) {
  const [text, setText] = useState(existingNote?.text ?? "");
  const [music, setMusic] = useState<MusicTrack | undefined>(
    existingNote?.musicTrack,
  );
  const MAX_CHARS = 60;

  const handleShare = () => {
    if (!text.trim()) return;
    const note: MockNote = {
      id: `note_${Date.now()}`,
      author: ME,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="glass-card w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center glass rounded-full text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <h2 className="text-base font-bold text-white mb-5 text-center">
          Your Note
        </h2>

        {/* Avatar + preview bubble */}
        <div className="flex flex-col items-center gap-3 mb-5">
          <img
            src={ME.avatarUrl}
            alt={ME.displayName}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40"
          />
          {text && (
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-white/90 text-center max-w-[200px]">
              {text}
            </div>
          )}
        </div>

        {/* Text input */}
        <div className="mb-2">
          <textarea
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 bg-white/5 border border-white/10 outline-none focus:border-primary/50 focus:bg-white/8 transition-all duration-200 resize-none"
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
            disabled={!text.trim()}
            glow
            className="flex-1"
          >
            Share Note
          </GlassButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function NotesPanel() {
  const [notes, setNotes] = useState<MockNote[]>(MOCK_NOTES);
  const [selectedNote, setSelectedNote] = useState<MockNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const myNote = notes.find((n) => n.author.id === ME.id);
  const otherNotes = notes.filter((n) => n.author.id !== ME.id);

  const handleShare = (note: MockNote) => {
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.author.id !== ME.id);
      return [note, ...filtered];
    });
  };

  return (
    <>
      <div className="border-b border-white/8 px-4 py-3">
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-1 pt-2">
            {/* Current user bubble */}
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-14 relative"
              aria-label={myNote ? "Edit your note" : "Add a note"}
            >
              {myNote && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 z-10">
                  <div className="glass rounded-xl rounded-bl-sm px-2 py-1.5 text-[10px] text-white/90 leading-tight line-clamp-2 text-center shadow-lg">
                    {myNote.text}
                  </div>
                  <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white/10 mx-3" />
                </div>
              )}
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/60 relative">
                <img
                  src={ME.avatarUrl}
                  alt={ME.displayName}
                  className="w-full h-full object-cover"
                />
                {!myNote && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Plus size={16} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-white/50 w-14 text-center truncate">
                {myNote ? "Your note" : "Add note"}
              </span>
            </button>

            {/* Other users' notes */}
            {otherNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setSelectedNote(note)}
                className={`flex flex-col items-center gap-1.5 flex-shrink-0 pt-14 relative transition-opacity duration-200 ${
                  isNearExpiry(note) ? "opacity-40" : ""
                }`}
                aria-label={`View ${note.author.username}'s note`}
              >
                {/* Speech bubble — absolutely positioned above avatar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 z-10">
                  <div className="glass rounded-xl rounded-bl-sm px-2 py-1.5 text-[10px] text-white/90 leading-tight line-clamp-2 text-center shadow-lg">
                    {note.text}
                  </div>
                  <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white/10 mx-3" />
                </div>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
                  <img
                    src={note.author.avatarUrl}
                    alt={note.author.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Username label */}
                <span className="text-[10px] text-white/40 w-14 text-center truncate">
                  {note.author.username}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {selectedNote && (
          <NoteDetail
            key="note-detail"
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
          />
        )}
        {isCreating && (
          <CreateNoteModal
            key="create-note"
            existingNote={myNote}
            onClose={() => setIsCreating(false)}
            onShare={handleShare}
          />
        )}
      </AnimatePresence>
    </>
  );
}
