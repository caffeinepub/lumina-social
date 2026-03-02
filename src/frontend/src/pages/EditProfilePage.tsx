import { Gender } from "@/backend.d";
import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput } from "@/components/glass/GlassInput";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_USERS } from "@/data/mockData";
import { useSaveProfile } from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, AtSign, Camera, FileText, Globe, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function EditProfilePage() {
  const user = MOCK_USERS[0];
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [website, setWebsite] = useState(user.websiteUrl);
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [gender, setGender] = useState<string>("other");
  const saveProfile = useSaveProfile();

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({
        displayName,
        username,
        bio,
        websiteUrl: website,
        isPrivate,
        avatarUrl: user.avatarUrl,
        gender: Gender.other,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <Toaster />
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/profile/$username" params={{ username: "me" }}>
          <button
            type="button"
            className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        </Link>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      <GlassCard className="p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <GlassAvatar
              src={user.avatarUrl}
              alt={user.displayName}
              size="2xl"
            />
            <button
              type="button"
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full gradient-bg flex items-center justify-center shadow-glow-sm hover:scale-110 transition-transform"
              aria-label="Change profile photo"
            >
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Change profile photo
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs uppercase tracking-wider">
              Display Name
            </Label>
            <GlassInput
              icon={<User size={14} />}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs uppercase tracking-wider">
              Username
            </Label>
            <GlassInput
              icon={<AtSign size={14} />}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="username"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs uppercase tracking-wider">
              Bio
            </Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              rows={4}
              maxLength={150}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 resize-none rounded-xl"
            />
            <p className="text-xs text-white/30 text-right">{bio.length}/150</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs uppercase tracking-wider">
              Website
            </Label>
            <GlassInput
              icon={<Globe size={14} />}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="yourwebsite.com"
              type="url"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs uppercase tracking-wider">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10 text-white">
                <SelectItem value="male" className="hover:bg-white/10">
                  Male
                </SelectItem>
                <SelectItem value="female" className="hover:bg-white/10">
                  Female
                </SelectItem>
                <SelectItem value="other" className="hover:bg-white/10">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy toggle */}
          <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium">Private Account</p>
              <p className="text-xs text-white/40">
                Only followers can see your posts
              </p>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              aria-label="Toggle private account"
            />
          </div>
        </div>

        <GlassButton
          variant="gradient"
          className="w-full"
          onClick={handleSave}
          disabled={saveProfile.isPending}
          glow
        >
          {saveProfile.isPending ? "Saving..." : "Save Changes"}
        </GlassButton>
      </GlassCard>
    </div>
  );
}
