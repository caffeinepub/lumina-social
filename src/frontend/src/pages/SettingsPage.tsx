import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  ACCENT_PRESETS,
  type AccentThemeId,
  useTheme,
} from "@/context/ThemeContext";
import {
  getBlockedUsers,
  getMutedUsers,
  unblockUser,
  unmuteUser,
} from "@/utils/userRegistry";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  HelpCircle,
  Languages,
  Lock,
  Monitor,
  Moon,
  Palette,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  User,
  UserX,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginEvent {
  id: string;
  timestamp: string;
  browser: string;
  platform: string;
  device: string;
}

function parseBrowserName(ua: string): string {
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Browser";
}

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-primary/80">{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/30"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="px-5 py-4 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsRow({
  label,
  description,
  children,
}: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white/80">{label}</p>
        {description && <p className="text-xs text-white/40">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { logout, currentUser } = useAuthContext();
  const { accentTheme, setAccentTheme, isDark, setIsDark } = useTheme();
  const [privateAccount, setPrivateAccount] = useState(false);
  const [commentControl, setCommentControl] = useState("everyone");
  const [likesNotif, setLikesNotif] = useState(true);
  const [commentsNotif, setCommentsNotif] = useState(true);
  const [followsNotif, setFollowsNotif] = useState(true);
  const [messagesNotif, setMessagesNotif] = useState(true);
  const [language, setLanguage] = useState("en");
  const [dataUsage, setDataUsage] = useState("auto");

  const myUsername = currentUser?.username ?? "";
  const [blockedList, setBlockedList] = useState<string[]>(() =>
    getBlockedUsers(myUsername),
  );
  const [mutedList, setMutedList] = useState<string[]>(() =>
    getMutedUsers(myUsername),
  );
  const [loginActivity] = useState<LoginEvent[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("lumina_login_activity") ?? "[]",
      ) as LoginEvent[];
    } catch {
      return [];
    }
  });

  const handleUnblock = (targetUsername: string) => {
    unblockUser(myUsername, targetUsername);
    setBlockedList((prev) => prev.filter((u) => u !== targetUsername));
    toast.success(`Unblocked @${targetUsername}`);
  };

  const handleUnmute = (targetUsername: string) => {
    unmuteUser(myUsername, targetUsername);
    setMutedList((prev) => prev.filter((u) => u !== targetUsername));
    toast.success(`Unmuted @${targetUsername}`);
  };

  const handleDownloadData = () => {
    const data = {
      username: currentUser?.username,
      displayName: currentUser?.displayName,
      bio: currentUser?.bio,
      posts: JSON.parse(localStorage.getItem("lumina_posts") ?? "[]"),
      reels: JSON.parse(localStorage.getItem("lumina_reels") ?? "[]"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumina-data-${myUsername}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data download started");
  };

  const handleDeleteAccount = () => {
    // Clear all lumina_ keys
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("lumina_"),
    );
    for (const k of keys) localStorage.removeItem(k);
    logout();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
      <Toaster />
      <h1 className="text-xl font-bold mb-5">Settings</h1>

      {/* Account */}
      <SettingsSection title="Account" icon={<User size={18} />}>
        <Link
          to="/profile/edit"
          className="flex items-center justify-between hover:text-primary transition-colors group"
        >
          <p className="text-sm">Edit Profile</p>
          <ChevronRight
            size={16}
            className="text-white/30 group-hover:text-primary transition-colors"
          />
        </Link>
        <Link
          to="/accounts-centre"
          className="flex items-center justify-between hover:text-primary transition-colors group"
        >
          <p className="text-sm">Accounts Centre</p>
          <ChevronRight
            size={16}
            className="text-white/30 group-hover:text-primary transition-colors"
          />
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-sm">Change Password</p>
          <ChevronRight size={16} className="text-white/30" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Saved Posts</p>
          <ChevronRight size={16} className="text-white/30" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Archived Posts</p>
          <ChevronRight size={16} className="text-white/30" />
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection title="Privacy" icon={<Shield size={18} />}>
        <SettingsRow
          label="Private Account"
          description="Only approved followers can see your content"
        >
          <Switch
            checked={privateAccount}
            onCheckedChange={setPrivateAccount}
          />
        </SettingsRow>
        <SettingsRow label="Who can comment">
          <Select value={commentControl} onValueChange={setCommentControl}>
            <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white text-xs">
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="none">Nobody</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
        <SettingsRow label="Story Controls">
          <ChevronRight size={16} className="text-white/30" />
        </SettingsRow>
      </SettingsSection>

      {/* Blocked */}
      <SettingsSection title="Blocked Users" icon={<UserX size={18} />}>
        {blockedList.length === 0 ? (
          <p className="text-sm text-white/40">No blocked users</p>
        ) : (
          blockedList.map((username) => (
            <div key={username} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {username[0]?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">@{username}</p>
              </div>
              <GlassButton
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleUnblock(username)}
              >
                Unblock
              </GlassButton>
            </div>
          ))
        )}
      </SettingsSection>

      {/* Muted */}
      <SettingsSection title="Muted Accounts" icon={<VolumeX size={18} />}>
        {mutedList.length === 0 ? (
          <p className="text-sm text-white/40">No muted accounts</p>
        ) : (
          mutedList.map((username) => (
            <div key={username} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {username[0]?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">@{username}</p>
              </div>
              <GlassButton
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleUnmute(username)}
              >
                Unmute
              </GlassButton>
            </div>
          ))
        )}
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" icon={<Bell size={18} />}>
        <SettingsRow label="Likes">
          <Switch checked={likesNotif} onCheckedChange={setLikesNotif} />
        </SettingsRow>
        <SettingsRow label="Comments">
          <Switch checked={commentsNotif} onCheckedChange={setCommentsNotif} />
        </SettingsRow>
        <SettingsRow label="New Followers">
          <Switch checked={followsNotif} onCheckedChange={setFollowsNotif} />
        </SettingsRow>
        <SettingsRow label="Messages">
          <Switch checked={messagesNotif} onCheckedChange={setMessagesNotif} />
        </SettingsRow>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection title="Theme" icon={<Palette size={18} />}>
        <SettingsRow label="Appearance">
          <div className="flex gap-2">
            {[
              { value: true, icon: <Moon size={14} />, label: "Dark" },
              { value: false, icon: <Sun size={14} />, label: "Light" },
            ].map((opt) => (
              <GlassButton
                key={opt.label}
                variant={isDark === opt.value ? "gradient" : "glass"}
                size="sm"
                onClick={() => setIsDark(opt.value)}
                className="text-xs"
              >
                {opt.icon}
                {opt.label}
              </GlassButton>
            ))}
          </div>
        </SettingsRow>
        <div>
          <p className="text-sm text-white/80 mb-3">Accent Color</p>
          <div className="grid grid-cols-3 gap-2">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAccentTheme(preset.id as AccentThemeId)}
                className="relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:bg-white/5"
                style={
                  accentTheme === preset.id
                    ? {
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }
                    : {
                        border: "1px solid rgba(255,255,255,0.05)",
                      }
                }
              >
                <div
                  className="w-10 h-10 rounded-full"
                  style={{ background: preset.gradient }}
                />
                <span className="text-[10px] text-white/60 text-center leading-tight">
                  {preset.label}
                </span>
                {accentTheme === preset.id && (
                  <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white/90 flex items-center justify-center">
                    <span className="text-black text-[8px] font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* Language */}
      <SettingsSection title="Language" icon={<Languages size={18} />}>
        <SettingsRow label="App Language">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white text-xs">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
      </SettingsSection>

      {/* Data */}
      <SettingsSection title="Data & Usage" icon={<Download size={18} />}>
        <SettingsRow label="Media Quality">
          <Select value={dataUsage} onValueChange={setDataUsage}>
            <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white text-xs">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="low">Data Saver</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
        <button
          type="button"
          onClick={handleDownloadData}
          className="w-full text-left text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Download your data
        </button>
      </SettingsSection>

      {/* Security */}
      <SettingsSection title="Security" icon={<Lock size={18} />}>
        <SettingsRow label="Two-Factor Authentication">
          <Switch
            checked={false}
            onCheckedChange={() => toast.info("2FA setup coming soon")}
          />
        </SettingsRow>
        <div>
          <p className="text-sm text-white/80 mb-3">Login Activity</p>
          {loginActivity.length === 0 ? (
            <p className="text-xs text-white/40">No login activity yet.</p>
          ) : (
            <div className="space-y-2">
              {loginActivity.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex-shrink-0 text-white/40">
                    {event.device === "Mobile" ? (
                      <Smartphone size={16} />
                    ) : (
                      <Monitor size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/80">
                      {parseBrowserName(event.browser)} · {event.device}
                    </p>
                    <p className="text-[10px] text-white/35 truncate">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SettingsSection>

      {/* Help */}
      <SettingsSection title="Help & Support" icon={<HelpCircle size={18} />}>
        {[
          "Report a problem",
          "Privacy Policy",
          "Terms of Service",
          "About Lumina",
        ].map((item) => (
          <button
            type="button"
            key={item}
            className="w-full flex items-center justify-between hover:text-primary transition-colors group"
            onClick={() => toast.info(`${item} — coming soon`)}
          >
            <p className="text-sm">{item}</p>
            <ChevronRight
              size={16}
              className="text-white/30 group-hover:text-primary transition-colors"
            />
          </button>
        ))}
      </SettingsSection>

      {/* Danger zone */}
      <div className="glass-card p-5 space-y-3 border border-destructive/20">
        <h3 className="text-sm font-medium text-destructive/80">Danger Zone</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <GlassButton
              variant="outline"
              className="w-full border-destructive/30 text-destructive/80 hover:text-destructive hover:border-destructive/50"
            >
              <Trash2 size={14} />
              Delete Account
            </GlassButton>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-heavy border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/50">
                This action cannot be undone. All your posts, followers, and
                data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="glass border-white/20 text-white hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/80"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-white/20 py-4">
        © {new Date().getFullYear()} Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/40 transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
