import { Gender } from "@/backend.d";
import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput } from "@/components/glass/GlassInput";
import { GradientText } from "@/components/glass/GradientText";
import { Toaster } from "@/components/ui/sonner";
import { useSaveProfile } from "@/hooks/useBackend";
import { Link, useNavigate } from "@tanstack/react-router";
import { AtSign, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, isAuthenticated } = useAuthContext();
  const saveProfile = useSaveProfile();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const handleSignup = async () => {
    if (!displayName || !username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (username.includes(" ")) {
      toast.error("Username cannot contain spaces");
      return;
    }
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <GlassCard className="p-8 shadow-elevated">
          <div className="text-center mb-6">
            <GradientText className="text-4xl font-display tracking-tight">
              Lumina
            </GradientText>
            <p className="text-white/40 text-sm mt-1">Join the community</p>
          </div>

          <div className="space-y-3.5">
            <GlassInput
              icon={<User size={14} />}
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
            />
            <GlassInput
              icon={<AtSign size={14} />}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""),
                )
              }
              autoComplete="username"
            />
            <GlassInput
              icon={<Mail size={14} />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <GlassInput
              icon={<Lock size={14} />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            <p className="text-xs text-white/30 px-1">
              By signing up, you agree to our Terms and Privacy Policy.
            </p>

            <GlassButton
              variant="gradient"
              className="w-full"
              onClick={handleSignup}
              disabled={isLoggingIn || saveProfile.isPending}
              glow
            >
              {isLoggingIn || saveProfile.isPending
                ? "Creating account..."
                : "Create Account"}
            </GlassButton>
          </div>

          <p className="text-center text-sm text-white/40 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </GlassCard>

        <p className="text-center text-xs text-white/20 mt-6">
          © {new Date().getFullYear()} Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>

      <Toaster />
    </div>
  );
}
