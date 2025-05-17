---
sidebar_position: 2
title: Installation Guide
---

# Installation Guide

StoryCanvas can be installed and run in two different ways:

- **Docker-based setup** (recommended for most users)
- **Local development** with `pnpm` and a local PostgreSQL instance

---

## Option A — Docker Setup (Recommended)

### 1. Clone the repository

```bash
git clone https://github.com/aleixmarsa/story-canvas-cms
cd story-canvas-cms
```

### 2. Configure the environment (Optional)

Add your Cloudinary variables to the `.env.docker` file (copy from `.env.example`) for the full experience.  
> If no Cloudinary variables are provided, image inputs in the section forms will fall back to simple URL inputs.
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_API_KEY=...
NEXT_PUBLIC_CLOUDINARY_PRESET=...
NEXT_PUBLIC_CLOUDINARY_FOLDER=...
CLOUDINARY_API_SECRET=...
```

### 3. Start the project with Docker
```bash
docker-compose up --build
```
- App: http://localhost:3000

- Prisma Studio: http://localhost:5555

- App documentation: http://localhost:3001

> ⚠️ **Note:**  
> The Docker option may take longer to start initially because it runs `next build` and `next start`.  
> This ensures the app runs much faster once it's up, compared to `next dev`, which compiles pages on demand.


---

## Option B — Local development with `pnpm`

### 1. Clone the repository
```bash
git clone https://github.com/aleixmarsa/story-canvas-cms
cd story-canvas
```

### 2. Set up environment variables
Create a .env file by copying the example:
> If no Cloudinary variables are provided, image inputs in the section forms will fall back to simple URL inputs.
```env
DATABASE_URL=...

SESSION_SECRET=...

# Cloudinary account
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_API_KEY=...
NEXT_PUBLIC_CLOUDINARY_PRESET=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_FOLDER=...
```
> ⚠️ **Note:**  
> If you choose this option, make sure you have a local Postgres instance running.

### 3. Install dependencies and start the app
```bash
pnpm install
pnpm dev
```
- App: http://localhost:3000

- Prisma Studio: http://localhost:5555

- App documentation: http://localhost:3001

## Testing

### Unit tests
```bash
pnpm test
```

### E2E tests
```bash
pnpm test:e2e
```

---
