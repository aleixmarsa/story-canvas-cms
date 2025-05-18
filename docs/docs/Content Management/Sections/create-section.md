---
sidebar_position: 1
title: Creating Sections
---

# Creating a Section

Each story in StoryCanvas is composed of multiple sections, which can represent content blocks such as text, images, charts, or videos. Sections are fully modular and configurable.
**Editors** and **administrators** are allowed to create sections.  

---

## How to Create a Story

### 1. Open a story

From the story list (`/admin/dashboard/stories`), click on the story where you want to add a section.

This opens the story editor page.

---

### 2. Click "New Section"

At the top right of the story editor, click the **`New Section`** button.

This opens the **section creation form**.

---

### 3. Choose a section type

You'll be prompted to select the **type of section** you want to create.

Available types may include:
- Text
- Image
- Chart
- Video

> The form will adapt based on the type you select.

---

## Section Editor Structure

The form is divided into **three tabs**:

### 1. Content

- **Name**: Internal name for organizing the section.
- **Created By**: Automatically filled with the current user.
- **Content Fields**: Vary depending on section type (e.g. rich text, image URL, chart data).

---

### 2. Style

Customize visual appearance using CSS-like properties:

- Padding and margin
- Background color or image
- Layout alignment

---

### 3. Animation

Configure optional animations:

- Animation type (e.g. fade in, slide up)
- Trigger on scroll using ScrollTrigger (powered by GSAP)
- Additional properties: `start`, `end`, `scrub`, `pin`, etc.

> Fields dynamically appear based on whether scroll-based animation is enabled.

---

## Live Preview

While creating, the section is rendered in real time using the [Live Preview](../preview) 
- Live preview panel can be shown/hided using the show/hide button at the top right.
- Changes are reflected instantly as you fill in the form.
- This allows testing of layout, animation, and style without publishing.

## Section Status

Each section has one of the following **states**, shown in the sections list:

| Status     | Meaning                                                                 |
|------------|-------------------------------------------------------------------------|
| `draft`    | Section is only available in preview mode. Nothing is published. |
| `published`| Section is visible in both preview and live (public API).              |
| `changed`  | Section data has been updated (e.g. content, style, animation), but the changes are not yet published. he preview and the published version will be different |

---