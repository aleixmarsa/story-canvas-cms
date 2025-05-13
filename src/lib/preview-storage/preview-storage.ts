const HEARTBEAT_INTERVAL = 2000; // ms
const HEARTBEAT_TTL = 5000; // ms

type PreviewKey = "new-section" | "edit-section" | "sort-sections";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PreviewData<T = any> = {
  data: T;
  timestamp: number;
};

// Set data + refresh heartbeat
export function setPreviewData<T>(key: PreviewKey, data: T) {
  const fullKey = `livePreview-${key}`;
  const heartbeatKey = `heartbeat-${key}`;
  const payload: PreviewData = { data, timestamp: Date.now() };

  localStorage.setItem(fullKey, JSON.stringify(payload));
  localStorage.setItem(heartbeatKey, Date.now().toString());
}

// --- Get data only if heartbeat is recent
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPreviewData = <T = any>(key: PreviewKey): T | null => {
  if (typeof window === "undefined") return null;
  const fullKey = `livePreview-${key}`;
  const heartbeatKey = `heartbeat-${key}`;

  const raw = localStorage.getItem(fullKey);
  const heartbeat = Number(localStorage.getItem(heartbeatKey));

  const isAlive = Date.now() - heartbeat < HEARTBEAT_TTL;

  if (raw && isAlive) {
    try {
      return JSON.parse(raw).data as T;
    } catch {
      return null;
    }
  }

  // Remove stale data
  localStorage.removeItem(fullKey);
  localStorage.removeItem(heartbeatKey);
  return null;
};

// Clear data manually
export const clearPreviewData = (key: PreviewKey) => {
  localStorage.removeItem(`livePreview-${key}`);
  localStorage.removeItem(`heartbeat-${key}`);
};

// Start heartbeat
export const startHeartbeat = (key: PreviewKey): (() => void) => {
  const heartbeatKey = `heartbeat-${key}`;
  const interval = setInterval(() => {
    localStorage.setItem(heartbeatKey, Date.now().toString());
  }, HEARTBEAT_INTERVAL);

  return () => clearInterval(interval);
};
