# Lumina Social

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full Instagram-like social media platform with glass liquid UI
- Authentication: signup (email/username), login, session management, profile management
- User profiles: avatar upload, bio, website, private/public toggle, followers/following
- Home feed: infinite scroll, posts with like/comment/save, post creation with image upload
- Stories: create/view stories with 24h expiry, story highlights, reactions, viewers list
- Reels: short vertical video feed with scroll navigation, like/comment/share overlays
- Direct messaging: 1:1 and group chat, text/image messages, seen status, typing indicator, message reactions
- Search: users, posts, hashtags, trending section, recent history
- Notifications: likes, comments, follows, mentions, message alerts
- Notes: short text status notes expiring after 24h, visible above chats
- Settings: account privacy, blocked users, muted accounts, theme toggle
- Admin panel: user management, content moderation, reports, analytics
- Glass liquid design system: frosted glass panels, blur layers, glow borders, fluid gradients, smooth animations

### Modify
Nothing (new project).

### Remove
Nothing (new project).

## Implementation Plan

### Backend (Motoko)
1. User management: create/get/update user profiles, follow/unfollow, search users
2. Posts: create post (image URL + caption), get feed, like/unlike, comment, save/unsave, delete
3. Stories: create story, get active stories (<24h), view story, react to story, story highlights
4. Reels: create reel (video URL), get reels feed, like/comment
5. Direct messages: send message, get conversation, get conversations list, mark seen, message reactions
6. Notifications: get notifications, mark read
7. Search: search users/posts/hashtags, get trending, recent searches
8. Notes: create note (<24h expiry), get notes for chat contacts
9. Settings: update privacy, blocked list, muted list
10. Admin: get all users, moderate content, get reports, platform analytics

### Frontend (React)
1. Auth pages: Login, Signup
2. Layout: bottom nav (mobile) + sidebar nav (desktop), glass liquid shell
3. Home Feed page: story bar at top, infinite scroll posts
4. Post card component: media carousel, like/comment/save/share actions
5. Create Post modal: upload image, caption, preview
6. Story viewer: fullscreen overlay, progress bar, reactions
7. Story creator: upload, text overlay, sticker picker
8. Reels page: vertical scroll snapping reels player
9. Messages page: conversation list with notes bar, chat view
10. Search page: search bar, trending grid, user/hashtag results
11. Profile page: grid of posts, followers/following, highlights
12. Edit Profile page
13. Notifications page
14. Settings page with all sub-sections
15. Admin panel page (admin-only route)
16. Glass liquid design tokens: backdrop-blur, gradient borders, glow shadows
