import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ── Accent Theme Presets ────────────────────────────────────────────────────

export type AccentThemeId =
  | "violet-pink"
  | "red-blue"
  | "yellow-green"
  | "orange-purple"
  | "cyan-rose"
  | "gold-teal";

export interface AccentPreset {
  id: AccentThemeId;
  label: string;
  primary: string; // OKLCH raw value
  secondary: string;
  gradient: string;
  previewFrom: string;
  previewTo: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: "violet-pink",
    label: "Violet × Pink",
    primary: "0.65 0.25 290",
    secondary: "0.65 0.22 340",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.25 290), oklch(0.6 0.22 340))",
    previewFrom: "#7c3aed",
    previewTo: "#db2777",
  },
  {
    id: "red-blue",
    label: "Red × Blue",
    primary: "0.58 0.22 25",
    secondary: "0.6 0.2 250",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.58 0.2 250))",
    previewFrom: "#dc2626",
    previewTo: "#2563eb",
  },
  {
    id: "yellow-green",
    label: "Yellow × Green",
    primary: "0.8 0.18 90",
    secondary: "0.65 0.2 145",
    gradient:
      "linear-gradient(135deg, oklch(0.78 0.18 90), oklch(0.63 0.2 145))",
    previewFrom: "#ca8a04",
    previewTo: "#16a34a",
  },
  {
    id: "orange-purple",
    label: "Orange × Purple",
    primary: "0.68 0.21 50",
    secondary: "0.6 0.22 300",
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.21 50), oklch(0.58 0.22 300))",
    previewFrom: "#ea580c",
    previewTo: "#9333ea",
  },
  {
    id: "cyan-rose",
    label: "Cyan × Rose",
    primary: "0.72 0.18 200",
    secondary: "0.65 0.22 0",
    gradient:
      "linear-gradient(135deg, oklch(0.7 0.18 200), oklch(0.62 0.22 0))",
    previewFrom: "#0891b2",
    previewTo: "#e11d48",
  },
  {
    id: "gold-teal",
    label: "Gold × Teal",
    primary: "0.78 0.17 70",
    secondary: "0.65 0.18 185",
    gradient:
      "linear-gradient(135deg, oklch(0.76 0.17 70), oklch(0.63 0.18 185))",
    previewFrom: "#b45309",
    previewTo: "#0d9488",
  },
];

// ── Chat Theme Presets ──────────────────────────────────────────────────────

export type ChatThemeId =
  | "default"
  | "midnight"
  | "sunset"
  | "ocean"
  | "forest"
  | "candy"
  | "aurora"
  | "dark-gold";

export interface ChatThemePreset {
  id: ChatThemeId;
  label: string;
  gradient: string | null;
  previewColors: [string, string];
}

export const CHAT_THEME_PRESETS: ChatThemePreset[] = [
  {
    id: "default",
    label: "Default",
    gradient: null,
    previewColors: ["#1a1a2a", "#0a0a0f"],
  },
  {
    id: "midnight",
    label: "Midnight",
    gradient: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    previewColors: ["#0f0c29", "#302b63"],
  },
  {
    id: "sunset",
    label: "Sunset",
    gradient: "linear-gradient(160deg, #ff6b6b 0%, #feca57 100%)",
    previewColors: ["#ff6b6b", "#feca57"],
  },
  {
    id: "ocean",
    label: "Ocean",
    gradient: "linear-gradient(160deg, #005c97 0%, #363795 100%)",
    previewColors: ["#005c97", "#363795"],
  },
  {
    id: "forest",
    label: "Forest",
    gradient: "linear-gradient(160deg, #134e5e 0%, #71b280 100%)",
    previewColors: ["#134e5e", "#71b280"],
  },
  {
    id: "candy",
    label: "Candy",
    gradient: "linear-gradient(160deg, #f953c6 0%, #b91d73 100%)",
    previewColors: ["#f953c6", "#b91d73"],
  },
  {
    id: "aurora",
    label: "Aurora",
    gradient: "linear-gradient(160deg, #00c3ff 0%, #ffff1c 50%, #00c3ff 100%)",
    previewColors: ["#00c3ff", "#ffff1c"],
  },
  {
    id: "dark-gold",
    label: "Dark Gold",
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #b8860b 100%)",
    previewColors: ["#1a1a2e", "#b8860b"],
  },
];

// ── Context ─────────────────────────────────────────────────────────────────

interface ThemeContextType {
  accentTheme: AccentThemeId;
  setAccentTheme: (id: AccentThemeId) => void;
  chatThemes: Record<string, ChatThemeId>;
  setChatTheme: (convId: string, themeId: ChatThemeId) => void;
  getChatBackground: (convId: string) => string | null;
  currentAccentPreset: AccentPreset;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyAccentTheme(preset: AccentPreset): void {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", `oklch(${preset.primary})`);
  root.style.setProperty("--color-secondary", `oklch(${preset.secondary})`);
  root.style.setProperty("--accent-gradient", preset.gradient);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentTheme, setAccentThemeState] = useState<AccentThemeId>(() => {
    try {
      return (
        (localStorage.getItem("lumina_accent_theme") as AccentThemeId) ??
        "violet-pink"
      );
    } catch {
      return "violet-pink";
    }
  });

  const [chatThemes, setChatThemesState] = useState<
    Record<string, ChatThemeId>
  >(() => {
    try {
      const stored = localStorage.getItem("lumina_chat_themes");
      if (stored) return JSON.parse(stored) as Record<string, ChatThemeId>;
    } catch {
      // ignore
    }
    return {};
  });

  const [isDark, setIsDarkState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("lumina_is_dark");
      if (stored !== null) return stored === "true";
    } catch {
      // ignore
    }
    return true;
  });

  const currentAccentPreset =
    ACCENT_PRESETS.find((p) => p.id === accentTheme) ?? ACCENT_PRESETS[0];

  // Apply accent theme CSS variables on mount and change
  useEffect(() => {
    applyAccentTheme(currentAccentPreset);
  }, [currentAccentPreset]);

  const setAccentTheme = useCallback((id: AccentThemeId) => {
    setAccentThemeState(id);
    try {
      localStorage.setItem("lumina_accent_theme", id);
    } catch {
      // ignore
    }
  }, []);

  const setChatTheme = useCallback((convId: string, themeId: ChatThemeId) => {
    setChatThemesState((prev) => {
      const next = { ...prev, [convId]: themeId };
      try {
        localStorage.setItem("lumina_chat_themes", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const getChatBackground = useCallback(
    (convId: string): string | null => {
      const themeId = chatThemes[convId];
      if (!themeId || themeId === "default") return null;
      return CHAT_THEME_PRESETS.find((p) => p.id === themeId)?.gradient ?? null;
    },
    [chatThemes],
  );

  // Apply dark class to document on mount and whenever isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  const setIsDark = useCallback((dark: boolean) => {
    setIsDarkState(dark);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem("lumina_is_dark", String(dark));
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        accentTheme,
        setAccentTheme,
        chatThemes,
        setChatTheme,
        getChatBackground,
        currentAccentPreset,
        isDark,
        setIsDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
