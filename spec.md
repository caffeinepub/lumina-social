# Lumina Social

## Current State
- Full Instagram-like social media app with glassmorphism UI
- Pages: Home Feed, Reels, Explore, Messages (with NotesPanel), Notifications, Profile, Settings, Admin, Login, Signup
- Mock data uses DiceBear SVG avatars (abstract/cartoon) and CSS gradient rectangles for post/reel images
- Notes panel has a layout bug: `mt-12` pushes note bubbles up into a fixed offset that clips or overlaps when the panel is small
- Notes music field is a plain text input with no actual playback
- Auth is fully fake (no persistence, any credentials work)
- Login/Signup pages have "Google" and "Apple" buttons that show a toast saying "coming soon"
- Reels page uses CSS gradient backgrounds, no real video thumbnails
- Post images are CSS gradients, no real photos

## Requested Changes (Diff)

### Add
- **Real photo avatars**: Replace all DiceBear SVG avatars with stable `i.pravatar.cc` photo URLs (consistent per user via seed ID) so every user has a real face photo
- **Real post images**: Replace CSS gradient `imageUrl` strings in MOCK_POSTS with `picsum.photos` stable image URLs (e.g. `https://picsum.photos/seed/post1/600/600`) so the feed shows real photos
- **Real reel thumbnails**: Replace CSS gradient `gradient` field in MOCK_REELS with `picsum.photos` vertical image URLs (e.g. `https://picsum.photos/seed/reel1/420/748`) for realistic reel previews
- **Music player in Notes**: Replace the plain text "Add music track" input with a full inline music search UI:
  - Search field that queries iTunes Search API (`https://itunes.apple.com/search?term=...&media=music&limit=8&callback=`)
  - Results list showing track artwork, title, artist
  - Tap to select a track; selected track shows artwork + name
  - Play/pause button that plays the 30-second `previewUrl` from iTunes API using HTML5 `<audio>`
  - Music player bar shows in NoteDetail if the note has a musicTrack (stored as JSON: `{id, title, artist, artworkUrl, previewUrl}`)
- **Music player in CreatePostModal**: Same music search + preview UI for adding music to posts
- **Persistent auth with localStorage**: Login/Signup create a real session stored in `localStorage`:
  - Signup: save `{username, email, displayName, bio, avatarUrl}` under `lumina_user` key; redirect to home
  - Login: validate against stored `lumina_user`; if not found, show error "No account found, please sign up"
  - Auth state reads from localStorage on mount so session persists across page reloads
  - Add "Continue with Internet Identity" button (ICP's decentralized login) that calls `useInternetIdentity` hook already present in the codebase
- **Notes panel fix**: Rework the notes row layout so speech bubbles render correctly without fixed `mt-12` hacks; use a flex column per note item with consistent spacing; add `overflow-x-auto` scroll on the row; ensure the "Your note" bubble preview doesn't overflow the container
- **Reels linked from Feed**: Each post's media area and a "Watch Reel" chip (if the post has a reel) links to `/reels` page; the Reels nav item in the sidebar already links to `/reels`

### Modify
- `mockData.ts`: Update all `avatarUrl` fields to use `https://i.pravatar.cc/150?img=N` (N = 1–70) with consistent mapping per user; update all `imageUrl` in MOCK_POSTS to use `https://picsum.photos/seed/postN/600/600`; update `gradient` in MOCK_REELS to use `https://picsum.photos/seed/reelN/420/748`
- `NotesPanel.tsx`: Fix layout, add music player integration; store selected music as structured object instead of plain string
- `CreateNoteModal` inside NotesPanel: music field becomes MusicSearchPicker component
- `LoginPage.tsx` / `SignupPage.tsx`: Wire to localStorage auth; add Internet Identity button
- `AuthContext`: Read/write from localStorage; expose `currentUser` profile; fix so login state persists on reload
- `MockNote.musicTrack` type: change from `string | undefined` to `MusicTrack | undefined` where `MusicTrack = {id: string; title: string; artist: string; artworkUrl: string; previewUrl: string}`
- `types/index.ts`: Add `MusicTrack` interface

### Remove
- All `mt-12` hack in NotesPanel notes row
- DiceBear base URL constant and references in mockData
- CSS gradient strings used as `imageUrl` for posts (replaced by picsum URLs)

## Implementation Plan
1. Update `types/index.ts` — add `MusicTrack` interface; update `MockNote.musicTrack` to `MusicTrack | undefined`
2. Update `mockData.ts` — replace all avatarUrl with pravatar.cc photo URLs, post imageUrls with picsum URLs, reel gradient with picsum URLs, update note musicTrack fields to MusicTrack objects
3. Create `src/components/music/MusicSearchPicker.tsx` — iTunes JSONP/fetch search, results list, select + play preview
4. Fix `NotesPanel.tsx` — rework layout, integrate MusicSearchPicker, update NoteDetail to show music player bar with play/pause
5. Update `CreatePostModal.tsx` — add MusicSearchPicker for post music
6. Update `AuthContext.tsx` — localStorage persistence, expose currentUser
7. Update `LoginPage.tsx` — real validation against localStorage, Internet Identity button
8. Update `SignupPage.tsx` — save to localStorage, redirect to home
9. Validate build (typecheck + lint)
