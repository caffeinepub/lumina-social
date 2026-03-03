import { Slider } from "@/components/ui/slider";
import type { MusicTrack } from "@/types";
import { Music, Pause, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface iTunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

interface iTunesResponse {
  results: iTunesResult[];
}

interface MusicSearchPickerProps {
  value: MusicTrack | undefined;
  onChange: (track: MusicTrack | undefined) => void;
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function MusicSearchPicker({ value, onChange }: MusicSearchPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startSecs, setStartSecs] = useState(value?.startSeconds ?? 0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Pause audio when selected track changes, reset startSecs
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs when value changes to reset audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setStartSecs(value?.startSeconds ?? 0);
  }, [value?.id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const searchMusic = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=8`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network error");
      const data: iTunesResponse = await res.json();
      const tracks: MusicTrack[] = data.results.map((r) => ({
        id: String(r.trackId),
        title: r.trackName,
        artist: r.artistName,
        artworkUrl: r.artworkUrl100,
        previewUrl: r.previewUrl,
        startSeconds: 0,
      }));
      setResults(tracks);
      setIsOpen(true);
    } catch {
      setIsError(true);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchMusic(val);
    }, 400);
  };

  const handleSelect = (track: MusicTrack) => {
    onChange({ ...track, startSeconds: 0 });
    setStartSecs(0);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setStartSecs(0);
    onChange(undefined);
  };

  const handleStartSecsChange = (vals: number[]) => {
    const s = vals[0] ?? 0;
    setStartSecs(s);
    if (value) {
      onChange({ ...value, startSeconds: s });
    }
    // Update current audio position if playing
    if (audioRef.current) {
      audioRef.current.currentTime = s;
    }
  };

  const handlePlayPause = () => {
    if (!value?.previewUrl) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(value.previewUrl);
        audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      }
      audioRef.current.currentTime = startSecs;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Selected track display */}
      {value ? (
        <div className="space-y-2">
          <div className="flex items-center gap-3 glass rounded-xl px-3 py-2.5 border border-white/10">
            {value.artworkUrl ? (
              <img
                src={value.artworkUrl}
                alt={value.title}
                className="w-8 h-8 rounded-md object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center flex-shrink-0">
                <Music size={12} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {value.title}
              </p>
              <p className="text-[10px] text-white/50 truncate">
                {value.artist}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {value.previewUrl && (
                <button
                  type="button"
                  onClick={handlePlayPause}
                  className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label={isPlaying ? "Pause preview" : "Play preview"}
                >
                  {isPlaying ? (
                    <Pause size={12} className="text-primary" />
                  ) : (
                    <Play size={12} className="text-white" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Remove track"
              >
                <X size={12} className="text-white/60" />
              </button>
            </div>
          </div>

          {/* Clip start selector */}
          {value.previewUrl && (
            <div className="glass rounded-xl px-3 py-2.5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">
                  Clip start
                </p>
                <span className="text-[10px] text-primary font-medium">
                  {formatSeconds(startSecs)} – {formatSeconds(startSecs + 30)}
                </span>
              </div>
              <Slider
                min={0}
                max={25}
                step={1}
                value={[startSecs]}
                onValueChange={handleStartSecsChange}
                className="w-full"
              />
              <p className="text-[9px] text-white/30">
                Drag to choose which part of the song plays
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Search input */
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <Music size={14} />
          </div>
          <input
            type="text"
            placeholder="Search for music..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 bg-white/5 border border-white/10 outline-none focus:border-primary/50 transition-all duration-200"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-xs text-red-400/80 mt-1.5 px-1">
          Search failed, try again
        </p>
      )}

      {/* Results dropdown */}
      {isOpen && results.length > 0 && !value && (
        <div className="absolute z-50 top-full mt-1.5 w-full max-h-60 overflow-y-auto glass-card border border-white/10 rounded-xl shadow-2xl">
          {results.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => handleSelect(track)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-white/8 transition-colors text-left"
            >
              {track.artworkUrl ? (
                <img
                  src={track.artworkUrl}
                  alt={track.title}
                  className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center flex-shrink-0">
                  <Music size={12} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {track.title}
                </p>
                <p className="text-[10px] text-white/50 truncate">
                  {track.artist}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
