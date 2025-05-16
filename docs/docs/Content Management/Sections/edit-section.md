---
sidebar_position: 2
title: Editing a Section
---

# 📝 Editing a Section

**Editors** and **administrators** are allowed to create sections.  
Each section has its own **draft/published** workflow.

---

## How to Edit a Section

### 1. Open the story

Go to `/admin/dashboard/stories`, then click on the story containing the section you want to edit.

---

### 2. Locate the section

In the list of sections, find the section you want to edit.

Click the **three-dot menu (···)** on the section row and select **`Edit`**.

---

### 3. Edit using the tabbed form

The section editor has three tabs:

### Content

- Update the **name**, content fields (text, chart data, image, etc.), and see your changes reflected live.

### Style

Customize visual appearance using CSS-like properties:

- Padding and margin
- Background color or image
- Layout alignment
- 
### Animation


Configure optional animations:

- Animation type (e.g. fade in, slide up)
- Trigger on scroll using ScrollTrigger (powered by GSAP)
- Additional properties: `start`, `end`, `scrub`, `pin`, etc.

> Fields dynamically appear based on whether scroll-based animation is enabled.

---

## Live Preview

While editing, the section is rendered in real time using the [Live Preview](../preview) 

- Live preview panel can be shown/hided using the show/hide button at the top right.
- Changes are reflected instantly as you fill in the form.
- This allows testing of layout, animation, and style without publishing.

---

## Section Status

Each section has one of the following **states**, shown in the sections list:

| Status     | Meaning                                                                 |
|------------|-------------------------------------------------------------------------|
| `draft`    | Section is only available in preview mode. Nothing is published. |
| `published`| Section is visible in both preview and live (public API).              |
| `changed`  | Section data has been updated (e.g. content, style, animation), but the changes are not yet published. he preview and the published version will be different |

---