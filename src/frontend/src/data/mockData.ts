import type {
  MockComment,
  MockConversation,
  MockHighlight,
  MockMessage,
  MockNote,
  MockNotification,
  MockPost,
  MockReel,
  MockStory,
  MockUser,
} from "@/types";

export const CHOCO_USER: MockUser = {
  id: "choco",
  username: "chocolatecakekhanahai",
  displayName: "chocolatecakekhanahai",
  bio: "Existing is really overrated.",
  avatarUrl: "/assets/uploads/2-1.jpg",
  websiteUrl: "",
  isPrivate: false,
  followersCount: 3812,
  followingCount: 214,
  postsCount: 97,
  isFollowing: true,
  isVerified: false,
};

export const AREY_USER: MockUser = {
  id: "arey",
  username: "areymhuapkix",
  displayName: "Abe teri fav hu 🤤",
  bio: '👉🏻👈🏻\nsahi kehta tha "u deserve better"\n',
  avatarUrl: "/assets/uploads/frutu-1.jpg",
  websiteUrl: "",
  isPrivate: false,
  followersCount: 1247,
  followingCount: 389,
  postsCount: 58,
  isFollowing: true,
  isVerified: false,
};

export const MOCK_USERS: MockUser[] = [
  CHOCO_USER,
  AREY_USER,
  {
    id: "1",
    username: "aurora.lens",
    displayName: "Aurora Chen",
    bio: "Chasing light, capturing moments ✨ Tokyo based photographer",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    websiteUrl: "aurora.photography",
    isPrivate: false,
    followersCount: 48200,
    followingCount: 312,
    postsCount: 847,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "2",
    username: "neon.nomad",
    displayName: "Marcus Webb",
    bio: "Digital wanderer 🌐 Building worlds, one pixel at a time",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    websiteUrl: "neon-nomad.io",
    isPrivate: false,
    followersCount: 23100,
    followingCount: 580,
    postsCount: 423,
    isFollowing: true,
    isVerified: false,
  },
  {
    id: "3",
    username: "velvet.sky",
    displayName: "Sofia Reyes",
    bio: "Fashion & Art Director | Madrid → Paris 🌸",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    websiteUrl: "velvetsky.studio",
    isPrivate: false,
    followersCount: 91500,
    followingCount: 210,
    postsCount: 1203,
    isFollowing: true,
    isVerified: true,
  },
  {
    id: "4",
    username: "echo.frames",
    displayName: "Aiden Park",
    bio: "Filmmaker | Storyteller 🎬 Seoul native, world traveler",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    websiteUrl: "echoframes.co",
    isPrivate: false,
    followersCount: 15800,
    followingCount: 923,
    postsCount: 289,
    isFollowing: false,
    isVerified: false,
  },
  {
    id: "5",
    username: "luna.abstract",
    displayName: "Luna Nakamura",
    bio: "Digital artist & 3D sculptor 🎨 NFT creator",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
    websiteUrl: "luna-art.xyz",
    isPrivate: false,
    followersCount: 67300,
    followingCount: 445,
    postsCount: 512,
    isFollowing: true,
    isVerified: true,
  },
  {
    id: "6",
    username: "prism.collective",
    displayName: "Prism Creative",
    bio: "Design collective pushing boundaries 🔺 Open to collabs",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    websiteUrl: "prism.design",
    isPrivate: false,
    followersCount: 34500,
    followingCount: 189,
    postsCount: 678,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: "7",
    username: "drift.code",
    displayName: "Kai Sorensen",
    bio: "Backend engineer by day, synth composer by night 🎵",
    avatarUrl: "https://i.pravatar.cc/150?img=14",
    websiteUrl: "drift.dev",
    isPrivate: false,
    followersCount: 8900,
    followingCount: 712,
    postsCount: 156,
    isFollowing: true,
    isVerified: false,
  },
  {
    id: "8",
    username: "zenith.flora",
    displayName: "Mia Laurent",
    bio: "Botanist & minimalist photographer 🌿 Plants over people",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    websiteUrl: "zenithflora.co",
    isPrivate: true,
    followersCount: 12400,
    followingCount: 340,
    postsCount: 334,
    isFollowing: false,
    isVerified: false,
  },
];

const MOCK_COMMENTS: MockComment[] = [
  {
    id: "c1",
    author: MOCK_USERS[1],
    text: "This is absolutely stunning! 🔥",
    timestamp: new Date(Date.now() - 1800000),
    likes: 24,
    isLiked: false,
  },
  {
    id: "c2",
    author: MOCK_USERS[2],
    text: "The lighting here is perfection ✨",
    timestamp: new Date(Date.now() - 3600000),
    likes: 12,
    isLiked: true,
  },
  {
    id: "c3",
    author: MOCK_USERS[4],
    text: "Incredible composition 🎨",
    timestamp: new Date(Date.now() - 7200000),
    likes: 8,
    isLiked: false,
  },
];

