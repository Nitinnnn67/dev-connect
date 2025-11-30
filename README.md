# dev-connect

# DevConnect

**Build Smarter Teams. Faster.**

> DevConnect is a full‑stack, student-friendly developer collaboration platform. It helps developers and students create profiles, discover and match with teammates by skill compatibility, form teams, chat in real time, manage simple project tasks, and showcase completed projects. This README explains the project deeply — architecture, data models, APIs, matching logic, frontend behavior (including GSAP animations for landing), setup, deployment and future enhancements.

---

## Table of Contents

1. Project Summary
2. Key Features
3. Tech Stack
4. System Architecture (high level)
5. Data Models (MongoDB Schemas)
6. Matching Algorithm — Detailed Explanation
7. API Endpoints (core)
8. Frontend Behavior & Landing Page (GSAP notes)
9. Real-time Chat (Socket.io) Flow
10. Authentication & Security
11. Development Setup (local)
12. Deployment Checklist
13. Testing Strategy
14. Roadmap & Future Enhancements
15. Project Presentation / Demo Tips
16. Credits & License

---

## 1) Project Summary

DevConnect is designed to solve a common problem for students and junior developers: **finding right teammates** for college or open-source projects. Instead of random group formation, DevConnect suggests teammates and projects based on skill compatibility and preferences. It includes a public animated landing page (GSAP), user profiles, project creation, a skill‑matching engine, team join requests, simple task board capability, and Socket.io powered chat for teams.

This README documents the full project so you never forget what and why you built.

---

## 2) Key Features (What the app does)

* Public Landing Page with GSAP scroll animations (before login/register)
* User registration/login (JWT based auth)
* Developer Profile: skills, bio, links (GitHub/LinkedIn), availability
* Create Project Posts: title, desc, requiredSkills, membersNeeded, tags
* Skill Match Engine: shows compatibility % and common skills
* Suggest Users for Projects and Suggest Projects for Users
* Join Project flow (request/accept)
* Project Dashboard: members, tasks (To Do / In Progress / Done)
* Real‑time team chat using Socket.io
* Trending teams / Featured developers preview on landing
* Optional: AI Skill Suggestion via Gemini API (hook to generate suggested skills from project description)

---

## 3) Tech Stack

* **Frontend:** plain HTML5, CSS3, Vanilla JavaScript (+ GSAP for animations and ScrollTrigger)
* **Backend:** Node.js + Express
* **Database:** MongoDB (Atlas for production)
* **Realtime:** Socket.io (WebSocket layer via the same Node server)
* **Auth:** JWT tokens, bcrypt for passwords
* **Hosting / Deployment:** Render/Railway (backend), Netlify/Vercel for static assets or serve from Express static; MongoDB Atlas
* **Optional AI:** Gemini API (for skill suggestion)

Notes: Project intentionally uses plain HTML/CSS/JS (no React) to keep code simple and understandable for college submission.

---

## 4) System Architecture (High level)

```
[Browser (landing + client pages)] <--> [Express Server (REST API + Socket.io)] <--> [MongoDB]
                                       |
                                       --> [Gemini API (optional)]
```

* Single Node process handles REST endpoints and Socket.io.
* Static files served from `/public` (landing + client pages). Frontend uses fetch() to call APIs.
* Matching logic implemented in backend utility (skillMatch.js) and exposed via endpoints.

---

## 5) Data Models (MongoDB Schemas)

Below are simplified Mongoose schema outlines and explanation for each field.

### `User` schema

```js
{
  _id: ObjectId,
  name: String,
  email: String, // unique
  password: String, // hashed
  bio: String,
  skills: [String],
  github: String,
  linkedin: String,
  availability: String, // e.g., "part-time", "weekends"
  projectsJoined: [ObjectId],
  createdAt: Date
}
```

### `Project` schema

```js
{
  _id: ObjectId,
  title: String,
  description: String,
  requiredSkills: [String],
  createdBy: ObjectId, // userId
  members: [ObjectId],
  status: String, // "open" | "ongoing" | "completed"
  createdAt: Date
}
```

### `Message` schema (chat)

```js
{
  _id: ObjectId,
  projectId: ObjectId,
  senderId: ObjectId,
  text: String,
  createdAt: Date
}
```

### `Task` schema (simple task board)

```js
{
  _id: ObjectId,
  projectId: ObjectId,
  title: String,
  description: String,
  status: String, // "todo" | "inprogress" | "done"
  assignee: ObjectId,
  createdAt: Date
}
```

---

## 6) Matching Algorithm — Detailed Explanation

This is the core differentiator. The idea: compute a **compatibility score** between a project and a user (or between two projects) based on skills and optionally other signals.

### Simple baseline algorithm (easy & explainable)

1. Normalize both lists: lowercasing, trimming, and removing duplicates.
2. `commonSkills = intersection(userSkills, projectSkills)`
3. `baseScore = commonSkills.length / projectSkills.length` (fraction of project requirements the user satisfies)
4. Optionally boost score by: user experience, availability match, past contributions.
5. `finalScore = baseScore * 100` → show percentage.

**Example:** projectSkills = [node, express, react, mongodb] (4)
userSkills = [node, react, css] → common = [node, react] (2)
`baseScore = 2/4 = 0.5` → 50% match

### Advanced option (TF-IDF / Cosine Similarity)

* Build text blobs from skills + project description → vectorize using CountVectorizer or TF-IDF (server side using a small Python microservice or JS lib).
* Compute cosine similarity between user skill text and project text. This captures partially matching words and synonyms (e.g., "mongo" vs "mongodb").

### Hybrid approach (recommended)

