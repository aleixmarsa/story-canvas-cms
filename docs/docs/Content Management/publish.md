---
sidebar_position: 4
title: Publishing Stories & Sections
---

# Publishing Stories & Sections

In StoryCanvas, both **story metadata** and **sections** follow a **draft–published** model.  
This ensures that you can work on changes safely without affecting the live version until you're ready to publish.

---

## Publishing Story Metadata

Story metadata includes:

- Title
- Slug
- Created by

### How to publish it:

Stories can be published in two different ways:

- Option A
  - Go to the the story list in `/admin/dasboard/stories`, click on the **three-dot menu (···)** and select **`Publish Metadata`**

- Option B
  -  Go to the the story list in `/admin/dasboard/stories`, click on the **three-dot menu (···)** and select **`Edit`** in `/admin/dashboard/stories`)
  - Make your changes
  - Click the **`Publish Metadata`** button in the top-right corner of the page

> This publishes only the metadata — not the sections. he story URL will be accessible publicly, but it will appear **empty** on the front end until at least one section is published.

You’ll see the story status change from `draft` or `changed` to `published`.


---

## Publishing Sections

Each section also has its own publishing status.

You can publish a section from **two places**:

### Option 1: From the Edit Section page

1. Click `Edit` on a section from the story page
2. Make your changes
3. Click the `Publish` button in the top header

### Option 2: From the section list (story view)

1. Open a story
2. In the section list, open the **action menu (···)** next to the section
3. Click `Publish`

> A published section becomes visible in the **public API and frontend** immediately.

---

##  Publishing the Entire Story

To make the **entire story** publicly visible (both metadata and sections):

- Go to the story editor
- Make sure your metadata is ready
- Click the **`Publish Story`** button at the top right

This is a shortcut that publishes:

- The current **story metadata**
- All **sections** that are in a `changed` or `draft` state