export const MOCK_POSTS: MockPost[] = [
  {
    id: "p1",
    author: MOCK_USERS[1], // aurora.lens
    imageUrl: "https://picsum.photos/seed/lumina_p1/600/600",
    caption:
      "Golden hour in Shinjuku 🌆 The city never stops breathing. Caught this moment between two worlds — neon signs waking up as sunlight dies.",
    likes: 4821,
    comments: MOCK_COMMENTS,
    timestamp: new Date(Date.now() - 3600000),
    isLiked: false,
    isSaved: true,
    location: "Shinjuku, Tokyo",
    hasStory: true,
    tags: ["#tokyo", "#goldenhour", "#streetphotography"],
    isPublic: true,
  },
  {
    id: "p2",
    author: MOCK_USERS[3], // velvet.sky - fashion
    imageUrl: "https://picsum.photos/seed/lumina_p2/600/600",
    caption:
      "New collection drop 🌸 Fashion is the armor to survive everyday life. This piece took 3 weeks to conceptualize.",
    likes: 9234,
    comments: MOCK_COMMENTS.slice(0, 2),
    timestamp: new Date(Date.now() - 7200000),
    isLiked: true,
    isSaved: false,
    location: "Paris, France",
    hasStory: false,
    tags: ["#fashion", "#couture", "#artdirection"],
    isPublic: true,
  },
  {
    id: "p3",
    author: MOCK_USERS[5], // luna.abstract - 3D digital artist
    imageUrl: "https://picsum.photos/seed/lumina_p3/600/600",
    caption:
      "3D sculpture series: Fragments of Time 🎨 Each piece represents a memory dissolving into abstraction.",
    likes: 6782,
    comments: MOCK_COMMENTS.slice(1, 3),
    timestamp: new Date(Date.now() - 14400000),
    isLiked: false,
    isSaved: false,
    hasStory: true,
    tags: ["#3dart", "#digitalart", "#nft"],
    isPublic: true,
  },
  {
    id: "p4",
    author: MOCK_USERS[2], // neon.nomad - code/digital
    imageUrl: "https://picsum.photos/seed/lumina_p4/600/600",
    caption:
      "When code becomes art 💻✨ Built a generative algorithm that translates sound waves into visual geometry. Mesmerizing to watch.",
    likes: 2341,
    comments: MOCK_COMMENTS.slice(0, 1),
    timestamp: new Date(Date.now() - 21600000),
    isLiked: true,
    isSaved: true,
    hasStory: false,
    tags: ["#generativeart", "#codeart", "#creative"],
    isPublic: true,
  },
  {
    id: "p5",
    author: MOCK_USERS[6], // prism.collective - design
    imageUrl: "https://picsum.photos/seed/lumina_p5/600/600",
    caption:
      "Identities in flux ◈ New visual identity project for a fintech startup. Geometric precision meets organic flow.",
    likes: 3456,
    comments: MOCK_COMMENTS,
    timestamp: new Date(Date.now() - 28800000),
    isLiked: false,
    isSaved: false,
    location: "Berlin, Germany",
    hasStory: false,
    tags: ["#branding", "#design", "#identity"],
    isPublic: true,
  },
  {
    id: "p6",
    author: MOCK_USERS[4], // echo.frames - filmmaker
    imageUrl: "https://picsum.photos/seed/lumina_p6/600/600",
    caption:
      "Behind the lens of our latest short film 🎬 Practical effects using colored gels and fog machines. No CGI, pure in-camera magic.",
    likes: 1876,
    comments: MOCK_COMMENTS.slice(0, 2),
    timestamp: new Date(Date.now() - 43200000),
    isLiked: false,
    isSaved: false,
    location: "Seoul Film Studio",
    hasStory: true,
    tags: ["#filmmaking", "#bts", "#cinematography"],
    isPublic: true,
  },
  {
    id: "p7",
    author: MOCK_USERS[7], // drift.code - synth/coding
    imageUrl: "https://picsum.photos/seed/lumina_p7/600/600",
    caption:
      "Late night coding sessions hit different with the right playlist 🎵 Sharing my Synthwave focus mix on my profile.",
    likes: 892,
    comments: MOCK_COMMENTS.slice(2, 3),
    timestamp: new Date(Date.now() - 86400000),
    isLiked: true,
    isSaved: false,
    hasStory: false,
    tags: ["#coding", "#synthwave", "#developer"],
    isPublic: true,
  },
  {
    id: "p8",
    author: MOCK_USERS[8], // zenith.flora - plants
    imageUrl: "https://picsum.photos/seed/lumina_p8/600/600",
    caption:
      "Monstera deliciosa under diffused studio light 🌿 Plant photography is an exercise in patience and stillness.",
    likes: 2108,
    comments: MOCK_COMMENTS.slice(1, 3),
    timestamp: new Date(Date.now() - 172800000),
    isLiked: false,
    isSaved: true,
    hasStory: false,
    tags: ["#plantphotography", "#botanical", "#minimalism"],
    isPublic: true,
  },
];

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

