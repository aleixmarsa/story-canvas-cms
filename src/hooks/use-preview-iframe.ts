// hooks/use-preview-iframe.ts
import { useEffect, useRef } from "react";

export function usePreviewIframe(deps: unknown[] = []) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    iframeRef.current = window.parent?.document.querySelector(
      'iframe[src*="/preview/"]'
    );
  }, deps);

  return iframeRef;
}
