import { useEffect, useRef } from "react";
import { PreviewMessage } from "@/types/live-preview";

export function usePreviewChannel(onMessage?: (msg: PreviewMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel("preview");
    channelRef.current = channel;

    if (onMessage) {
      channel.onmessage = (event) => {
        onMessage(event.data);
      };
    }

    return () => {
      channel.close();
    };
  }, [onMessage]);

  const sendMessage = (message: PreviewMessage) => {
    channelRef.current?.postMessage(message);
  };

  return { sendMessage };
}
