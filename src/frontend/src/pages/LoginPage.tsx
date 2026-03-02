import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput } from "@/components/glass/GlassInput";
import { GradientText } from "@/components/glass/GradientText";
import { Toaster } from "@/components/ui/sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiApple, SiGoogle } from "react-icons/si";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <GlassCard className="p-8 shadow-elevated">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src="/assets/generated/lumina-logo-transparent.dim_200x200.png"
                  alt="Lumina"
                  className="w-10 h-10"
                />
              </div>
              <GradientText className="text-4xl font-display tracking-tight">
                Lumina
              </GradientText>
            </motion.div>
            <p className="text-white/40 text-sm mt-1">
              Share your world in light
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <GlassInput
              icon={<Mail size={14} />}
              type="email"
              placeholder="Email or username"
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
              autoComplete="current-password"
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            <div className="text-right">
              <button
                type="button"
                className="text-xs text-primary/70 hover:text-primary transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <GlassButton
              variant="gradient"
              className="w-full"
              onClick={handleLogin}
              disabled={isLoggingIn}
              glow
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </GlassButton>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-3">
            <GlassButton
              variant="glass"
              className="w-full text-white/60 hover:text-white"
              onClick={() => toast("Google sign-in coming soon")}
            >
              <SiGoogle size={14} />
              Google
            </GlassButton>
            <GlassButton
              variant="glass"
              className="w-full text-white/60 hover:text-white"
              onClick={() => toast("Apple sign-in coming soon")}
            >
              <SiApple size={14} />
              Apple
            </GlassButton>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </GlassCard>

        {/* Footer */}
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
