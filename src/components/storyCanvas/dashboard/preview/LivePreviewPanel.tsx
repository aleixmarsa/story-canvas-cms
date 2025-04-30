"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, SquareArrowOutUpRight } from "lucide-react";
import { SectionVersion } from "@prisma/client";
import { DraftSectionPreviewData } from "@/types/section";

type PreviewSize = "desktop" | "tablet" | "mobile" | "custom";

const SIZE_PRESETS: Record<PreviewSize, { width: number; height: number }> = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
  custom: { width: 1000, height: 800 },
};

type LivePreviewPanelProps = {
  slug: string;
  draftData: SectionVersion | null;
};

const LivePreviewPanel = ({ slug, draftData }: LivePreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState<PreviewSize>("desktop");
  const [customSize, setCustomSize] = useState({ width: 1000, height: 800 });
  const [zoom, setZoom] = useState(100);

  const selectedSize = size === "custom" ? customSize : SIZE_PRESETS[size];
  const { width, height } = selectedSize;
  const previewPath = `/preview/${slug}`;

  useEffect(() => {
    if (draftData && iframeRef.current?.contentWindow) {
      const previewDraftSectionData: DraftSectionPreviewData = {
        id: draftData.id,
        name: draftData.name,
        type: draftData.type,
        order: draftData.order,
        content: draftData.content,
      };
      iframeRef.current.contentWindow.postMessage(
        {
          type: "preview:update",
          payload: previewDraftSectionData,
        },
        "*"
      );
    }
  }, [draftData]);

  const zoomScale = zoom / 100;

  return (
    <div className="flex flex-col border rounded-md ">
      <div className="flex items-center justify-between py-2 px-4 border-b bg-muted/40">
        <div className="flex items-center gap-4">
          <Select
            value={size}
            onValueChange={(value) => setSize(value as PreviewSize)}
          >
            <SelectTrigger className="px-0 gap-1 border-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(SIZE_PRESETS).map((size) => (
                <SelectItem key={size} value={size}>
                  {size[0].toUpperCase() + size.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              className="w-20 border rounded px-2 py-1 text-sm"
              value={selectedSize.width}
              onChange={(e) =>
                setCustomSize({
                  ...customSize,
                  width: Number(e.target.value),
                })
              }
              placeholder="Width"
              disabled={size !== "custom"}
            />
            <X className="text-muted-foreground h-5 w-5" />
            <Input
              type="number"
              className="w-20 border rounded px-2 py-1 text-sm"
              value={selectedSize.height}
              onChange={(e) =>
                setCustomSize({
                  ...customSize,
                  height: Number(e.target.value),
                })
              }
              placeholder="Height"
              disabled={size !== "custom"}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <Select
              value={zoom.toString()}
              onValueChange={(value) => setZoom(Number(value))}
            >
              <SelectTrigger className="px-0 gap-1 border-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[25, 50, 75, 100, 125, 150, 175, 200].map((z) => (
                  <SelectItem key={z} value={z.toString()}>
                    {z}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-4">
          <a
            href={previewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
            title="Open in new tab"
          >
            <SquareArrowOutUpRight className="h-4 w-4 mr-1" />
          </a>
        </div>
      </div>

      <div className="flex-1 bg-muted flex p-4 overflow-hidden">
        <div
          style={{
            width,
            minWidth: width,
            height,
            transform: `scale(${zoomScale})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            ref={iframeRef}
            src={previewPath + "?preview=true"}
            width={width}
            height={height}
            className="rounded-md border shadow-lg bg-white pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
