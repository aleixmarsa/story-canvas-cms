# 🪶 Story Canvas – Roadmap & Feature Tracker

This document outlines the current state and remaining tasks of the headless CMS project.

## ✅ Completed Features

### 🧠 Database Schema (Prisma)
- `Story` and `StoryVersion` with version control (`draft`, `published`)got 
- `Section` and `SectionVersion` using the same versioning strategy
- Bidirectional relations between entities and their versions (`currentDraft`, `publishedVersion`)
- Metadata fields: `createdBy`, `lockedBy`, `lastEditedBy`, `publishedAt`

### 🧩 Backend (API Routes)

#### `Story`
- `POST /api/stories` → create a new story + initial draft version
- `GET /api/stories` → list all stories including currentDraft and publishedVersion
- `GET /api/stories/:id` → get full story detail with all versions
- `PATCH /api/stories/:id` → update metadata (e.g., `lockedBy`, `publicSlug`)
- `POST /api/story-versions/:id/publish` → publish a version and create new draft
- `PATCH /api/story-versions/:id` → update the contents of a version
- `POST /api/story-versions/:id/duplicate` → manual version cloning

#### `Section`
- `POST /api/sections` → create a section with initial draft version
- `GET /api/stories/:id/sections` → list all sections of a story (with currentDraft)
- `PATCH /api/section-versions/:id` → update content and metadata
- `POST /api/section-versions/:id/publish` → publish and create new draft
- `PATCH /api/sections/:id` → update metadata (e.g., `lockedBy`)

### 🖼️ Frontend (Dashboard)
- Story list using `DataTable`
- StoryVersion creation/edit form (title, slug, createdBy, etc.)
- Zod validation integrated with `react-hook-form`
- Zustand store for `stories`, `sections`, `selectedStory`, `selectedSection`
- Navigation by slug and state-driven rendering
- Reusable UI components: `DashboardHeader`, `Sidebar`, `FormButtons`, `FormErrorMessage`
- Edit Section page with schema-aware dynamic forms
- Publish and save button for `StoryVersion` and `SectionVersion` UI
- Display version status (`draft` / `published`/`changed`) with badges

### 🛠️ Other Improvements
- Add unit/API tests
- Add Github Actions
---

## 🔜 Pending Features (TODO)

### 🌏 General
- 🔜 Authentication

### 🧩 Backend
- 🔜 `GET /api/section-versions/:id` → fetch full version info for editing

### 🖼️ Frontend
- 🔜 Full CRUD UI for sections
- 🔜 Live preview system (e.g., `/preview/[slug]`)
- 🔜 Confirmation dialogs before publish
- 🔜 Support version `comment` field when publishing or duplicating
- 🔜 Version history viewer per Story and Section

### 🛠️ Other Improvements
- 🔜 Permission/lock control using `lockedBy`
- 🔜 Story duplication interface
- 🔜 Autosave mechanism for draft versions


