---
sidebar_position: 1
title: Creating a Story
---

# Creating a Story

Only **administrators** can create new stories. Each story acts as a container for multiple sections (text, image, chart, video, etc.) and can be saved as draft or published when ready.

---

## How to Create a Story

### 1. Go to the Stories page

From the sidebar, click **“Stories”**, or use the shortcut card on the dashboard homepage.  
You will be redirected to:  
`/admin/dashboard/stories`

---

### 2. Choose how to create your story

At the top, you'll find two buttons:

- **`New Story`**:  
  Opens a blank form to manually define the story metadata (title, slug, etc.)

- **`Generate Story Template`**:  
  Automatically creates a new story with predefined structure and several ready-to-edit sections (e.g., intro, chart, media).  
  Ideal for quickly starting with a layout example.

---

### 3. Fill in story details

Complete the form fields:

- **Title**: Required. The name of your story.
- **Created by**: Required. Your name.
- **Slug** Required: URL identifier 

---

### 4. Create the story

Click the `Save draft` button.  
You’ll be redirected to the story page, where you can begin adding sections.

---

## Story Metadata Status

Each story has one of the following **metadata states**, shown in the story list:

| Status     | Meaning                                                                 |
|------------|-------------------------------------------------------------------------|
| `draft`    | Story metadata is only available in preview mode. Nothing is published. |
| `published`| Metadata is visible in both preview and live (public API).              |
| `changed`  | Metadata has been updated (e.g. title or slug), but the changes are not yet published.|

> This status refers **only to the story metadata** (title, slug, created by).  

---

## Section Publication vs. Story Publication

A story can be marked as **published**, but still have **no published sections**.

In that case:
- The story URL will be accessible publicly.
- But it will appear **empty** on the front end until at least one section is published.