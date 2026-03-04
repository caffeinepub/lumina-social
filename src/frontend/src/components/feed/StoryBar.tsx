import { useAuthContext } from "@/components/auth/AuthContext";
import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { CreateStoryModal } from "@/components/stories/CreateStoryModal";
import { useApp } from "@/context/AppContext";
import type { MockStory } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export function StoryBar() {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const { stories, addStory } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleShare = (story: MockStory) => {
    addStory(story);
    navigate({ to: "/stories/$userId", params: { userId: story.author.id } });
  };

  return (
    <>
      <div className="glass-card p-4 mb-4">
        <div
          className="flex items-center gap-4 pb-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Your story */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              className="relative w-14 h-14 rounded-full glass border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center justify-center hover:scale-105 min-w-[56px] min-h-[56px]"
              aria-label="Add to your story"
              onClick={() => setIsCreateOpen(true)}
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt="Your story"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Plus size={22} className="text-white/60" />
              )}
              <div className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full gradient-bg flex items-center justify-center">
                <Plus size={10} className="text-white" />
              </div>
            </button>
            <span className="text-xs text-white/50 w-14 text-center truncate">
              Your story
            </span>
          </div>

          {/* Stories */}
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <GlassAvatar
                src={story.author.avatarUrl}
                alt={story.author.displayName}
                size="lg"
                hasStory
                isViewed={story.isViewed}
                onClick={() =>
                  navigate({
                    to: "/stories/$userId",
                    params: { userId: story.author.id },
                  })
                }
              />
              <span className="text-xs text-white/50 w-14 text-center truncate">
                {story.author.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CreateStoryModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onShare={handleShare}
        currentUserId={currentUser?.username ?? "me"}
        currentUserAvatarUrl={currentUser?.avatarUrl ?? ""}
        currentUserDisplayName={currentUser?.displayName ?? "You"}
        currentUsername={currentUser?.username ?? "you"}
      />
    </>
  );
}
