import type { MockConversation, MockMessage, MockNote } from "@/types";

export const STORY_GRADIENTS = [
  "linear-gradient(135deg, #6B21A8, #EC4899)",
  "linear-gradient(135deg, #0EA5E9, #6366F1)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #10B981, #3B82F6)",
  "linear-gradient(135deg, #8B5CF6, #06B6D4)",
  "linear-gradient(135deg, #F97316, #EC4899)",
  "linear-gradient(135deg, #14B8A6, #8B5CF6)",
  "linear-gradient(135deg, #6366F1, #F43F5E)",
];

export const MOCK_NOTES: MockNote[] = [];

export const TRENDING_HASHTAGS = [
  { tag: "#digitalart", posts: 4820000 },
  { tag: "#streetphotography", posts: 12300000 },
  { tag: "#generativeart", posts: 890000 },
  { tag: "#filmmaking", posts: 6700000 },
  { tag: "#fashionweek", posts: 23400000 },
  { tag: "#3dart", posts: 3200000 },
  { tag: "#synthwave", posts: 1450000 },
  { tag: "#botanical", posts: 5600000 },
];

// Keep helper for backward compat
const _mockMsg = (
  id: string,
  senderId: string,
  text: string,
  minsAgo: number,
  isRead = true,
): MockMessage => ({
  id,
  senderId,
  text,
  timestamp: new Date(Date.now() - minsAgo * 60000),
  isRead,
  type: "text",
});

// No fake conversations — all empty to start
export const MOCK_CONVERSATIONS: MockConversation[] = [];

export const MOCK_MESSAGES_BY_CONV: Record<string, MockMessage[]> = {};

// Suppress unused warning
void _mockMsg;

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  if (diffWeeks < 4) return `${diffWeeks}w`;
  return date.toLocaleDateString();
}

export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
