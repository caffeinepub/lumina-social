import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
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
import { MOCK_USERS } from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Globe,
  HelpCircle,
  Languages,
  Lock,
  Moon,
  Palette,
  Shield,
  Sun,
  Trash2,
  User,
  UserX,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

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
  const { logout } = useAuthContext();
  const [privateAccount, setPrivateAccount] = useState(false);
  const [commentControl, setCommentControl] = useState("everyone");
  const [likesNotif, setLikesNotif] = useState(true);
  const [commentsNotif, setCommentsNotif] = useState(true);
  const [followsNotif, setFollowsNotif] = useState(true);
  const [messagesNotif, setMessagesNotif] = useState(true);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [dataUsage, setDataUsage] = useState("auto");

  const blockedUsers = MOCK_USERS.slice(5, 7);
  const mutedUsers = MOCK_USERS.slice(3, 5);

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
        {blockedUsers.length === 0 ? (
          <p className="text-sm text-white/40">No blocked users</p>
        ) : (
          blockedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-sm">{user.username}</p>
              </div>
              <GlassButton variant="outline" size="sm" className="text-xs">
                Unblock
              </GlassButton>
            </div>
          ))
        )}
      </SettingsSection>

      {/* Muted */}
      <SettingsSection title="Muted Accounts" icon={<VolumeX size={18} />}>
        {mutedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm">{user.username}</p>
            </div>
            <GlassButton variant="outline" size="sm" className="text-xs">
              Unmute
            </GlassButton>
          </div>
        ))}
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
              { value: "dark", icon: <Moon size={14} />, label: "Dark" },
              { value: "light", icon: <Sun size={14} />, label: "Light" },
            ].map((opt) => (
              <GlassButton
                key={opt.value}
                variant={theme === opt.value ? "gradient" : "glass"}
                size="sm"
                onClick={() => setTheme(opt.value)}
                className="text-xs"
              >
                {opt.icon}
                {opt.label}
              </GlassButton>
            ))}
          </div>
        </SettingsRow>
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
          onClick={() => toast.success("Data download initiated!")}
          className="w-full text-left text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Download your data
        </button>
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
                onClick={logout}
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
