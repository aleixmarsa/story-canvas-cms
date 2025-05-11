import { Badge } from "@/components/ui/badge";
import { StoryStatus } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  const storyStatusTips = {
    draft: "Only visible in preview. Not published yet.",
    published: "Visible in both preview and live.",
    changed: "Live version differs from preview. Changes not published.",
  };
  return (
    <div className="flex items-center gap-1">
      <Badge
        variant={
          status === StoryStatus.published
            ? "default"
            : status === StoryStatus.draft
            ? "outline"
            : "secondary"
        }
        className="min-w-[75px]"
      >
        {status}
      </Badge>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hover:text-gray-700 cursor-pointer">
              <Info size={14} />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-[100px]">
              {storyStatusTips[status as keyof typeof storyStatusTips]}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
export default StatusBadge;
