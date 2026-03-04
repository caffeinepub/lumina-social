// User Registry — manages all registered users in localStorage
// Keys: lumina_all_users, lumina_follows_${username}, lumina_blocks_${username}, lumina_mutes_${username}

export interface RegisteredUser {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  websiteUrl: string;
  isPrivate: boolean;
  createdAt: string; // ISO date
}

const USERS_KEY = "lumina_all_users";

function getAllUsersRecord(): Record<string, RegisteredUser> {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored) as Record<string, RegisteredUser>;
  } catch {
    // ignore
  }
  return {};
}

export function getAllUsers(): RegisteredUser[] {
  const record = getAllUsersRecord();
  return Object.values(record);
}

export function getUser(username: string): RegisteredUser | null {
  const record = getAllUsersRecord();
  return record[username] ?? null;
}

export function registerUser(user: RegisteredUser): void {
  const record = getAllUsersRecord();
  record[user.username] = user;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(record));
  } catch {
    // ignore
  }
}

export function updateUser(
  username: string,
  updates: Partial<RegisteredUser>,
): void {
  const record = getAllUsersRecord();
  if (record[username]) {
    record[username] = { ...record[username], ...updates };
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(record));
    } catch {
      // ignore
    }
  }
}

// ── Follow / Unfollow ──────────────────────────────────────────────────────

function followsKey(username: string): string {
  return `lumina_follows_${username}`;
}

export function getFollowing(myUsername: string): string[] {
  try {
    const stored = localStorage.getItem(followsKey(myUsername));
    if (stored) return JSON.parse(stored) as string[];
  } catch {
    // ignore
  }
  return [];
}

export function followUser(myUsername: string, targetUsername: string): void {
  const list = getFollowing(myUsername);
  if (!list.includes(targetUsername)) {
    list.push(targetUsername);
    try {
      localStorage.setItem(followsKey(myUsername), JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export function unfollowUser(myUsername: string, targetUsername: string): void {
  const list = getFollowing(myUsername).filter((u) => u !== targetUsername);
  try {
    localStorage.setItem(followsKey(myUsername), JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function isFollowing(
  myUsername: string,
  targetUsername: string,
): boolean {
  return getFollowing(myUsername).includes(targetUsername);
}

// ── Block / Unblock ────────────────────────────────────────────────────────

function blocksKey(username: string): string {
  return `lumina_blocks_${username}`;
}

export function getBlockedUsers(myUsername: string): string[] {
  try {
    const stored = localStorage.getItem(blocksKey(myUsername));
    if (stored) return JSON.parse(stored) as string[];
  } catch {
    // ignore
  }
  return [];
}

export function blockUser(myUsername: string, targetUsername: string): void {
  const list = getBlockedUsers(myUsername);
  if (!list.includes(targetUsername)) {
    list.push(targetUsername);
    try {
      localStorage.setItem(blocksKey(myUsername), JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export function unblockUser(myUsername: string, targetUsername: string): void {
  const list = getBlockedUsers(myUsername).filter((u) => u !== targetUsername);
  try {
    localStorage.setItem(blocksKey(myUsername), JSON.stringify(list));
  } catch {
    // ignore
  }
}

// ── Mute / Unmute ─────────────────────────────────────────────────────────

function mutesKey(username: string): string {
  return `lumina_mutes_${username}`;
}

export function getMutedUsers(myUsername: string): string[] {
  try {
    const stored = localStorage.getItem(mutesKey(myUsername));
    if (stored) return JSON.parse(stored) as string[];
  } catch {
    // ignore
  }
  return [];
}

export function muteUser(myUsername: string, targetUsername: string): void {
  const list = getMutedUsers(myUsername);
  if (!list.includes(targetUsername)) {
    list.push(targetUsername);
    try {
      localStorage.setItem(mutesKey(myUsername), JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export function unmuteUser(myUsername: string, targetUsername: string): void {
  const list = getMutedUsers(myUsername).filter((u) => u !== targetUsername);
  try {
    localStorage.setItem(mutesKey(myUsername), JSON.stringify(list));
  } catch {
    // ignore
  }
}
