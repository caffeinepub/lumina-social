import { useAuthContext } from "@/components/auth/AuthContext";
import { GradientText } from "@/components/glass/GradientText";
import { useApp } from "@/context/AppContext";
import { useIsAdmin } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Film,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  Shield,
  User,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuthContext();
  const { unreadNotificationCount, setIsCreateOpen } = useApp();
  const { data: isAdmin } = useIsAdmin();

  const navItems: NavItem[] = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Explore" },
    { href: "/reels", icon: Film, label: "Reels" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    {
      href: "/notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadNotificationCount,
    },
    { href: "/profile/me", icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  if (isAdmin) {
    navItems.push({ href: "/admin", icon: Shield, label: "Admin" });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] z-40 glass-heavy border-r border-white/8 flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="mb-8 px-2">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/assets/generated/lumina-logo-transparent.dim_200x200.png"
            alt="Lumina"
            className="w-8 h-8"
          />
          <GradientText className="text-2xl font-display font-bold tracking-tight">
            Lumina
          </GradientText>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-white/10 text-white shadow-glow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/6",
              )}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={cn(
                    "transition-all duration-200",
                    isActive && "text-primary",
                  )}
                />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center animate-pulse-glow">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 gradient-bg rounded-full" />
              )}
            </Link>
          );
        })}

        {/* Create button */}
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/6 transition-all duration-200 mt-1"
        >
          <PlusSquare size={20} />
          <span className="text-sm font-medium">Create</span>
        </button>
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/40 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 mt-4"
      >
        <LogOut size={18} />
        <span className="text-sm">Sign out</span>
      </button>
    </aside>
  );
}
