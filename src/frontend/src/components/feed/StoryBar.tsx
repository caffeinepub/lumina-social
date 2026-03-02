import { GlassAvatar } from "@/components/glass/GlassAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_STORIES } from "@/data/mockData";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function StoryBar() {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-4 mb-4">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-4 pb-1">
          {/* Your story */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              className="relative w-14 h-14 rounded-full glass border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center justify-center hover:scale-105"
              aria-label="Add to your story"
              onClick={() => {}}
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
          {MOCK_STORIES.map((story) => (
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
      </ScrollArea>
    </div>
  );
}
