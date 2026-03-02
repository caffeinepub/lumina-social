import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/context/AppContext";
import {
  MOCK_CONVERSATIONS,
  MOCK_USERS,
  formatRelativeTime,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockConversation, MockMessage } from "@/types";
import {
  ArrowLeft,
  ExternalLink,
  Image,
  Info,
  MessageCircle,
  Mic,
  Phone,
  Pin,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ME_ID = "me";

const LOGGED_IN_USER_ID = "1"; // aurora.lens is the default logged-in mock user

function getConvName(conv: MockConversation): string {
  if (conv.isGroup) return conv.groupName ?? "Group";
  return (
    conv.participants.find((p) => p.id !== LOGGED_IN_USER_ID)?.username ??
    conv.participants[0]?.username ??
    "Unknown"
  );
}

function getConvAvatar(conv: MockConversation): string {
  if (conv.isGroup) return MOCK_USERS[2].avatarUrl;
  const other = conv.participants.find((p) => p.id !== LOGGED_IN_USER_ID);
  return other?.avatarUrl ?? MOCK_USERS[1].avatarUrl;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 glass rounded-2xl rounded-bl-sm w-14">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot w-1.5 h-1.5 rounded-full bg-white/50 inline-block"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

function SharedPostBubble({
  msg,
  isMe,
}: {
  msg: MockMessage;
  isMe: boolean;
}) {
  if (!msg.sharedPost) return null;
  const { imageUrl, authorUsername, caption } = msg.sharedPost;

  return (
    <div
      className={cn(
        "max-w-[70%] rounded-2xl overflow-hidden glass text-white/90",
        isMe ? "rounded-br-sm" : "rounded-bl-sm",
      )}
    >
      <div className="flex items-center gap-3 p-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Shared post"
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          {authorUsername && (
            <p className="text-[10px] text-white/50 mb-0.5">
              @{authorUsername}
            </p>
          )}
          <p className="text-xs text-white/80 truncate leading-snug">
            {caption || "Shared a post"}
          </p>
          <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
            <ExternalLink size={10} />
            View Post
          </p>
        </div>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState<MockConversation | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const { messages, sendMessage } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConvs = MOCK_CONVERSATIONS.filter((c) => {
    const name = getConvName(c).toLowerCase();
    return !searchQuery || name.includes(searchQuery.toLowerCase());
  });

  const currentMessages = selectedConv ? (messages[selectedConv.id] ?? []) : [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message change is intentional
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedConv) return;
    const newMsg: MockMessage = {
      id: `msg_${Date.now()}`,
      senderId: ME_ID,
      text: messageText.trim(),
      timestamp: new Date(),
      isRead: false,
      type: "text",
    };
    sendMessage(selectedConv.id, newMsg);
    setMessageText("");

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const isChocoChat = selectedConv.id === "conv_choco";
      const chocoReplies = [
        "okay but why",
        "no you're projecting",
        "I was literally just thinking about this",
        "existing is exhausting but go on",
        "that's very you of you",
        "okay and? 😐",
        "I felt that",
        "bro same honestly",
        "you need sleep",
        "this is sending me",
        "I'm not surprised but continue",
        "lowkey valid though",
      ];
      const genericReplies = [
        "That's interesting! 🔥",
        "Love that perspective ✨",
        "Totally agree! 🙌",
        "Let's catch up soon 💫",
        "Amazing work as always 🎨",
      ];
      const responses = isChocoChat ? chocoReplies : genericReplies;
      const reply: MockMessage = {
        id: `msg_reply_${Date.now()}`,
        senderId: selectedConv.participants[0]?.id ?? "other",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isRead: false,
        type: "text",
      };
      sendMessage(selectedConv.id, reply);
    }, 2000);
  };

  const ConversationList = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/8">
        <h1 className="text-lg font-bold mb-3">Messages</h1>
        <GlassInput
          icon={<Search size={14} />}
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <NotesPanel />
      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredConvs.map((conv) => {
            const name = getConvName(conv);
            const avatar = getConvAvatar(conv);
            const isSelected = selectedConv?.id === conv.id;

            return (
              <motion.button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 text-left",
                  isSelected ? "bg-primary/10" : "hover:bg-white/5",
                )}
              >
                <div className="relative flex-shrink-0">
                  <GlassAvatar src={avatar} alt={name} size="md" />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-bg text-[10px] font-bold text-white flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium truncate flex items-center gap-1",
                        conv.unreadCount > 0 ? "text-white" : "text-white/80",
                      )}
                    >
                      {conv.isPinned && (
                        <Pin size={10} className="text-primary flex-shrink-0" />
                      )}
                      {name}
                    </span>
                    <span className="text-xs text-white/30 ml-2 flex-shrink-0">
                      {formatRelativeTime(conv.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs truncate",
                      conv.unreadCount > 0 ? "text-white/70" : "text-white/40",
                    )}
                  >
                    {conv.lastMessage.senderId === ME_ID ? "You: " : ""}
                    {conv.lastMessage.text}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  const ChatView = selectedConv && (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 glass-heavy flex-shrink-0">
        <button
          type="button"
          onClick={() => setSelectedConv(null)}
          className="lg:hidden text-white/60 hover:text-white transition-colors mr-1"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <GlassAvatar
          src={getConvAvatar(selectedConv)}
          alt={getConvName(selectedConv)}
          size="md"
          hasStory
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {getConvName(selectedConv)}
          </p>
          <p className="text-xs text-accent/70">Active now</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Voice call"
          >
            <Phone size={16} />
          </button>
          <button
            type="button"
            className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Video call"
          >
            <Video size={16} />
          </button>
          <button
            type="button"
            className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Chat info"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 px-4 py-4">
        <div className="space-y-3">
          {currentMessages.map((msg, i) => {
            const isMe = msg.senderId === ME_ID;
            const showAvatar =
              !isMe &&
              (i === 0 || currentMessages[i - 1]?.senderId !== msg.senderId);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-end gap-2",
                  isMe ? "justify-end" : "justify-start",
                )}
              >
                {!isMe && (
                  <div className="w-7 h-7 flex-shrink-0">
                    {showAvatar && (
                      <img
                        src={getConvAvatar(selectedConv)}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    )}
                  </div>
                )}

                {msg.type === "shared_post" ? (
                  <SharedPostBubble msg={msg} isMe={isMe} />
                ) : (
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm",
                      isMe
                        ? "gradient-bg text-white rounded-br-sm"
                        : "glass text-white/90 rounded-bl-sm",
                    )}
                  >
                    {msg.text}
                    <p className="text-[10px] mt-0.5 opacity-50">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              <img
                src={getConvAvatar(selectedConv)}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-white/8 glass-heavy flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-white/50 hover:text-white transition-colors flex-shrink-0"
            aria-label="Attach image"
          >
            <Image size={20} />
          </button>
          <div className="flex-1">
            <GlassInput
              placeholder="Message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
            />
          </div>
          <button
            type="button"
            className="text-white/50 hover:text-white transition-colors flex-shrink-0"
            aria-label="Add emoji"
          >
            <Smile size={20} />
          </button>
          {messageText ? (
            <GlassButton
              variant="gradient"
              size="icon"
              onClick={handleSend}
              className="flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </GlassButton>
          ) : (
            <button
              type="button"
              className="text-white/50 hover:text-white transition-colors flex-shrink-0"
              aria-label="Voice message"
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex fixed inset-0 lg:left-[260px]">
      {/* Conversation list */}
      <div
        className={cn(
          "w-full lg:w-[340px] flex-shrink-0 border-r border-white/8 glass-heavy overflow-hidden",
          selectedConv ? "hidden lg:flex lg:flex-col" : "flex flex-col",
        )}
      >
        {ConversationList}
      </div>

      {/* Chat area */}
      <div
        className={cn(
          "flex-1 overflow-hidden",
          selectedConv
            ? "flex flex-col"
            : "hidden lg:flex lg:items-center lg:justify-center",
        )}
      >
        {selectedConv ? (
          ChatView
        ) : (
          <div className="text-center">
            <MessageCircle size={48} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