export const CHOCO_STORY: MockStory = {
  id: "story_choco",
  author: CHOCO_USER,
  imageGradient: "linear-gradient(135deg, #1a1a2e, #16213e)",
  text: "existing is really overrated.",
  timestamp: new Date(Date.now() - 1 * 3600000),
  isViewed: false,
  duration: 5000,
};

export const AREY_STORY: MockStory = {
  id: "story_arey",
  author: AREY_USER,
  imageGradient: "linear-gradient(135deg, #7c3aed, #db2777)",
  text: "👉🏻👈🏻 u deserve better fr",
  timestamp: new Date(Date.now() - 2 * 3600000),
  isViewed: false,
  duration: 5000,
};

export const MOCK_STORIES: MockStory[] = [
  CHOCO_STORY,
  AREY_STORY,
  ...MOCK_USERS.slice(2).map((user, i) => ({
    id: `story_${user.id}`,
    author: user,
    imageGradient: STORY_GRADIENTS[i % STORY_GRADIENTS.length],
    text: [
      "Golden hour vibes ✨",
      "New work dropping soon 🔥",
      "Studio day 🎨",
      "Tokyo nights 🌙",
      undefined,
      "BTS reel coming 🎬",
      undefined,
      "Morning light 🌿",
    ][i],
    timestamp: new Date(Date.now() - (i * 2 + 1) * 3600000),
    isViewed: i > 3,
    duration: 5000,
  })),
];

export const MOCK_REELS: MockReel[] = [
  {
    id: "r1",
    author: MOCK_USERS[1], // aurora.lens
    caption: "Tokyo night street in slow motion 🌆 The city breathes",
    audioTrack: "Midnight City — M83",
    likes: 24891,
    comments: 483,
    shares: 1240,
    isLiked: false,
    isSaved: false,
    thumbnailUrl: "https://picsum.photos/seed/lumina_r1/420/748",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "0:28",
    views: 148200,
  },
  {
    id: "r2",
    author: MOCK_USERS[3], // velvet.sky - fashion
    caption: "Fashion week backstage chaos in 30 seconds 🌸✨",
    audioTrack: "Bejeweled — Taylor Swift",
    likes: 89234,
    comments: 2341,
    shares: 8900,
    isLiked: true,
    isSaved: false,
    thumbnailUrl: "https://picsum.photos/seed/lumina_r2/420/748",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "0:30",
    views: 892000,
  },
  {
    id: "r3",
    author: MOCK_USERS[5], // luna.abstract - 3D artist
    caption: "3D sculpting timelapse: 72 hours in 30 seconds 🎨",
    audioTrack: "Flume — Holdin On",
    likes: 31456,
    comments: 876,
    shares: 2300,
    isLiked: false,
    isSaved: true,
    thumbnailUrl: "https://picsum.photos/seed/lumina_r3/420/748",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "0:30",
    views: 234500,
  },
  {
    id: "r4",
    author: MOCK_USERS[4], // echo.frames - filmmaker
    caption: "Practical effects magic — no CGI, pure film 🎬",
    audioTrack: "Hans Zimmer — Time",
    likes: 15678,
    comments: 412,
    shares: 890,
    isLiked: false,
    isSaved: false,
    thumbnailUrl: "https://picsum.photos/seed/lumina_r4/420/748",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    duration: "0:45",
    views: 98400,
  },
  {
    id: "r5",
    author: MOCK_USERS[6], // prism.collective - design
    caption: "Brand identity design process — from concept to final 🔺",
    audioTrack: "Lo-fi Study Beats",
    likes: 8923,
    comments: 234,
    shares: 456,
    isLiked: true,
    isSaved: false,
    thumbnailUrl: "https://picsum.photos/seed/lumina_r5/420/748",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    duration: "0:60",
    views: 67300,
  },
];

