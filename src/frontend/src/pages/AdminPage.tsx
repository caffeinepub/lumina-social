import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput } from "@/components/glass/GlassInput";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { MOCK_POSTS, MOCK_USERS, formatCount } from "@/data/mockData";
import { useAllUserProfiles, useIsAdmin } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Ban,
  BarChart3,
  CheckCircle,
  FileText,
  Flag,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, change, icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-card p-5 border", color)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {change && <p className="text-xs text-green-400 mt-1">↑ {change}</p>}
        </div>
        <div className="p-2 rounded-xl glass">{icon}</div>
      </div>
    </motion.div>
  );
}

const MOCK_REPORTS = [
  {
    id: "r1",
    type: "spam",
    reporter: MOCK_USERS[1],
    reported: MOCK_USERS[3],
    content: "Post promoting spam links",
    status: "pending",
  },
  {
    id: "r2",
    type: "harassment",
    reporter: MOCK_USERS[2],
    reported: MOCK_USERS[6],
    content: "Harassing comments",
    status: "pending",
  },
  {
    id: "r3",
    type: "misinformation",
    reporter: MOCK_USERS[4],
    reported: MOCK_USERS[5],
    content: "False medical claims",
    status: "resolved",
  },
];

export function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  useAllUserProfiles();
  const { posts, deletePost } = useApp();
  const [userSearch, setUserSearch] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full gradient-bg animate-pulse" />
      </div>
    );
  }

  // Show admin panel even if not confirmed admin (mock data available)
  const displayUsers = MOCK_USERS.filter(
    (u) =>
      !userSearch ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-white/40">Platform management dashboard</p>
        </div>
      </div>

      {!isAdmin && (
        <div className="glass-card p-4 border border-yellow-500/20 flex items-center gap-3">
          <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-white/70">
            You're viewing admin panel in preview mode. Connect with admin
            credentials for full access.
          </p>
        </div>
      )}

      <Tabs defaultValue="dashboard">
        <TabsList className="glass border border-white/10 bg-transparent mb-6 p-1 gap-1">
          {[
            {
              value: "dashboard",
              label: "Dashboard",
              icon: <BarChart3 size={14} />,
            },
            { value: "users", label: "Users", icon: <Users size={14} /> },
            {
              value: "content",
              label: "Content",
              icon: <FileText size={14} />,
            },
            { value: "reports", label: "Reports", icon: <Flag size={14} /> },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs flex items-center gap-1.5 data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-glow-sm rounded-lg px-3 py-1.5"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="mt-0 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={formatCount(48200)}
              change="12% this week"
              icon={<Users size={18} className="text-primary" />}
              color="border-primary/20"
            />
            <StatCard
              label="Total Posts"
              value={formatCount(284000)}
              change="8% this week"
              icon={<FileText size={18} className="text-secondary" />}
              color="border-secondary/20"
            />
            <StatCard
              label="Active Today"
              value={formatCount(12300)}
              change="24% vs yesterday"
              icon={<BarChart3 size={18} className="text-accent" />}
              color="border-accent/20"
            />
            <StatCard
              label="Reports Pending"
              value={2}
              icon={<Flag size={18} className="text-destructive" />}
              color="border-destructive/20"
            />
          </div>

          {/* Chart placeholder */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">
              Platform Activity — Last 7 Days
            </h3>
            <div className="flex items-end gap-2 h-32">
              {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const).map(
                (day, i) => {
                  const heights = [62, 48, 78, 91, 55, 83, 95];
                  return (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full rounded-t-md gradient-bg opacity-70 hover:opacity-100 transition-opacity"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-[10px] text-white/30">
                        {day.charAt(0)}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-0 space-y-4">
          <GlassInput
            icon={<Search size={14} />}
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <GlassCard className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/40 text-xs">User</TableHead>
                  <TableHead className="text-white/40 text-xs">
                    Followers
                  </TableHead>
                  <TableHead className="text-white/40 text-xs">Posts</TableHead>
                  <TableHead className="text-white/40 text-xs">
                    Status
                  </TableHead>
                  <TableHead className="text-white/40 text-xs">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-white/8 hover:bg-white/5"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.username}
                          </p>
                          <p className="text-xs text-white/40">
                            {user.displayName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-white/70">
                      {formatCount(user.followersCount)}
                    </TableCell>
                    <TableCell className="text-sm text-white/70">
                      {user.postsCount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs border",
                          user.isVerified
                            ? "border-accent/50 text-accent"
                            : "border-white/20 text-white/40",
                        )}
                      >
                        {user.isVerified ? "Verified" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          className="text-xs text-white/50 hover:text-white"
                          onClick={() =>
                            toast(`Viewing ${user.username}'s profile`)
                          }
                        >
                          View
                        </GlassButton>
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive/70 hover:text-destructive"
                          onClick={() => toast.error(`${user.username} banned`)}
                        >
                          <Ban size={12} />
                        </GlassButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        </TabsContent>

        {/* Content */}
        <TabsContent value="content" className="mt-0">
          <div className="grid grid-cols-3 gap-0.5">
            {posts.slice(0, 12).map((post) => (
              <div
                key={post.id}
                className="aspect-square relative group overflow-hidden"
              >
                <div
                  className="w-full h-full"
                  style={{ background: post.imageUrl }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={() => {
                      deletePost(post.id);
                      toast.error("Post deleted");
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </GlassButton>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-0 space-y-3">
          {MOCK_REPORTS.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "glass-card p-4",
                report.status === "resolved" && "opacity-50",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        report.type === "spam" &&
                          "border-yellow-500/50 text-yellow-400",
                        report.type === "harassment" &&
                          "border-destructive/50 text-destructive",
                        report.type === "misinformation" &&
                          "border-orange-500/50 text-orange-400",
                      )}
                    >
                      {report.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        report.status === "pending"
                          ? "border-white/30 text-white/50"
                          : "border-accent/50 text-accent",
                      )}
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/80 mb-1">{report.content}</p>
                  <p className="text-xs text-white/40">
                    Reported by{" "}
                    <span className="text-white/60">
                      {report.reporter.username}
                    </span>{" "}
                    against{" "}
                    <span className="text-white/60">
                      {report.reported.username}
                    </span>
                  </p>
                </div>
                {report.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      className="text-xs text-accent hover:text-accent/80"
                      onClick={() => toast.success("Report resolved")}
                    >
                      <CheckCircle size={12} />
                      Resolve
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive/70 hover:text-destructive"
                      onClick={() => toast("Report dismissed")}
                    >
                      Dismiss
                    </GlassButton>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
