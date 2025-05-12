import { Badge } from "@/components/ui/badge";
import { StoryStatus } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const StatusBadge = ({
  status,
  messages,
}: {
  status: string;
  messages: { draft: string; published: string; changed: string };
}) => {
  return (
    <div className="flex items-center gap-1 group">
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
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground cursor-pointer">
              <Info size={14} />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-[100px]">
              {messages[status as keyof typeof messages]}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StatusBadge;
