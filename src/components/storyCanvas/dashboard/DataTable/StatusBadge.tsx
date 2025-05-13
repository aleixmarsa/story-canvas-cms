import { Badge } from "@/components/ui/badge";
import { StoryStatus } from "@prisma/client";
import { InfoTooltip } from "../InfoTooltip";

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
      <InfoTooltip
        message={
          <p className="text-xs max-w-[100px]">
            {messages[status as keyof typeof messages]}
          </p>
        }
      />
    </div>
  );
};

export default StatusBadge;
