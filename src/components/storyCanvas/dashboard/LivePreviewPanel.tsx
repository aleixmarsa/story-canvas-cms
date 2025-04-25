"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { SectionVersion } from "@prisma/client";

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
      iframeRef.current.contentWindow.postMessage(
        {
          type: "preview:update",
          payload: draftData,
        },
        "*"
      );
    }
  }, [draftData]);

  const zoomScale = zoom / 100;

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b bg-muted/40">
        <div className="flex items-center gap-2">
          {(["desktop", "tablet", "mobile", "custom"] as PreviewSize[]).map(
            (preset) => (
              <Button
                key={preset}
                variant="outline"
                onClick={() => setSize(preset)}
                className={
                  size === preset
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : ""
                }
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </Button>
            )
          )}

          <div className="flex items-center ml-4 gap-1">
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
            <span className="ml-4 text-sm text-muted-foreground">Zoom:</span>
            <Select
              value={zoom.toString()}
              onValueChange={(value) => setZoom(Number(value))}
            >
              <SelectTrigger className="w-[88px]">
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
          <div>
            Previewing: <code>{previewPath}</code>
          </div>
          <a
            href={previewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Open in new tab
          </a>
        </div>
      </div>

      <div className="flex-1 bg-muted flex justify-center items-center overflow-auto p-4">
        <div
          style={{
            width,
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
