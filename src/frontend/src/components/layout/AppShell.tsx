import { useAuthContext } from "@/components/auth/AuthContext";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { Toaster } from "@/components/ui/sonner";
import { useApp } from "@/context/AppContext";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const { isAuthenticated, isInitializing } = useAuthContext();
  const navigate = useNavigate();
  const { isCreateOpen, setIsCreateOpen } = useApp();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full gradient-bg shadow-glow animate-pulse" />
          <p className="text-white/40 text-sm">Loading Lumina...</p>
        </div>
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
      <main className="lg:ml-[260px] pb-20 lg:pb-0 min-h-screen">
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
