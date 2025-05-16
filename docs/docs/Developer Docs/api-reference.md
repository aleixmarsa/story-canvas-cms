---
sidebar_position: 3
title: API Reference
---

# API Reference

StoryCanvas exposes a RESTful API that allows developers to access and integrate content programmatically. Authentication is required for most routes unless otherwise specified.

> Explore the Swagger API documentation:  
> [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)

---

## Authentication

To access protected routes, request a token via:

### `POST /api/auth/token`


> You can also use session-based cookies by logging in via the CMS interface.

---

## Stories

### `GET /api/stories`

Get all stories (requires session or token)

---

### `GET /api/stories/draft`

Get all draft stories (requires session or token)

---

### `GET /api/stories/published`

Get all published stories (public)

---

### `GET /api/stories/{id}`

Get a single story by ID (requires session or token)

---

## Sections

### `GET /api/stories/{id}/sections`

Get all sections of a story (requires session or token)

---

### `GET /api/stories/draft/{id}/sections`

Get all draft sections of a story (requires session or token)

---

### `GET /api/stories/published/{id}/sections`

Get all published sections of a story (public)

---

## Notes

- All protected endpoints support authentication via:
  - Bearer token (`Authorization: Bearer <token>`)
  - Session cookie

- Public endpoints **do not require authentication**

- Query parameters such as `?orderBy=createdAt&order=desc` are supported on some endpoints

