---
sidebar_position: 3
title: Previewing Stories
---

# Live Preview

StoryCanvas includes a **live preview panel** that allows you to instantly see how your story will look as you build or edit it. This helps validate layout, content, animation, and style in real time.

![Live preview](/img/live-preview.webp)

---

## Where You Can Preview

The preview panel is integrated into various parts of the editor:

### Create Section

- Live preview panel can be shown/hided using the show/hide button at the top right.
- Renders the **entire story** with the section you’re currently creating appended at the end.

### Sections List

- Live preview panel can be shown/hided using the show/hide button at the top right.
- Shows the full story.
- Reflects real-time updates when **reordering** sections by dragging and dropping them.

### Edit Section

- Live preview panel can be shown/hided using the show/hide button at the top right.
- Available when editing an existing section.
- Updates live as you change the form (content, style, animation).

---

## Preview Controls

The preview panel includes several tools for testing responsiveness and layout:

| Feature         | Description                                                        |
|-----------------|--------------------------------------------------------------------|
| Device Presets | Switch between `Desktop`, `Tablet`, `Mobile`, or `Custom` viewports |
| Custom Size    | Manually set the preview's height and width                       |
| Zoom           | Adjust the zoom level to fit your screen                          |
| Open in New Tab| Launch the full preview in a new browser tab                      |

All versions reflect live updates instantly.

---

## Real-Time Sync with BroadcastChannel API

To keep the preview always in sync:

- The CMS uses the [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) API.
- Whenever you change a section or reorder content, a message is sent to the preview panel.
- This works **across browser tabs** as well so the external preview window stays updated in real time.

> No need to manually refresh, just build, and see it live.

---

## Notes

- Animations, media, and layout behave the same as in the final published version.
- Preview does not require resaving or reloading, changes appear as you type.