const mockMsg = (
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

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv_choco",
    participants: [CHOCO_USER],
    lastMessage: mockMsg(
      "mc_last",
      CHOCO_USER.id,
      "okay but why does sleep feel like a personal attack on my vibe",
      2,
      false,
    ),
    unreadCount: 3,
    isGroup: false,
    isPinned: true,
    isMuted: false,
  },
  {
    id: "conv_arey",
    participants: [AREY_USER],
    lastMessage: mockMsg(
      "ma_last",
      AREY_USER.id,
      "abe sun mujhe, tu actually deserve karta hai sab kuch achha 🫶🏻",
      8,
      false,
    ),
    unreadCount: 2,
    isGroup: false,
    isPinned: true,
    isMuted: false,
  },
  {
    id: "conv1",
    // aurora.lens [1] + velvet.sky [3]
    participants: [MOCK_USERS[1], MOCK_USERS[3]],
    lastMessage: mockMsg("m1", MOCK_USERS[3].id, "Love the new shoot! 🔥", 5),
    unreadCount: 2,
    isGroup: false,
    isMuted: false,
  },
  {
    id: "conv2",
    // luna.abstract [5] + neon.nomad [2]
    participants: [MOCK_USERS[5], MOCK_USERS[2]],
    lastMessage: mockMsg(
      "m2",
      MOCK_USERS[2].id,
      "Let's collaborate on that piece",
      32,
    ),
    unreadCount: 0,
    isGroup: false,
    isMuted: false,
  },
  {
    id: "conv3",
    // aurora [1] + neon.nomad [2] + prism [6]
    participants: [MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[6]],
    lastMessage: mockMsg(
      "m3",
      MOCK_USERS[6].id,
      "Brief is ready, check it out!",
      120,
    ),
    unreadCount: 1,
    isGroup: true,
    groupName: "Design Collective",
    isMuted: false,
  },
  {
    id: "conv4",
    // echo.frames [4] + drift.code [7]
    participants: [MOCK_USERS[4], MOCK_USERS[7]],
    lastMessage: mockMsg(
      "m4",
      MOCK_USERS[4].id,
      "The soundtrack fits perfectly 🎵",
      360,
    ),
    unreadCount: 0,
    isGroup: false,
    isMuted: true,
  },
  {
    id: "conv5",
    // zenith.flora [8] + velvet.sky [3]
    participants: [MOCK_USERS[8], MOCK_USERS[3]],
    lastMessage: mockMsg(
      "m5",
      MOCK_USERS[8].id,
      "Those plants are incredible!",
      720,
    ),
    unreadCount: 0,
    isGroup: false,
    isMuted: false,
  },
];

