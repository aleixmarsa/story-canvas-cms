import { useEffect, useRef } from "react";
import { PreviewMessage } from "@/types/live-preview";

export function usePreviewChannel(onMessage?: (msg: PreviewMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isChannelClosedRef = useRef(false);
  useEffect(() => {
    const channel = new BroadcastChannel("preview");
    channelRef.current = channel;
    isChannelClosedRef.current = false;

    if (onMessage) {
      channel.onmessage = (event) => {
        onMessage(event.data);
      };
    }

    return () => {
      channel.close();
      isChannelClosedRef.current = true;
    };
  }, [onMessage]);

  const sendMessage = (message: PreviewMessage) => {
    if (!channelRef.current || isChannelClosedRef.current) {
      console.warn("Broadcast channel is closed.");
      return;
    }
    channelRef.current.postMessage(message);
  };

  return { sendMessage };
}
