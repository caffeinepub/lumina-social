# Lumina Social

## Current State
Full-stack social media app (React frontend + ICP Motoko backend). Data currently stored in localStorage per-device. Three fake accounts exist (chocolatecakekhanahai, areymhuapkix, shivislowkeycrazy) with mock conversations, stories, posts, notes. Notes popup exists but lacks proper frosted glass on web. Appearance settings (dark/light theme, accent colors) exist in ThemeContext but light mode CSS is not applied. Language settings only have English/Spanish/French/Japanese/Korean. Login Activity in Security is a stub. Fake view counts and fake comments exist on stories and posts. Profile page post click doesn't open a working comment/like modal. Mobile chat layout is broken. Story upload is not fullscreen on mobile. User search only searches localStorage registry. Story replies don't send. Emoji picker in share modal doesn't work.

## Requested Changes (Diff)

### Add
- Hindi ("हिन्दी") as a selectable language option in Settings > Language
- Real login activity tracking: store login events (timestamp, device/browser info) in localStorage when user signs in; display them in Settings > Security > Login Activity as a list with device name, browser, date/time
- "Who viewed my story" panel — tapping the eye/views count on a story shows a list of viewers (track real view events per story, store in localStorage)
- ICP Motoko backend wiring for posts, reels, stories, notes so data syncs across devices (not just localStorage)

### Modify
- **Note popup (web)**: the popup card itself gets `backdrop-blur-2xl`, `bg-white/10` frosted glass styling matching Screenshot 1 — music info at top, note text large in center, avatar + username below, "Leave a new note" + "Delete note" buttons
- **Remove three fake accounts**: purge CHOCO_USER, AREY_USER, SHIV_USER from mockData.ts; remove CHOCO_STORY, AREY_STORY, SHIV_STORY; remove MOCK_CONVERSATIONS seeded with those accounts; remove DEFAULT_STORIES referencing them; AppContext must not seed those accounts
- **Remove fake view counts and fake comments**: posts show real like/comment counts only (no hardcoded "100 views", no fake aurora.lens/neon.nomad/velvet.sky comments); stories show real viewer count only
- **Profile page post click**: clicking a post in the profile grid opens a full post detail modal with working like button, comment section (real comments from AppContext), and edit/delete options for own posts
- **Mobile chat**: fix layout so message list scrolls correctly and input bar is always pinned at bottom on mobile; match WhatsApp Image 2026-03-04 reference (clean bubbles, visible timestamps, correct padding)
- **Mobile story upload**: story creator should be full-screen on mobile (100dvh, no overflow clipping)
- **Appearance settings**: dark/light mode toggle must actually apply — when light mode is selected, CSS variables for background, surface, and text must switch; when accent color is changed, it must visually update immediately across the app
- **User search**: Explore search must find all registered users from userRegistry (getAllUsers), not just mock users; results show real avatars/usernames/follow buttons
- **Story replies**: tapping send on story reply input must call sendMessage() to create/update a conversation with that user and send the reply as a message
- **Emoji picker in share**: the emoji button inside CreatePostModal / share flow must open an emoji picker that inserts emoji into the caption/message input

### Remove
- All fake seeded accounts (chocolatecakekhanahai, areymhuapkix, shivislowkeycrazy) from mockData.ts and all references
- All hardcoded fake view counts on posts ("100 views", "513 views")
- All hardcoded fake comments (aurora.lens, neon.nomad, velvet.sky) on stories
- MOCK_CONVERSATIONS seeded with fake accounts (conversations list starts empty for new users)
- DEFAULT_STORIES array usage (stories list starts empty, only shows stories user creates)

## Implementation Plan

1. **mockData.ts** — remove CHOCO_USER, AREY_USER, SHIV_USER, their stories, mock conversations seeded with them, CHOCO_NOTE, AREY_NOTE, SHIV_NOTE. Keep STORY_GRADIENTS. Export empty arrays for MOCK_CONVERSATIONS and MOCK_MESSAGES_BY_CONV.

2. **AppContext.tsx** — remove DEFAULT_STORIES reference, seed stories/conversations/messages as empty arrays. Remove fake note seeding. Remove filtering logic that kept fake account stories.

3. **Note popup component** — redesign the note detail popup to have `backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl` frosted glass card. Layout: music bar at top (spinning disc, song name, artist), large note text centered, circular avatar + username, expiry timer, two action buttons.

4. **Login activity tracking** — on every successful login/signup in AuthContext or LoginPage/SignupPage, append a login event `{timestamp, browser: navigator.userAgent, device: screen info}` to `lumina_login_activity` in localStorage. In SettingsPage > Security, expand "Login Activity" row to show a scrollable list of past events.

5. **Story viewers tracking** — when a story is viewed (StoryViewer opens a story), record the current user's username + timestamp in `lumina_story_views_{storyId}`. Add a viewers list button (eye icon + count) on the story viewer that opens a slide-up panel with viewer avatars.

6. **Remove fake view/comment counts** — remove all hardcoded `views` fields and `fakeComments` arrays from story viewer and post components. Posts show only real likes/comments from AppContext state.

7. **Profile page post modal** — the post grid click in ProfilePage opens a PostDetailModal with real like toggle, real comment list from AppContext, add comment input, and edit/delete for own posts.

8. **Mobile chat layout** — MessagesPage chat view: use `h-[100dvh] flex flex-col` for the chat container, messages list uses `flex-1 overflow-y-auto`, input bar uses `flex-shrink-0`. Ensure correct safe-area padding on iOS.

9. **Mobile story upload** — StoryCreator modal: on mobile (`< 768px`) use `fixed inset-0 z-50` fullscreen layout, remove max-w constraints.

10. **Appearance settings (dark/light)** — ThemeContext `setIsDark` must toggle `class="dark"` on `document.documentElement`. Tailwind dark: classes must work. index.css must define light-mode variables (lighter backgrounds, dark text).

11. **Hindi language** — add `<SelectItem value="hi">हिन्दी</SelectItem>` to language selector in SettingsPage.

12. **User search fix** — ExplorePage search must call `getAllUsers()` and filter by username/displayName. Results render user cards with follow buttons.

13. **Story reply fix** — StoryViewer reply input: on send, find or create conversation with the story author via AppContext `addConversation`/`sendMessage`, then close the reply input.

14. **Emoji in share** — CreatePostModal and any share input: emoji button opens an emoji popover that inserts the selected emoji at cursor position in the textarea.

15. **ICP backend wiring** — use existing Motoko backend `saveCallerUserProfile` / `getCallerUserProfile` for user persistence. Wire posts/reels via canister calls on add/load so data syncs cross-device. Use localStorage as cache with canister as source of truth.
