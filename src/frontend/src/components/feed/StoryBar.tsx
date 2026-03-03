import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { CreateStoryModal } from "@/components/stories/CreateStoryModal";
import { MOCK_STORIES, MOCK_USERS } from "@/data/mockData";
import type { MockStory } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

const ME = MOCK_USERS[1]; // aurora.lens is the default mock logged-in user

export function StoryBar() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [extraStories, setExtraStories] = useState<MockStory[]>([]);

  const allStories = [...extraStories, ...MOCK_STORIES];

  const handleShare = (story: MockStory) => {
    setExtraStories((prev) => [story, ...prev]);
    // Navigate to new story's viewer after sharing
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
              <Plus size={22} className="text-white/60" />
              <div className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full gradient-bg flex items-center justify-center">
                <Plus size={10} className="text-white" />
              </div>
            </button>
            <span className="text-xs text-white/50 w-14 text-center truncate">
              Your story
            </span>
          </div>

          {/* Stories from mock data */}
          {allStories.map((story) => (
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
        currentUserId={ME.id}
        currentUserAvatarUrl={ME.avatarUrl}
        currentUserDisplayName={ME.displayName}
        currentUsername={ME.username}
      />
    </>
  );
}
