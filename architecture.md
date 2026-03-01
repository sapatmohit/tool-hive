# ToolHive Architecture

**Simplified Layered Architecture**

## Overview

ToolHive is a frontend-only (Phase 1) Next.js 16 + TypeScript + Tailwind CSS application.
Data is served from local JSON files via an abstract service layer, designed for zero-friction swap to a REST API in Phase 2. All components, services, and contexts are structured functionally in a flattened `src` folder without module boundaries.

---

## Folder Structure

```
tool-hive/
├── app/                          ← Next.js App Router (pages only)
│   ├── layout.tsx                — Root layout: AuthProvider + Navbar
│   ├── page.jsx                  — Home page
│   ├── browse/page.jsx           — /browse
│   ├── tool/[id]/page.jsx        — /tool/:id
│   ├── my-tools/page.jsx         — /my-tools
│   ├── requests/page.jsx         — /requests
│   └── borrowed/page.jsx         — /borrowed
│
├── src/
│   ├── components/               ← GLOBAL UI LAYER (Components only)
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ToolCard.jsx
│   │   ├── ToolForm.jsx
│   │   ├── SearchBar.jsx
│   │   └── ... (all reusable & standalone components)
│   │
│   ├── services/                 ← SERVICE LAYER (API interactions only)
│   │   ├── apiClient.js          — Abstract fetch (swap for axios in P2)
│   │   ├── browseService.js
│   │   ├── toolsService.js
│   │   └── requestService.js
│   │
│   ├── context/                  ← STATE LAYER
│   │   └── AuthContext.jsx       — Mock auth context
│   │
│   └── data/                     ← MOCK DATA LAYER
│       ├── tools.json
│       ├── users.json
│       └── requests.json
│
├── architecture.md               ← This file
└── README.md
```

---

## Layers

### 1. UI Layer (`src/components/`)
> **Single source of truth for all UI.**

| Component | Purpose |
|-----------|---------|
| `Navbar` | Top nav — Logo, search, nav links, profile |
| `Button` | 5 variants: primary, secondary, outline, ghost, danger |
| `Card` | Base card shell with hover effect |
| `Modal` | Accessible overlay with Escape key + backdrop |
| `Input` | Styled input with label, prefix/suffix, error |
| `Badge` | Status/category pill — 6 variants |
| `Avatar` | Image or initials fallback — 5 sizes |
| `Container` | Max-width响应式 wrapper |
| `EmptyState` | Illustrated empty placeholder |
| `Loader` | Spinner + SkeletonCard |

### 2. Service Layer (`src/services/`)
All data access flows through services only:

```
Component → Service → apiClient → JSON (P1) / REST API (P2)
```

**`apiClient.js`** is the single integration point for P2 migration.

### 3. Data Layer (`src/data/`)
Mock JSON files for Phase 1. Files are never imported directly by components — only by service files via `apiClient`.

### 4. App Layer (`app/`)
Next.js App Router pages. Pages import from `src/components/` and `src/services/` only. No business logic lives here.

---

## Code Rules

### ✅ Allowed
- Components may freely import other components from `@/components/`
- `app/` pages import from `@/components/` and `@/services/`

### ❌ Forbidden
- Components must **never** import directly from `@/data/`
- `app/` pages must **never** contain business logic

---

## Team Workflow

| Role | Controls |
|------|---------|
| Architect | `src/shared/`, `app/layout.tsx`, `architecture.md` |
| Dev 1 | `src/modules/browse/` + `app/browse/`, `app/tool/[id]/` |
| Dev 2 | `src/modules/tools/` + `app/my-tools/` |
| Dev 3 | `src/modules/requests/` + `app/requests/`, `app/borrowed/` |

---

## Backend Integration (Phase 2)

**Only these files change — components are untouched:**

1. `src/services/apiClient.js` — swap `import()` for `axios`
2. `src/services/*.js` — update endpoints if needed
3. `src/context/AuthContext.jsx` — replace mock user with real auth

All `app/` pages and `src/components/` remain unchanged.
