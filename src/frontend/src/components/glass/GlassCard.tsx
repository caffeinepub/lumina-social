import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  glow,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "glass-card transition-all duration-300",
        glow && "glow-primary",
        onClick && "cursor-pointer hover:scale-[1.01] hover:shadow-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}
