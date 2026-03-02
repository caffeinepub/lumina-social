import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function GradientText({
  children,
  className,
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag className={cn("gradient-text font-bold", className)}>{children}</Tag>
  );
}
