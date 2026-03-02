import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { GlassButton } from "@/components/glass/GlassButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { formatRelativeTime } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { MockNotification } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AtSign,
  Check,
  Heart,
  Mail,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function NotifIcon({ type }: { type: MockNotification["type"] }) {
  const styles: Record<
    MockNotification["type"],
    { bg: string; icon: React.ReactNode }
  > = {
    like: {
      bg: "bg-secondary/20",
      icon: <Heart size={12} className="text-secondary fill-secondary" />,
    },
    comment: {
      bg: "bg-primary/20",
      icon: <MessageCircle size={12} className="text-primary" />,
    },
    follow: {
      bg: "bg-accent/20",
      icon: <UserPlus size={12} className="text-accent" />,
    },
    mention: {
      bg: "bg-chart-4/20",
      icon: <AtSign size={12} className="text-yellow-400" />,
    },
    message: {
      bg: "bg-chart-5/20",
      icon: <Mail size={12} className="text-green-400" />,
    },
  };
  const { bg, icon } = styles[type];
  return (
    <div
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center",
        bg,
      )}
    >
      {icon}
    </div>
  );
}

function NotificationItem({
  notif,
  index,
}: { notif: MockNotification; index: number }) {
  const { markNotificationRead } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => markNotificationRead(notif.id)}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
        !notif.isRead ? "bg-primary/6 hover:bg-primary/10" : "hover:bg-white/5",
      )}
    >
      {/* Avatar with type indicator */}
      <div className="relative flex-shrink-0">
        <GlassAvatar
          src={notif.actor.avatarUrl}
          alt={notif.actor.displayName}
          size="md"
        />
        <div className="absolute -bottom-0.5 -right-0.5">
          <NotifIcon type={notif.type} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/90 leading-snug">
          <Link
            to="/profile/$username"
            params={{ username: notif.actor.username }}
            className="font-semibold hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {notif.actor.username}
          </Link>{" "}
          <span className="text-white/60">{notif.text}</span>
        </p>
        <p className="text-xs text-white/30 mt-0.5">
          {formatRelativeTime(notif.timestamp)}
        </p>
      </div>

      {/* Post thumbnail or follow button */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {notif.type === "follow" ? (
          <GlassButton variant="outline" size="sm" className="text-xs">
            Follow back
          </GlassButton>
        ) : notif.postThumbnail ? (
          <div
            className="w-11 h-11 rounded-lg overflow-hidden"
            style={{ background: notif.postThumbnail }}
          />
        ) : null}
        {!notif.isRead && (
          <div className="w-2 h-2 rounded-full gradient-bg flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

export function NotificationsPage() {
  const { notifications, markAllNotificationsRead } = useApp();
  const unread = notifications.filter((n) => !n.isRead).length;

  const byType = (types: MockNotification["type"][]) =>
    notifications.filter((n) => types.includes(n.type));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold">Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-white/40">
              {unread} new since last visit
            </p>
          )}
        </div>
        {unread > 0 && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={markAllNotificationsRead}
            className="text-primary text-xs"
          >
            <Check size={12} />
            Mark all read
          </GlassButton>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="glass border border-white/10 bg-transparent mb-4 p-1 gap-1">
          {[
            { value: "all", label: "All" },
            { value: "follows", label: "Follows" },
            { value: "likes", label: "Likes" },
            { value: "comments", label: "Comments" },
            { value: "mentions", label: "Mentions" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-glow-sm rounded-lg px-3 py-1.5"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0 space-y-1">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              No notifications yet
            </div>
          ) : (
            notifications.map((n, i) => (
              <NotificationItem key={n.id} notif={n} index={i} />
            ))
          )}
        </TabsContent>
        <TabsContent value="follows" className="mt-0 space-y-1">
          {byType(["follow"]).map((n, i) => (
            <NotificationItem key={n.id} notif={n} index={i} />
          ))}
        </TabsContent>
        <TabsContent value="likes" className="mt-0 space-y-1">
          {byType(["like"]).map((n, i) => (
            <NotificationItem key={n.id} notif={n} index={i} />
          ))}
        </TabsContent>
        <TabsContent value="comments" className="mt-0 space-y-1">
          {byType(["comment"]).map((n, i) => (
            <NotificationItem key={n.id} notif={n} index={i} />
          ))}
        </TabsContent>
        <TabsContent value="mentions" className="mt-0 space-y-1">
          {byType(["mention"]).map((n, i) => (
            <NotificationItem key={n.id} notif={n} index={i} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
