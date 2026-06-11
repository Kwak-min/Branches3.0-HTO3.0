# BRANCHES Neon Lab Structure Guide

## Current repo shape

The repository currently exposes two top-level application directories:

- `frontend/`
- `backend/`

The frontend checkout is incomplete relative to a normal source tree:

- `frontend/dist/` exists and contains the already bundled application output.
- `frontend/docs/` exists for project notes.
- `frontend/node_modules/` exists in the snapshot.
- `frontend/src/` is missing in the current checkout.
- `frontend/package.json` was missing before this lab work and has been added only to support the standalone lab page.

The backend boundary remains unchanged:

- `backend/src/`
- `backend/uploads/`
- `backend/package.json`
- `backend/package-lock.json`

## Added standalone lab files

These files were added for the local educational neon lab:

- `frontend/index.html`
- `frontend/package.json`
- `frontend/assets/branches-lab.css`
- `frontend/assets/branches-lab.js`
- `frontend/docs/branches-neon-lab-structure-guide.md`

## What the lab does

The standalone page provides:

- four challenge cards
- a final challenge that requires the exact flag `BRANCHES{NEON_ROOT}`
- progress and score tracking
- hint toggles
- separate feedback for empty, malformed, and incorrect answers
- a mission-complete panel
- an on-page structure guide that reflects the current repo layout

All challenge logic runs in the browser and stores progress in `localStorage`. No backend integration was added.

## Run commands

From the repository root:

```bash
npm --prefix frontend run build
```

For a local dev server:

```bash
npm --prefix frontend run start
```

The added frontend package builds into `frontend/lab-dist/` so the existing `frontend/dist/` bundle remains untouched.

## Boundary notes

- `frontend/dist/` was treated as existing bundled output and left unchanged.
- `backend/` was not modified.
- The new lab is a standalone static surface intended to coexist with the current repo snapshot rather than replace the original bundled frontend.
