import type { SelectedNode, Playback, Event, Gallery } from "@/types";
import { writable } from "svelte/store";

export const events = writable<Event[]>([]);
export const gallery = writable<Gallery[]>([]);
export const selectedNode = writable<SelectedNode>();
export const selectedPlaybackDate = writable("");
export const playbackVideos = writable<Playback[]>([]);
export const convertedVideos = writable([]);

export const hoveredCamera = writable("");
export const activeCamera = writable("");

// export const fullscreen = writable(false);
// export const leftPaneHide = writable(true);
// export const topPanelHide = writable(false);
// export const alertPanelHide = writable(true);

export const fullscreen = persistedWritable("fullscreen", false);
export const leftPaneHide = persistedWritable("leftPaneHide", true);
export const topPanelHide = persistedWritable("topPanelHide", true);
export const alertPanelHide = persistedWritable("alertPanelHide", true);

function persistedWritable(key: string, defaultValue: boolean) {
  let value = defaultValue;

  // Check if running in a client environment
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(key);
    value = storedValue ? JSON.parse(storedValue) : defaultValue;
  }

  const store = writable(value);

  // Subscribe to store changes and update localStorage only if in client
  if (typeof window !== "undefined") {
    store.subscribe((newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  }
  return store;
}
