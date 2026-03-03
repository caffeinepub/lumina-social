import { useAuthContext } from "@/components/auth/AuthContext";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { GlassCard } from "@/components/glass/GlassCard";
import { GradientText } from "@/components/glass/GradientText";
import { Toaster } from "@/components/ui/sonner";
import { useApp } from "@/context/AppContext";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const { isAuthenticated, isInitializing, iiIsInitializing } =
    useAuthContext();
  const navigate = useNavigate();
  const { isCreateOpen, setIsCreateOpen } = useApp();

  useEffect(() => {
    if (!isInitializing && !iiIsInitializing && !isAuthenticated) {
      void navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, iiIsInitializing, navigate]);

  // Show centered loading overlay while II is initializing
  if (iiIsInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="p-10 flex flex-col items-center gap-5 shadow-elevated">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary"
            />
            <div className="text-center">
              <GradientText className="text-2xl font-display">
                Lumina
              </GradientText>
              <p className="text-white/40 text-sm mt-1">Loading...</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="lg:ml-[260px] pb-20 lg:pb-0 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <div className="lg:hidden">
        <BottomNav />
      </div>

      {/* Create post modal */}
      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <Toaster />
    </div>
  );
}
