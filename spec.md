# Lumina Social

## Current State
- Full Instagram-like social media app with glass liquid UI
- Auth: localStorage-based signup/login; currentUser stored as StoredUser
- Home feed: PostCard with like/save/comment toggle; comment modal incomplete (no add-comment input)
- ReelsPage: snap-scroll vertical reel cards with like/save/share buttons (non-functional comment & share overlays)
- Stories: StoryViewer with gradient backgrounds, emoji reactions, music field exists but only text input (no real music in story)
- Notes: NotesPanel with MusicSearchPicker using iTunes API; music play has CORS issue (audio-ssl.itunes.apple.com blocked)
- Profile: ProfilePage always shows MOCK_USERS[0] as own profile regardless of who is logged in
- Sidebar / home profile summary: hardcoded to MOCK_USERS[0]
- Post sharing: share button just shows toast "Link copied"
- Post saving: works but no dedicated saved-posts view anywhere

## Requested Changes (Diff)

### Add
1. **Working comment system** on posts: full comments drawer/modal with ability to type and submit new comments; comments list shows all comments with like-per-comment button; comment count updates live
2. **Working comment system on reels**: tap comment icon on reel opens bottom drawer with same comment UI
3. **Share modal for posts and reels**: tapping Share opens a modal with "Copy link", "Share to message" (picks a conversation), and "Share to story" options
4. **Save confirmation + Saved Posts section** on ProfilePage: saved tab shows all saved posts in a grid
5. **Story with working music**: CreateStoryModal replaces text music input with MusicSearchPicker; story stores full MusicTrack object; StoryViewer shows the music bar and actually plays preview audio when story is open
6. **Story detail enrichment**: StoryViewer shows music mini-player when story has musicTrack; music auto-plays and stops when story advances
7. **Own account in profile/home sidebar**: ProfilePage "isOwnProfile" logic uses currentUser.username from AuthContext (not hardcoded MOCK_USERS[0]); home sidebar also uses currentUser
8. **Note music playback fix**: replace direct apple CDN previewUrl with a CORS proxy or use an HTML5 `<audio>` element with `crossOrigin="anonymous"`; also suppress play errors gracefully. Actually: the iTunes preview URLs are HTTPS and should work with fetch/XHR but may block autoplay; ensure audio.play() is triggered by user click event and handle the promise properly
9. **Post share detail**: Share modal lets you search/select a conversation from MOCK_CONVERSATIONS to "send" the post (shows toast confirmation), and copy link option
10. **Reels functional interactions**: like count updates, save toggles, comment drawer opens, share modal opens

### Modify
1. **AppContext**: add `addComment(postId, text)` method; add `savedPosts` computed list
2. **PostCard**: wire comment input at bottom of comments expansion; add "Add a comment..." input that submits on Enter or button click
3. **ReelsPage**: wire up comment button to open a CommentDrawer; wire share button to open ShareModal; ensure like/save state properly updates
4. **ProfilePage**: replace `isOwnProfile` check with `currentUser?.username === username || username === "me"`; use `currentUser` for avatar/name in own-profile header; add "Saved" tab (bookmark icon) showing saved posts
5. **HomePage sidebar**: replace hardcoded `MOCK_USERS[0]` with `currentUser` from AuthContext for the profile summary card
6. **CreateStoryModal**: replace plain text music input with `<MusicSearchPicker>` component; store selected MusicTrack in story (add `musicTrack?: MusicTrack` to MockStory type)
7. **StoryViewer**: if `currentStory.musicTrack` exists, show a mini music bar at top (below progress bars) and auto-play the preview; pause audio on story advance/close
8. **MusicSearchPicker**: improve play error handling; ensure audio element is created inside a click handler

### Remove
- Nothing removed

## Implementation Plan
1. Update `types/index.ts`: add `musicTrack?: MusicTrack` to `MockStory`; no other type changes needed
2. Update `AppContext.tsx`: add `addComment(postId: string, text: string)` and expose `savedPosts` (posts where isSaved)
3. Create `components/feed/CommentDrawer.tsx`: reusable comment list + input sheet (works for both posts and reels)
4. Create `components/feed/ShareModal.tsx`: share options modal (copy link, send to conversation)  
5. Update `PostCard.tsx`: wire comment input inline (expand comment section with add-comment input); wire share button to ShareModal
6. Update `ReelsPage.tsx`: wire comment button to CommentDrawer; wire share button to ShareModal; fix like/save state
7. Update `ProfilePage.tsx`: use AuthContext currentUser for own profile detection; add Saved tab
8. Update `HomePage.tsx` sidebar: use currentUser from AuthContext
9. Update `CreateStoryModal.tsx`: replace music text field with MusicSearchPicker
10. Update `StoryViewer.tsx`: add audio playback for story musicTrack; auto-play/stop on advance
11. Update `NotesPanel.tsx`/`MusicSearchPicker.tsx`: improve audio error handling for CORS/autoplay
