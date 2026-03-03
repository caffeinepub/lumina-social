# Lumina Social

## Current State
- Full Instagram-like social app built in React + Tailwind + TypeScript
- ICP Motoko backend exists with: UserProfile, Post, Notification types, and full CRUD
- Internet Identity provider is mounted in main.tsx
- useInternetIdentity, useActor, useBackend hooks are all wired
- AuthContext is 100% localStorage-only — no ICP backend calls for auth
- Social login buttons (Google, Apple, ICP) were just removed from LoginPage
- AppContext stores posts, notifications, messages all in React state (mock data) or localStorage
- Chat messages persist to localStorage

## Requested Changes (Diff)

### Add
- Internet Identity (II) as the real persistent login method on LoginPage and SignupPage
- On signup: after II login succeeds, call `saveCallerUserProfile` to store profile in the Motoko canister
- On every app load: if II identity exists, call `getCallerUserProfile` to rehydrate user from the canister
- "Sign in with Internet Identity" button on LoginPage (replaces Google/Apple/ICP row)
- "Create account with Internet Identity" button on SignupPage
- Loading state while profile is being fetched from canister after II auth
- Fallback: if user has II identity but no canister profile yet, redirect to a profile setup step

### Modify
- AuthContext: add `iiLogin()`, `iiSignup(profileData)` functions that use the II flow + canister calls
- AuthContext: `currentUser` is now sourced from the canister profile (with localStorage as a cache/fallback for display name, avatarUrl fields not stored on canister)
- AuthContext: `isAuthenticated` = user has II identity AND a saved canister profile
- AuthContext: `logout()` calls II clear() to revoke the delegation
- LoginPage: replace social grid with a single "Sign in with Internet Identity" glass button
- SignupPage: add "Continue with Internet Identity" button that triggers II login then shows profile fields pre-filled for username/bio/displayName before saving to canister
- AppShell: show loading spinner while auth is initializing from canister
- EditProfilePage: when saving, also call `saveCallerUserProfile` to persist to canister

### Remove
- Google sign-in button (already removed)
- Apple sign-in button (already removed)
- ICP-labeled button (already removed from login page, replace with proper labeled II flow)
- Email/password login as the primary flow (keep as secondary fallback with localStorage for demo users)

## Implementation Plan
1. Update AuthContext to integrate useInternetIdentity and useActor:
   - On II identity available: call getCallerUserProfile from actor
   - Expose iiLogin(), iiLogout() that wrap II login/clear
   - currentUser merges canister UserProfile with localStorage extras (avatarUrl, etc.)
   - isAuthenticated requires both II identity and canister profile
2. Update LoginPage: add a prominent "Sign in with Internet Identity" GlassButton (full width, gradient, glow)
3. Update SignupPage: add "Continue with Internet Identity" button; when clicked, trigger II login, then show profile form pre-filled, on submit call saveCallerUserProfile
4. Update AppShell: show a centered loading state when isInitializing
5. Update EditProfilePage: on save, call saveCallerUserProfile mutation in addition to local updateUser
6. Keep email/password flow intact as localStorage demo fallback so existing mock accounts still work
