import { cn } from "@/lib/utils";

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
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
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
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
