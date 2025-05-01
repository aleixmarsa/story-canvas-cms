# Story Canvas – Roadmap & Feature Tracker

This document outlines the current state and remaining tasks of the headless CMS project.

## Completed Features

### General
- Authentication
- Admin setup flow
- Route protection middleware
- Role-based access control (admin/editor)

### Database Schema (Prisma)
- `User` model with `role` (`admin`, `editor`)
- `Story` and `StoryVersion` with version control (`draft`, `published`)
- `Section` and `SectionVersion` using the same versioning strategy
- Bidirectional relations between entities and their versions (`currentDraft`, `publishedVersion`)
- Metadata fields: `createdBy`, `lockedBy`, `lastEditedBy`, `publishedAt`

### Backend (API Routes)

#### `Auth`
- `POST /api/auth/login` → authenticate user
- Middleware verifies session for protected routes

#### `User`
- `POST /api/users` → create a new user (admin only)
- `GET /api/users` → list all users (admin only)

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

### Frontend (Dashboard)
- Story list using `DataTable`
- StoryVersion creation/edit form (title, slug, createdBy, etc.)
- SectionVersion edit form with dynamic field rendering
- Zod validation integrated with `react-hook-form`
- Zustand store for `stories`, `sections`, `selectedStory`, `selectedSection`
- Navigation by slug and state-driven rendering
- Reusable UI components: `DashboardHeader`, `Sidebar`, `FormButtons`, `FormErrorMessage`
- Version status (`draft` / `published`/`changed`) with badges
- Publish and save button for `StoryVersion` and `SectionVersion` UI
- User management panel (list + create user form)
- Toast notifications for all forms
- Full CRUD UI with role-based access
- Live preview system (e.g., `/preview/[slug]`)
- Add section order using drag and drop

### 🛠️ Other Improvements
- Unit/API tests (middleware, auth, entities)
- GitHub Actions CI pipeline
- Tags and changelog management
- Add first E2E tests with Playwright

---

## Pending Features (TODO)

### Backend
- `GET /api/section-versions/:id` → fetch full version info for editing

### Frontend
- Confirmation dialogs before publish
- Support version `comment` field when publishing or duplicating
- Version history viewer per Story and Section

### Other Improvements
- Permission/lock control using `lockedBy`
- Story duplication interface
- Autosave mechanism for draft versions

