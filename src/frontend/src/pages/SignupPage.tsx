import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput } from "@/components/glass/GlassInput";
import { GradientText } from "@/components/glass/GradientText";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { AtSign, Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  // II onboarding state: shows profile form after II login for new users
  const [showIIOnboarding, setShowIIOnboarding] = useState(false);
  const [iiDisplayName, setIIDisplayName] = useState("");
  const [iiUsername, setIIUsername] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const { signup, isAuthenticated, iiLogin, iiIsLoggingIn, iiIsInitializing } =
    useAuthContext();
  const { identity, isLoginSuccess } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();

  // Navigate when fully authenticated with a profile
  useEffect(() => {
    if (isAuthenticated && !showIIOnboarding) {
      void navigate({ to: "/" });
    }
  }, [isAuthenticated, showIIOnboarding, navigate]);

  // After II login succeeds: check if canister profile exists
  useEffect(() => {
    if (!isLoginSuccess || !identity || !actor) return;

    void (async () => {
      try {
        const profile = await actor.getCallerUserProfile();
        if (profile) {
          // Existing user — navigate home
          void navigate({ to: "/" });
        } else {
          // New user — show onboarding form
          const principal = identity.getPrincipal().toString();
          setIIUsername(principal.slice(0, 12).replace(/-/g, ""));
          setIIDisplayName("");
          setShowIIOnboarding(true);
        }
      } catch {
        // actor not ready yet — will be caught when actor re-fetches
      }
    })();
  }, [isLoginSuccess, identity, actor, navigate]);

  if (isAuthenticated && !showIIOnboarding) return null;

  const handleSignup = async () => {
    if (!displayName || !username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (username.includes(" ")) {
      toast.error("Username cannot contain spaces");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsPending(true);
    try {
      signup({
        username,
        email,
        displayName,
        bio: "",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        reelsCount: 0,
      });
      void navigate({ to: "/" });
    } finally {
      setIsPending(false);
    }
  };

  const handleIIOnboardingSubmit = async () => {
    if (!iiDisplayName.trim() || !iiUsername.trim()) {
      toast.error("Please fill in your display name and username");
      return;
    }
    if (!actor) {
      toast.error("Not connected to ICP yet, please wait a moment");
      return;
    }

    setIsSavingProfile(true);
    try {
      const principal = identity?.getPrincipal().toString() ?? "";
      const profileData = {
        displayName: iiDisplayName.trim(),
        username: iiUsername.trim().toLowerCase(),
        bio: "",
        websiteUrl: "",
        isPrivate: false,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${principal}`,
        gender: undefined,
      };

      await actor.saveCallerUserProfile(profileData);

      // Also save locally so the session works immediately
      signup({
        username: profileData.username,
        email: "",
        displayName: profileData.displayName,
        bio: "",
        avatarUrl: profileData.avatarUrl,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        reelsCount: 0,
      });

      toast.success("Profile created on-chain!");
      setShowIIOnboarding(false);
      void navigate({ to: "/" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
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
            <p className="text-white/40 text-sm mt-1">
              {showIIOnboarding ? "Set up your profile" : "Join the community"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {showIIOnboarding ? (
              /* ── II Onboarding form ── */
              <motion.div
                key="ii-onboarding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                    <Shield size={12} />
                    Signed in with Internet Identity
                  </div>
                </div>

                <GlassInput
                  icon={<User size={14} />}
                  type="text"
                  placeholder="Display name"
                  value={iiDisplayName}
                  onChange={(e) => setIIDisplayName(e.target.value)}
                  autoFocus
                  data-ocid="signup.ii_displayname_input"
                />
                <GlassInput
                  icon={<AtSign size={14} />}
                  type="text"
                  placeholder="Username"
                  value={iiUsername}
                  onChange={(e) =>
                    setIIUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""),
                    )
                  }
                  data-ocid="signup.ii_username_input"
                />

                <p className="text-xs text-white/30 px-1">
                  Your profile will be saved permanently on the Internet
                  Computer blockchain.
                </p>

                <GlassButton
                  variant="gradient"
                  className="w-full"
                  onClick={handleIIOnboardingSubmit}
                  disabled={isSavingProfile}
                  glow
                  data-ocid="signup.ii_submit_button"
                >
                  {isSavingProfile ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving to blockchain...
                    </>
                  ) : (
                    "Create My Profile"
                  )}
                </GlassButton>
              </motion.div>
            ) : (
              /* ── Normal signup form ── */
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Internet Identity button */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="mb-4"
                >
                  <GlassButton
                    variant="gradient"
                    className="w-full"
                    onClick={() => iiLogin()}
                    disabled={iiIsLoggingIn || iiIsInitializing}
                    glow
                    data-ocid="signup.ii_button"
                  >
                    {iiIsLoggingIn ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Shield size={16} className="flex-shrink-0" />
                        <span>Create account with Internet Identity</span>
                      </>
                    )}
                  </GlassButton>
                  <p className="text-center text-xs text-white/30 mt-2">
                    Permanent account on the ICP blockchain
                  </p>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/30 uppercase tracking-widest">
                    or
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="space-y-3.5">
                  <GlassInput
                    icon={<User size={14} />}
                    type="text"
                    placeholder="Display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="name"
                    data-ocid="signup.displayname_input"
                  />
                  <GlassInput
                    icon={<AtSign size={14} />}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9._]/g, ""),
                      )
                    }
                    autoComplete="username"
                    data-ocid="signup.username_input"
                  />
                  <GlassInput
                    icon={<Mail size={14} />}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    data-ocid="signup.email_input"
                  />
                  <GlassInput
                    icon={<Lock size={14} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-white transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  />

                  <p className="text-xs text-white/30 px-1">
                    By signing up, you agree to our Terms and Privacy Policy.
                  </p>

                  <GlassButton
                    variant="gradient"
                    className="w-full"
                    onClick={handleSignup}
                    disabled={isPending}
                    glow
                    data-ocid="signup.submit_button"
                  >
                    {isPending ? "Creating account..." : "Create Account"}
                  </GlassButton>
                </div>

                <p className="text-center text-sm text-white/40 mt-5">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                    data-ocid="signup.link"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
