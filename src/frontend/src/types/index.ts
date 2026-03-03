export interface MockUser {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  websiteUrl: string;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isVerified: boolean;
}

export interface MockPost {
  id: string;
  author: MockUser;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: MockComment[];
  timestamp: Date;
  isLiked: boolean;
  isSaved: boolean;
  location?: string;
  hasStory: boolean;
  tags?: string[];
  isPublic: boolean;
  mediaType?: "image" | "video";
}

export interface MockComment {
  id: string;
  author: MockUser;
  text: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies?: MockCommentReply[];
}

export interface MockCommentReply {
  id: string;
  author: MockUser;
  text: string;
  timestamp: Date;
}

export interface MockStory {
  id: string;
  author: MockUser;
  imageGradient: string;
  text?: string;
  timestamp: Date;
  isViewed: boolean;
  duration: number;
  musicTrack?: MusicTrack;
}

export interface MockReel {
  id: string;
  author: MockUser;
  caption: string;
  audioTrack: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: string;
  views: number;
}

export interface MockConversation {
  id: string;
  participants: MockUser[];
  lastMessage: MockMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  isMuted: boolean;
  isPinned?: boolean;
}

export interface MockMessage {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  timestamp: Date;
  isRead: boolean;
  reactions?: { emoji: string; count: number }[];
  type: "text" | "image" | "sticker" | "voice" | "shared_post" | "media";
  sharedPost?: {
    id: string;
    imageUrl: string;
    caption: string;
    authorUsername: string;
  };
  mediaUrl?: string;
  mediaType?: "image" | "video";
  audioUrl?: string;
  duration?: number;
}

export interface MockNotification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "message";
  actor: MockUser;
  postThumbnail?: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  previewUrl: string;
  startSeconds?: number;
}

export interface MockNote {
  id: string;
  author: MockUser;
  text: string; // max 60 chars
  musicTrack?: MusicTrack;
  timestamp: Date;
  expiresAt: Date; // 24h from timestamp
  replies: { id: string; author: MockUser; text: string; timestamp: Date }[];
}

export interface MockHighlight {
  id: string;
  title: string;
  coverGradient: string;
  storyCount: number;
}
