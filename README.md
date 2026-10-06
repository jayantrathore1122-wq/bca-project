# InstaClone Lite

A much simpler version of InstaClone — same core features (register, login, post photos,
like, comment, follow, feed, explore, search, profile), but with a dramatically simpler
setup:

| | Original (MERN) | Lite |
|---|---|---|
| Database | MongoDB (install or Atlas account) | A plain `data/db.json` file — nothing to install |
| Servers to run | 2 (backend + React dev server) | 1 |
| `npm install` | Twice (backend, frontend) | Once |
| Frontend | React (build tooling) | Plain HTML/CSS/JS — no build step |
| Ports | 5000 + 3000 | 3000 only |

## How to run it

```bash
cd instaclone-lite
npm install
npm start
```

Then open **http://localhost:3000** in your browser. That's the whole setup — no database
to install, no `.env` file required, no second terminal.

Register a couple of accounts (open a second browser tab or an incognito window for the
second one) to try posting, liking, commenting, following, and searching.

## How data is stored

All data (users, posts, likes, comments) lives in `data/db.json`, which is created
automatically the first time you run the app. Uploaded images are saved to the `uploads/`
folder. This is intentionally simple — fine for learning and local use, but a real
multi-user deployment would use a proper database instead (see "Going further" below).

## Project structure

```
instaclone-lite/
├── server.js          # Express app entry point (serves API + frontend)
├── db.js              # Tiny JSON-file "database" (replaces MongoDB)
├── middleware/
│   ├── auth.js         # JWT verification
│   └── upload.js       # Multer image upload config
├── routes/
│   ├── auth.js          # register, login, me
│   ├── posts.js         # create, feed, explore, like, comment, delete
│   └── users.js         # profile, follow/unfollow, search
├── public/             # Frontend: plain HTML/CSS/JS, no build step
│   ├── index.html
│   ├── style.css
│   └── app.js
├── data/db.json        # Auto-created on first run
└── uploads/            # Uploaded images saved here
```

## What's the same as the original

- JWT authentication with bcrypt password hashing
- RESTful API design (same endpoint shapes as the MERN version)
- Image upload via Multer
- The same core feature set: posts, likes, comments, follow/unfollow, feed, explore, search

## What's different under the hood

- **MongoDB → JSON file.** `db.js` loads `data/db.json` into memory on startup and saves
  it back to disk after every write. No schema library (Mongoose) needed.
- **React → vanilla JS.** `public/app.js` uses `fetch()` to call the API directly and
  swaps which `<div>` is visible, instead of React components and a build step.
- **Two servers → one.** Express serves both the API (`/api/...`) and the static frontend
  (`public/`) from a single port, so there's no CORS configuration and no proxy setup.

## Going further

This simplified version is great for learning and local use. If you wanted to move toward
a production-style setup later, the natural next steps (in order of effort) are:

1. Swap `db.js` for a real database (SQLite is the smallest step up; MongoDB/Postgres for
   more scale) — the route files would barely change since they already isolate data
   access into a small number of functions.
2. Add input validation (e.g., with `zod` or `express-validator`).
3. Move image storage to a cloud service (Cloudinary/S3) instead of the local `uploads/`
   folder.
4. Reintroduce React (or another frontend framework) if the UI grows complex enough to
   benefit from componentization.