* Use baseline common-skill percentage for UI (fast & explainable).
* For ranking/sorting across many users/projects, optionally compute cosine similarity offline and store the score in a cache for faster ranking.

**Edge cases:**

* Projects with 0 requiredSkills: treat as generic and match more liberally.
* Synonyms & aliases: maintain a small skill alias map (`react.js` -> `react`) to normalize.

---

## 7) API Endpoints (Core)

> All endpoints under `/api` prefix. Use Authorization: `Bearer <token>` for protected routes.

### Auth

* `POST /api/auth/register` → {name,email,password} => returns token
* `POST /api/auth/login` → {email,password} => returns token
* `GET /api/auth/me` → returns current user profile

### Users

* `GET /api/users/:id` → get public user profile
* `PUT /api/users/:id` → update profile (protected)

### Projects

* `POST /api/projects` → create project (protected)
* `GET /api/projects` → list projects (with filters & pagination)
* `GET /api/projects/:id` → project detail
* `POST /api/projects/:id/join` → request to join (adds user to members or push to request list)
* `GET /api/projects/:id/suggest-users` → returns top matched users with score (internal matching util)

### Matching (optional dedicated)

* `GET /api/match/user/:userId` → returns suggested projects for user
* `GET /api/match/project/:projectId` → returns suggested users for project

### Chat

* Chat uses Socket.io for real-time messaging, but saving messages uses:

  * `POST /api/projects/:id/messages` → save a message to DB
  * `GET /api/projects/:id/messages` → fetch recent messages

### Tasks

* `POST /api/projects/:id/tasks` → create task
* `PUT /api/tasks/:taskId` → update task
* `GET /api/projects/:id/tasks` → list tasks for project

---

## 8) Frontend Behavior & Landing Page (GSAP notes)

**Landing Page (public view)**

* Uses GSAP + ScrollTrigger for animated entrance of sections:

  * Hero text: staggered fade-up
  * Floating developer cards: subtle loop animation (`gsap.to` y oscillation)
  * Features: staggered reveal on scroll
  * Timeline (How it works): pinned scroll with step reveal
* Implement smooth scrolling and responsive breakpoints.

**Logged-in experience**

* Dashboard fetches `/api/projects` and shows suggestions and created projects.
* Project page requests `/api/projects/:id/suggest-users` to show match score for each potential member.
* Join button sends `POST /api/projects/:id/join` and shows toast.

UX Tips:

* Show match percentage visually (circular progress or badge)
* Use tooltip to show which skills are common

---

## 9) Real-time Chat (Socket.io) Flow

1. Client connects: `socket.emit('joinRoom', { projectId, token })`
2. Server validates token, joins socket to `room:projectId`
3. Sending message: `socket.emit('sendMessage', { projectId, text })`
4. Server broadcasts `io.to(room).emit('receiveMessage', message)` and also saves message to MongoDB
5. On client mount, fetch last 50 messages via REST and then listen for real-time `receiveMessage` events

Best practice: keep messages small, and use pagination for history. Use optimistic UI for fast feel.

---

## 10) Authentication & Security

* Hash passwords with `bcrypt` (salt rounds 10)
* Use JWT tokens with reasonable expiry (e.g., 7 days) and store tokens in `localStorage` or secure HTTP-only cookie (better for production)
* Validate input (express-validator) on all routes
* Sanitize user inputs to prevent XSS (especially when saving project descriptions)
* Rate limit auth endpoints to prevent brute force

---

## 11) Development Setup (Local)

### Prerequisites

* Node.js (v18+) and npm
* MongoDB (local) or MongoDB Atlas

### Environment variables (`.env`)

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/devconnect
JWT_SECRET=some_super_secret_key
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=... (optional)
```

### Install & Run (backend)

```bash
cd server
npm install
npm run dev   # uses nodemon => starts server:5000
```

### Frontend

Static files in `/public`. Open `public/index.html` or serve via Express static middleware:

```js
app.use(express.static(path.join(__dirname, '..', 'public')))
```

---

## 12) Deployment Checklist

* Create MongoDB Atlas cluster and update `MONGO_URI`
* Deploy backend to Render / Railway / Heroku (env variables set)
* Serve static frontend via the same Express server or deploy to Netlify/Vercel
* Setup CORS whitelist for production client URL
* Set up domain and SSL (Render/Netlify handle SSL by default)

---

## 13) Testing Strategy

* Unit tests for matching util (skillMatch.js) using Jest
* API integration tests using Supertest
* Manual E2E test flows for register → create project → match → join
* Load test chat with k6 for many socket connections (optional)

---

## 14) Roadmap & Future Enhancements

* Skill alias normalization & synonyms map
* ML-backed matching via embeddings (semantic matching of descriptions)
* GitHub OAuth to import repositories & contribution graph
* In-app code editor for quick collab (Monaco editor) + live share
* Task timers, notifications, calendar integration
* Mobile app using React Native / Flutter

---

## 15) Project Presentation / Demo Tips

* Start with the animated landing page (GSAP) — shows polish
* Show quick flow: Register → Create Project → Suggested Users (match score) → Join → Chat
* Show one example where two users have 80% match and explain how it computed
* Prepare a short 2‑3 minute recorded demo (~screen recording with voiceover)

---

## 16) Credits & License

* Built by: [Your Name]
* Libraries: Express, Mongoose, bcrypt, jsonwebtoken, Socket.io, GSAP
* License: MIT (or specify your preferred license)

---

If you want, I can now:

* generate `server/models/*.js`, `routes/*.js`, and `server.js` starter files,
* generate frontend `public/index.html`, CSS and JS (with GSAP skeleton),
* or create a deployable `.env.example` and `Procfile` for Render.

Bol de bhai — mai jo bhi chahiye uska code bhi ready kar dunga.