export const MOCK_MESSAGES_BY_CONV: Record<string, MockMessage[]> = {
  conv_arey: [
    mockMsg("ma1", "me", "yaar aaj kuch acha nahi lag raha", 1500),
    mockMsg("ma2", AREY_USER.id, "kya hua bata mujhe", 1498),
    mockMsg("ma3", "me", "bas aise hi.. sab overwhelm ho raha hai", 1495),
    mockMsg("ma4", AREY_USER.id, "abe ruk, deep breath le pehle", 1493),
    mockMsg("ma5", AREY_USER.id, "tu bata kya chal raha hai life mein", 1492),
    mockMsg("ma6", "me", "sab log bolte hai tu deserve karta hai better", 1490),
    mockMsg("ma7", "me", "par pata nahi kyun lagta hai I'm the problem", 1488),
    mockMsg("ma8", AREY_USER.id, "ARE PAGAL HAI TU?!", 1485),
    mockMsg("ma9", AREY_USER.id, "sahi kehta tha — u deserve better", 1484),
    mockMsg(
      "ma10",
      AREY_USER.id,
      "aur ye baat main teri 'best friend' ki taraf se nahi bol rahi",
      1482,
    ),
    mockMsg("ma11", AREY_USER.id, "bol rahi hun kyunki it's TRUE", 1481),
    mockMsg("ma12", "me", "yaar emotional mat kar please 😭", 1478),
    mockMsg(
      "ma13",
      AREY_USER.id,
      "nahi karungi emotional, facts bolunga tujhe",
      1475,
    ),
    mockMsg(
      "ma14",
      AREY_USER.id,
      "tu genuine hai, caring hai, aur people take advantage of that",
      1473,
    ),
    mockMsg("ma15", "me", "pata hai mujhe bhi.. par kya karun", 1470),
    mockMsg("ma16", AREY_USER.id, "apni value pehchan bhai. seriously.", 1468),
    mockMsg("ma17", "me", "tera pata kaise hota hai ye sab 😅", 1465),
    mockMsg("ma18", AREY_USER.id, "because I pay attention", 1463),
    mockMsg(
      "ma19",
      AREY_USER.id,
      "aur ye wala trait tujhme bahut kam logon mein hota hai",
      1460,
    ),
    mockMsg("ma20", "me", "okay okay I hear you didi", 1455),
    mockMsg("ma21", AREY_USER.id, "DIDI 😭 acha hua call kiya", 1453),
    mockMsg(
      "ma22",
      "me",
      "haha okay but seriously thanks for being there",
      1450,
    ),
    mockMsg(
      "ma23",
      AREY_USER.id,
      "always. 24/7 available for your existential crises 🫶🏻",
      1448,
    ),
    mockMsg("ma24", "me", "what would I do without you honestly", 1200),
    mockMsg(
      "ma25",
      AREY_USER.id,
      "survive probably but with much worse decisions",
      1198,
    ),
    mockMsg("ma26", "me", "accurate 😂", 1195),
    mockMsg("ma27", AREY_USER.id, "tune khaana khaaya?", 900),
    mockMsg("ma28", "me", "kal se nahi khaaya properly", 898),
    mockMsg("ma29", AREY_USER.id, "BHAI.", 896),
    mockMsg("ma30", AREY_USER.id, "ye kya tarika hai", 895),
    mockMsg("ma31", "me", "bhook nahi lagi", 893),
    mockMsg("ma32", AREY_USER.id, "fir bhi khaana chahiye na", 891),
    mockMsg("ma33", AREY_USER.id, "apna khayal rakh please", 890),
    mockMsg("ma34", "me", "haan haan khaaunga", 888),
    mockMsg("ma35", AREY_USER.id, "pinky promise?", 886),
    mockMsg("ma36", "me", "👉🏻👈🏻 promise", 884),
    mockMsg("ma37", AREY_USER.id, "HAHA omg you actually did the thing", 882),
    mockMsg("ma38", "me", "tere wala sign hai ye technically", 880),
    mockMsg("ma39", AREY_USER.id, "i'm honoured 😭✨", 878),
    mockMsg("ma40", "me", "tu meri fav hai pata hai", 500),
    mockMsg("ma41", AREY_USER.id, "abe teri fav hu 🤤 I know I know", 498),
    mockMsg("ma42", "me", "haha tune toh bio hi bana li iske upar", 496),
    mockMsg(
      "ma43",
      AREY_USER.id,
      "priority list mein sab se upar hun na toh...",
      494,
    ),
    mockMsg("ma44", "me", "facts can't even argue 😂", 492),
    mockMsg(
      "ma45",
      AREY_USER.id,
      "okay tune kuch plan kiya hai weekend ke liye?",
      300,
    ),
    mockMsg("ma46", "me", "nahi kuch nahi... tu bata", 298),
    mockMsg(
      "ma47",
      AREY_USER.id,
      "let's do a movie night, tujhe force karna padega bahar se",
      296,
    ),
    mockMsg("ma48", "me", "please haan yes please 🙏", 294),
    mockMsg("ma49", AREY_USER.id, "done. Saturday. no excuses.", 292),
    mockMsg(
      "ma50",
      AREY_USER.id,
      "abe sun mujhe, tu actually deserve karta hai sab kuch achha 🫶🏻",
      8,
      false,
    ),
  ],
  conv_choco: [
    mockMsg("mc1", "me", "okayy so I had the weirdest dream last night", 1440),
    mockMsg("mc2", CHOCO_USER.id, "tell me EVERYTHING", 1438),
    mockMsg(
      "mc3",
      "me",
      "I was in a library but every book was just a mirror",
      1436,
    ),
    mockMsg("mc4", CHOCO_USER.id, "okay that's lowkey terrifying", 1434),
    mockMsg("mc5", CHOCO_USER.id, "but also... poetic?", 1433),
    mockMsg(
      "mc6",
      "me",
      "RIGHT like idk if I should be scared or inspired",
      1430,
    ),
    mockMsg("mc7", CHOCO_USER.id, "both. always both.", 1428),
    mockMsg("mc8", "me", "why are you always right it's annoying", 1425),
    mockMsg("mc9", CHOCO_USER.id, "I know I know 😌", 1420),
    mockMsg(
      "mc10",
      CHOCO_USER.id,
      "okay but unrelated — I tried making actual chocolate cake today",
      1200,
    ),
    mockMsg("mc11", "me", "AND??", 1198),
    mockMsg(
      "mc12",
      CHOCO_USER.id,
      "it was... fine. just fine. I'm devastated",
      1196,
    ),
    mockMsg("mc13", "me", "lmaooo you hyped it up for nothing", 1194),
    mockMsg(
      "mc14",
      CHOCO_USER.id,
      "I hyped it up for EVERYTHING and it betrayed me",
      1192,
    ),
    mockMsg("mc15", "me", "okay but was the frosting good at least", 1190),
    mockMsg(
      "mc16",
      CHOCO_USER.id,
      "the frosting was the only honest thing in the room",
      1188,
    ),
    mockMsg(
      "mc17",
      "me",
      "that's lowkey the most relatable thing you've ever said",
      1185,
    ),
    mockMsg("mc18", CHOCO_USER.id, "I contain multitudes", 1180),
    mockMsg("mc19", "me", "you contain drama mostly", 1178),
    mockMsg("mc20", CHOCO_USER.id, "same thing", 1175),
    mockMsg(
      "mc21",
      "me",
      "do you ever think about how weird it is that we exist",
      900,
    ),
    mockMsg("mc22", CHOCO_USER.id, "only constantly", 898),
    mockMsg(
      "mc23",
      CHOCO_USER.id,
      "like why does existing have so many steps",
      897,
    ),
    mockMsg("mc24", "me", "wake up, be perceived, go to sleep, repeat", 895),
    mockMsg(
      "mc25",
      CHOCO_USER.id,
      "the being perceived part is the worst one",
      893,
    ),
    mockMsg(
      "mc26",
      "me",
      "agreed. I hate it here but also I'm not leaving",
      890,
    ),
    mockMsg("mc27", CHOCO_USER.id, "exactly. committed to the bit", 888),
    mockMsg("mc28", "me", "what are you doing rn", 600),
    mockMsg(
      "mc29",
      CHOCO_USER.id,
      "staring at my ceiling thinking about nothing",
      598,
    ),
    mockMsg("mc30", CHOCO_USER.id, "it's quite peaceful actually", 597),
    mockMsg("mc31", "me", "that sounds like a whole vibe tbh", 595),
    mockMsg("mc32", CHOCO_USER.id, "it really is. 10/10 activity", 593),
    mockMsg("mc33", "me", "I should try doing nothing sometime", 590),
    mockMsg(
      "mc34",
      CHOCO_USER.id,
      "you'd hate it, you're too in your head",
      588,
    ),
    mockMsg("mc35", "me", "rude. accurate. but rude.", 585),
    mockMsg("mc36", CHOCO_USER.id, "that's just how I show affection", 583),
    mockMsg("mc37", "me", "I know and I've accepted my fate", 580),
    mockMsg("mc38", CHOCO_USER.id, "growth 🫶", 578),
    mockMsg(
      "mc39",
      "me",
      "okay okay last thing — what song do I need right now",
      120,
    ),
    mockMsg(
      "mc40",
      CHOCO_USER.id,
      "hmm describe your current emotion in three words",
      118,
    ),
    mockMsg("mc41", "me", "tired but unbothered", 116),
    mockMsg("mc42", CHOCO_USER.id, "that's two words but okay", 114),
    mockMsg(
      "mc43",
      CHOCO_USER.id,
      "something slow and heavy that still feels like floating",
      113,
    ),
    mockMsg("mc44", "me", "yes perfect you get it", 111),
    mockMsg("mc45", CHOCO_USER.id, "I always get it", 109),
    mockMsg("mc46", "me", "okay but seriously thank you for existing", 60),
    mockMsg(
      "mc47",
      CHOCO_USER.id,
      "existing is really overrated but I'll do it for you",
      58,
    ),
    mockMsg(
      "mc48",
      "me",
      "that's the sweetest thing you've ever said to me",
      55,
    ),
    mockMsg(
      "mc49",
      CHOCO_USER.id,
      "don't tell anyone, I have a reputation",
      53,
    ),
    mockMsg(
      "mc50",
      CHOCO_USER.id,
      "okay but why does sleep feel like a personal attack on my vibe",
      2,
      false,
    ),
  ],
  conv1: [
    mockMsg("m1_1", "me", "Just posted the Shinjuku series!", 65),
    mockMsg(
      "m1_2",
      MOCK_USERS[2].id,
      "Oh wow, I saw! The lighting is incredible ✨",
      60,
    ),
    mockMsg(
      "m1_3",
      "me",
      "Thanks! Shot during blue hour — only had 12 minutes",
      55,
    ),
    mockMsg(
      "m1_4",
      MOCK_USERS[2].id,
      "You should submit to Vogue Japan honestly",
      50,
    ),
    mockMsg("m1_5", "me", "Haha maybe someday! How's Paris?", 40),
    mockMsg("m1_6", MOCK_USERS[2].id, "Chaotic but beautiful as always 🌸", 35),
    mockMsg("m1_7", MOCK_USERS[2].id, "Love the new shoot! 🔥", 5, false),
  ],
  conv2: [
    mockMsg(
      "m2_1",
      MOCK_USERS[1].id,
      "Hey! Loved your 3D sculpture series",
      200,
    ),
    mockMsg("m2_2", "me", "Thank you so much! Took 3 weeks of evenings", 195),
    mockMsg(
      "m2_3",
      MOCK_USERS[1].id,
      "I'm working on a generative project",
      190,
    ),
    mockMsg("m2_4", MOCK_USERS[1].id, "Let's collaborate on that piece", 32),
  ],
  conv3: [
    mockMsg("m3_1", MOCK_USERS[1].id, "Welcome to the group! 👋", 1440),
    mockMsg("m3_2", MOCK_USERS[5].id, "Glad we're all connecting!", 1430),
    mockMsg("m3_3", "me", "Excited for this collab", 1420),
    mockMsg("m3_4", MOCK_USERS[5].id, "Brief is ready, check it out!", 120),
  ],
  conv4: [
    mockMsg("m4_1", "me", "Watched your short film — stunning!", 800),
    mockMsg(
      "m4_2",
      MOCK_USERS[3].id,
      "Appreciate it! It was a passion project",
      780,
    ),
    mockMsg("m4_3", "me", "The practical effects were insane", 760),
    mockMsg("m4_4", MOCK_USERS[3].id, "The soundtrack fits perfectly 🎵", 360),
  ],
  conv5: [
    mockMsg(
      "m5_1",
      MOCK_USERS[7].id,
      "Just posted some new botanical shots",
      800,
    ),
    mockMsg("m5_2", "me", "Beautiful! Love your minimalist style", 790),
    mockMsg("m5_3", MOCK_USERS[7].id, "Those plants are incredible!", 720),
  ],
};

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    type: "like",
    actor: MOCK_USERS[2],
    postThumbnail: "https://picsum.photos/seed/lumina_p1/60/60",
    text: "liked your photo",
    timestamp: new Date(Date.now() - 300000),
    isRead: false,
  },
  {
    id: "n2",
    type: "follow",
    actor: MOCK_USERS[4],
    text: "started following you",
    timestamp: new Date(Date.now() - 600000),
    isRead: false,
  },
  {
    id: "n3",
    type: "comment",
    actor: MOCK_USERS[1],
    postThumbnail: "https://picsum.photos/seed/lumina_p2/60/60",
    text: 'commented: "This is absolutely stunning! 🔥"',
    timestamp: new Date(Date.now() - 1800000),
    isRead: false,
  },
  {
    id: "n4",
    type: "mention",
    actor: MOCK_USERS[5],
    postThumbnail: "https://picsum.photos/seed/lumina_p3/60/60",
    text: "mentioned you in a comment",
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
  },
  {
    id: "n5",
    type: "like",
    actor: CHOCO_USER,
    postThumbnail: "https://picsum.photos/seed/lumina_p4/60/60",
    text: "liked your reel",
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
  },
  {
    id: "n6",
    type: "follow",
    actor: MOCK_USERS[3],
    text: "started following you",
    timestamp: new Date(Date.now() - 14400000),
    isRead: true,
  },
  {
    id: "n7",
    type: "like",
    actor: MOCK_USERS[6],
    postThumbnail: "https://picsum.photos/seed/lumina_p5/60/60",
    text: "liked your photo",
    timestamp: new Date(Date.now() - 86400000),
    isRead: true,
  },
  {
    id: "n8",
    type: "message",
    actor: MOCK_USERS[2],
    text: "sent you a message",
    timestamp: new Date(Date.now() - 172800000),
    isRead: true,
  },
];

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

