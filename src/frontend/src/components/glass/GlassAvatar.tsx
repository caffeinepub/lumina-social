import { cn } from "@/lib/utils";
import { useState } from "react";

interface GlassAvatarProps {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  hasStory?: boolean;
  isViewed?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizes = {
  xs: "w-7 h-7",
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
  "2xl": "w-28 h-28",
};

const ringPad = {
  xs: "p-0.5",
  sm: "p-0.5",
  md: "p-[3px]",
  lg: "p-[3px]",
  xl: "p-1",
  "2xl": "p-1",
};

const textSizes = {
  xs: "text-[9px]",
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-lg",
  "2xl": "text-2xl",
};

function getInitials(alt: string): string {
  const parts = alt.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return alt.substring(0, 2).toUpperCase();
}

function AvatarImage({
  src,
  alt,
  size = "md",
}: {
  src: string;
  alt: string;
  size?: GlassAvatarProps["size"];
}) {
  const [errored, setErrored] = useState(false);

  if (!src || src === "" || errored) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center gradient-bg text-white font-semibold select-none",
          textSizes[size ?? "md"],
        )}
      >
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export function GlassAvatar({
  src,
  alt,
  size = "md",
  hasStory = false,
  isViewed = false,
  onClick,
  className,
}: GlassAvatarProps) {
  const inner = (
    <div
      className={cn(
        "rounded-full overflow-hidden bg-white/10 flex-shrink-0",
        sizes[size],
        className,
      )}
    >
      <AvatarImage src={src} alt={alt} size={size} />
    </div>
  );

  if (!hasStory) {
    return (
      <div
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent) => e.key === "Enter" && onClick()
            : undefined
        }
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={cn(
          "rounded-full flex-shrink-0",
          onClick && "cursor-pointer hover:opacity-90 transition-opacity",
          sizes[size],
          className,
        )}
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => e.key === "Enter" && onClick()
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "rounded-full flex-shrink-0",
        onClick &&
          "cursor-pointer hover:scale-105 transition-transform duration-200",
      )}
    >
      <div
        className={cn(
          "rounded-full",
          ringPad[size],
          isViewed ? "story-ring-viewed bg-white/20" : "story-ring",
        )}
      >
        <div className={cn("rounded-full p-0.5 bg-background", sizes[size])}>
          <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
            <AvatarImage src={src} alt={alt} size={size} />
          </div>
        </div>
      </div>
    </div>
  );
}
