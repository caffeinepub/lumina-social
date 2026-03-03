import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Film, Home, MessageCircle, Plus, Search, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/reels", icon: Film, label: "Reels" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profile/me", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();
  const { setIsCreateOpen } = useApp();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass-heavy border-t border-white/8 px-2"
      style={{
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingTop: 8,
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex flex-col items-center gap-0.5 min-w-[48px] min-h-[48px] justify-center"
              aria-label={item.label}
            >
              <Icon
                size={22}
                className={cn(
                  "transition-all duration-200",
                  isActive ? "text-primary scale-110" : "text-white/50",
                )}
              />
              {isActive && <div className="w-1 h-1 rounded-full gradient-bg" />}
            </Link>
          );
        })}

        {/* Center create button */}
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full gradient-bg shadow-glow hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Create post"
        >
          <Plus size={22} className="text-white" />
        </button>

        {NAV_ITEMS.slice(2).map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex flex-col items-center gap-0.5 min-w-[48px] min-h-[48px] justify-center"
              aria-label={item.label}
            >
              <Icon
                size={22}
                className={cn(
                  "transition-all duration-200",
                  isActive ? "text-primary scale-110" : "text-white/50",
                )}
              />
              {isActive && <div className="w-1 h-1 rounded-full gradient-bg" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