export const MOCK_NOTES: MockNote[] = [
  {
    id: "note_arey",
    author: AREY_USER,
    text: "👉🏻👈🏻 u deserve better, always",
    timestamp: new Date(Date.now() - 45 * 60000),
    expiresAt: new Date(Date.now() - 45 * 60000 + 24 * 3600000),
    replies: [],
  },
  {
    id: "note_choco",
    author: CHOCO_USER,
    text: "sleep is a scam and yet here I am",
    timestamp: new Date(Date.now() - 30 * 60000),
    expiresAt: new Date(Date.now() - 30 * 60000 + 24 * 3600000),
    replies: [
      {
        id: "nr_choco1",
        author: {
          id: "me",
          username: "you",
          displayName: "You",
          bio: "",
          websiteUrl: "",
          avatarUrl: "",
          isPrivate: false,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          isFollowing: false,
          isVerified: false,
        },
        text: "same. solidarity.",
        timestamp: new Date(Date.now() - 20 * 60000),
      },
    ],
  },
  {
    id: "note1",
    author: MOCK_USERS[1], // aurora.lens
    text: "golden hour was unreal today 🌅",
    musicTrack: {
      id: "t1",
      title: "Midnight City",
      artist: "M83",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/c3/77/44/c3774459-ed3d-89f7-a8e3-b8a5ef1b1d1a/source/100x100bb.jpg",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/bc/2e/e4/bc2ee4f3-0ef5-ab98-c902-36bfac37fe4d/mzaf_4490609827460326667.plus.aac.p.m4a",
    },
    timestamp: new Date(Date.now() - 2 * 3600000),
    expiresAt: new Date(Date.now() - 2 * 3600000 + 24 * 3600000),
    replies: [
      {
        id: "nr1",
        author: MOCK_USERS[2], // neon.nomad
        text: "stunning shot! 🔥",
        timestamp: new Date(Date.now() - 1 * 3600000),
      },
    ],
  },
  {
    id: "note2",
    author: MOCK_USERS[2], // neon.nomad
    text: "new generative piece dropping tonight 👾",
    timestamp: new Date(Date.now() - 4 * 3600000),
    expiresAt: new Date(Date.now() - 4 * 3600000 + 24 * 3600000),
    replies: [],
  },
  {
    id: "note3",
    author: MOCK_USERS[3], // velvet.sky - fashion
    text: "Paris fashion week energy is immaculate ✨",
    musicTrack: {
      id: "t2",
      title: "Bejeweled",
      artist: "Taylor Swift",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/25/9f/4b/259f4b41-f16d-1e31-9cd8-e7a5a879b7d3/source/100x100bb.jpg",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/5a/64/c2/5a64c2e4-3b1c-3b15-92a2-2d08e3ae7890/mzaf_13247374449451584718.plus.aac.p.m4a",
    },
    timestamp: new Date(Date.now() - 6 * 3600000),
    expiresAt: new Date(Date.now() - 6 * 3600000 + 24 * 3600000),
    replies: [
      {
        id: "nr2",
        author: MOCK_USERS[1], // aurora.lens
        text: "jealous!! bring me back something 🙏",
        timestamp: new Date(Date.now() - 5 * 3600000),
      },
      {
        id: "nr3",
        author: MOCK_USERS[5], // luna.abstract
        text: "living the dream 🌸",
        timestamp: new Date(Date.now() - 4.5 * 3600000),
      },
    ],
  },
  {
    id: "note4",
    author: MOCK_USERS[4], // echo.frames - filmmaker
    text: "filming all night, coffee is life rn ☕",
    timestamp: new Date(Date.now() - 8 * 3600000),
    expiresAt: new Date(Date.now() - 8 * 3600000 + 24 * 3600000),
    replies: [],
  },
  {
    id: "note5",
    author: MOCK_USERS[5], // luna.abstract - 3D artist
    text: "3D renders looking insane this week 🎨",
    musicTrack: {
      id: "t3",
      title: "Holdin On",
      artist: "Flume",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/3f/60/c2/3f60c21c-6b3f-8f5a-1b93-89e4b3cc4a23/source/100x100bb.jpg",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview/v4/3f/60/c2/3f60c21c-6b3f-8f5a-1b93-89e4b3cc4a23/mzaf_example.plus.aac.p.m4a",
    },
    timestamp: new Date(Date.now() - 10 * 3600000),
    expiresAt: new Date(Date.now() - 10 * 3600000 + 24 * 3600000),
    replies: [
      {
        id: "nr4",
        author: MOCK_USERS[6], // prism.collective
        text: "send me the files! would love to collab",
        timestamp: new Date(Date.now() - 9 * 3600000),
      },
    ],
  },
  {
    id: "note6",
    author: MOCK_USERS[6], // prism.collective - design
    text: "design brief approved — let's gooo 🔺",
    timestamp: new Date(Date.now() - 14 * 3600000),
    expiresAt: new Date(Date.now() - 14 * 3600000 + 24 * 3600000),
    replies: [],
  },
  {
    id: "note7",
    author: MOCK_USERS[7], // drift.code - synth composer
    text: "synthwave mix almost done, just need vocals 🎵",
    musicTrack: {
      id: "t4",
      title: "Lo-fi Study Beats",
      artist: "Chillhop Music",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ab/cd/ef/abcdef12-3456-7890-abcd-ef1234567890/source/100x100bb.jpg",
      previewUrl: "",
    },
    timestamp: new Date(Date.now() - 20 * 3600000),
    expiresAt: new Date(Date.now() - 20 * 3600000 + 24 * 3600000),
    replies: [
      {
        id: "nr5",
        author: MOCK_USERS[4], // echo.frames - filmmaker/creative
        text: "I can lay down some vocals if you want!",
        timestamp: new Date(Date.now() - 18 * 3600000),
      },
    ],
  },
];

export const MOCK_HIGHLIGHTS: MockHighlight[] = [
  {
    id: "h1",
    title: "Tokyo",
    coverGradient: "linear-gradient(135deg, #6B21A8, #EC4899)",
    storyCount: 12,
  },
  {
    id: "h2",
    title: "Studio",
    coverGradient: "linear-gradient(135deg, #0EA5E9, #6366F1)",
    storyCount: 8,
  },
  {
    id: "h3",
    title: "Travel",
    coverGradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    storyCount: 23,
  },
  {
    id: "h4",
    title: "Art",
    coverGradient: "linear-gradient(135deg, #10B981, #3B82F6)",
    storyCount: 15,
  },
  {
    id: "h5",
    title: "Shoots",
    coverGradient: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
    storyCount: 9,
  },
];

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
