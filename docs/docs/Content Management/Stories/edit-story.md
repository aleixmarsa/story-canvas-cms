---
sidebar_position: 2
title: Editing a Story
---

# Editing a Story

**Editors** and **administrators** can update the **metadata** of existing stories, such as the title, slug, or created by. These changes affect how the story is presented and accessed but do **not** include the content sections.

> ⚠️ Editors **cannot create or delete stories**. Only admins can perform those actions.

---

## How to Edit a Story

### 1. Go to the Stories page

Navigate to `/admin/dashboard/stories` by clicking **“Stories”** in the sidebar.

---

### 2. Open the action menu

In the list of stories, locate the one you want to edit.  
Click the **three dots (···)** at the right end of the row to open the **action menu**.

---

### 3. Click "Edit"

From the dropdown, select **`Edit`**.  
This will open the story editor page.

---

### 4. Modify metadata fields

You can update:

- **Title**
- **Slug**
- **Created by**

Save changes by clicking  `Save draft` button in the header.
Or publish them by clicking `Publish Story Metadata`

---

## Story Metadata Status

Each story has one of the following **metadata states**, shown in the story list:

| Status     | Meaning                                                                 |
|------------|-------------------------------------------------------------------------|
| `draft`    | Story metadata is only available in preview mode. Nothing is published. |
| `published`| Metadata is visible in both preview and live (public API).              |
| `changed`  | Metadata has been updated (e.g. title or slug), but the changes are not yet published. |

> This status refers **only to the story metadata** (title, slug, created by).  


---

## Section Publication vs. Story Publication

A story can be marked as **published**, but still have **no published sections**.

In that case:
- The story URL will be accessible publicly.
- But it will appear **empty** on the front end until at least one section is published.