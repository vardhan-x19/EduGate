# Quiz API Endpoints

## Workflow

1. **Quiz Creation**
   - Teachers create quizzes via `/quizzes/create` (POST, authenticated).
   - Each quiz contains a title, description, topic, difficulty, time limit, questions, and a unique share code.

2. **Quiz Retrieval**
   - Quizzes can be fetched by their MongoDB ID (`/quizzes/:id`) or by share code (`/quizzes/share/:code`).

---

## Endpoints

### Create Quiz
- **URL:** `/quizzes/create`
- **Method:** `POST`
 # EduGate / QuizApp

 A full-stack quiz application (React + TypeScript frontend, Node/Express + TypeScript backend, MongoDB). This README documents the project flow, how to run the app locally, API endpoints, frontend routes, and common troubleshooting notes collected while developing.

 ---

 ## Table of contents

 - Project overview
 - Architecture
 - Getting started
   - Prerequisites
   - Backend
   - Frontend
 - Environment variables
 - Backend API (summary)
 - Frontend routes (summary)
 - Data model (Quiz & User)
 - Common issues & troubleshooting
 - Development tips
 - License

 ---

 ## Project overview

 EduGate (a.k.a. QuizApp) is a learning platform that lets teachers create quizzes and students take them. Key features:

 - Teacher: create quizzes, set time limits and share codes
 - Student: view available quizzes, open quiz by share code or id, take quiz, submit answers, view results
 - Authentication using JWTs

 ---

 ## Architecture

 - frontend/ — React + TypeScript app (Vite)
 - backend/ — Express + TypeScript server
 - MongoDB used for persistence (hosted via Atlas or local)

 ---

 ## Getting started

 ### Prerequisites

 - Node.js (16+ recommended)
 - npm
 - MongoDB (Atlas or local)

 ### Backend

 1. Open a terminal in `backend/`.
 2. Install dependencies:

 ```bash
 cd backend
 npm install
 ```

 3. Create a `.env` file in `backend/` with at least:

 ```
 MONGO_URL=<your mongo connection string>
 JWT_SECRET=<your jwt secret>
 PORT=5000
 ```

 4. Start the backend in development:

 ```bash
 npm run dev
 ```

 The backend listens on port 5000 by default.

 ### Frontend

 1. Open a terminal in `frontend/`.
 2. Install dependencies:

 ```bash
 cd frontend
 npm install
 ```

 3. Start the frontend dev server:

 ```bash
 npm run dev
 ```

 The frontend runs on port 8080 (Vite default in this workspace). API requests are proxied to the backend via CORS configuration.

 ---

 ## Environment variables

 Backend `.env` (example):

 ```
 MONGO_URL=mongodb+srv://root:root@cluster0.mongodb.net/QuizApp?retryWrites=true&w=majority
 JWT_SECRET=supersecret
 PORT=5000
 ```

 Frontend: if you need environment variables, use Vite's `VITE_` prefix. (This project currently uses hard-coded localhost URLs for local development.)

 ---

 ## Backend API (summary)

 Base URL: `http://localhost:5000`

 ### User routes

 - POST `/users/register`
   - Body: `{ name, email, role, password }` (email must end with `@tkrcet.com`)
   - Response: newly created user and token

 - POST `/users/login`
   - Body: `{ email, password }` (email must end with `@tkrcet.com`)
   - Response: user + token (token is set in cookie)

 - GET `/users/profile`
   - Auth required (JWT in cookie or `Authorization: Bearer <token>`)
   - Response: authenticated user's profile

 ### Quiz routes

 - GET `/quiz/all`
   - Returns a normalized array of quizzes in the shape the frontend expects. Each quiz includes:
     - `id` (string), `title`, `description`, `topic`, `difficulty`, `timeLimit`, `questions` (array), `participants`, `creator`, `shareCode`, `icon` (string|undefined), `isPrivate`.

 - GET `/quiz/:id`
   - Returns a single quiz by MongoDB ID. Ensure you call without a leading colon (e.g. `/quiz/64f1a2...`).

 - GET `/quiz/share/:code`
   - Returns a quiz by share code.

 - POST `/quiz/create` (authenticated)
   - Body: quiz fields including `title`, `questions`, `timeLimit`, etc.

 ---

 ## Frontend routes (summary)

 - `/` — Landing or Login depending on auth state
 - `/login` — Login page
 - `/signup` — Signup page
 - `/quiz` — List of quizzes
 - `/quiz/:quizId/play` — Quiz play page
 - `/quiz/:quizId/results` — Quiz results
 - `/create` — Create a quiz (teacher)

 ---

 ## Data model (summary)

 Quiz (important fields):

 ```ts
 {
   _id: ObjectId,
   title: string,
   description?: string,
   topic?: string,
   difficulty?: 'Beginner'|'Intermediate'|'Advanced',
   timeLimit?: number, // minutes
   participants?: number,
   icon?: string, // name token, e.g. 'Code'
   isPrivate?: boolean,
   creator: string,
   questions: [ { questionText, options: string[], correctAnswer: number } ],
   shareCode: string
 }
 ```

 User (summary): stored in `UserModel.ts` — includes bcrypt hashed password and methods for compare/generate JWT.

 ---

 ## Common issues & troubleshooting (collected during development)

 - `req.body` undefined in backend
   - Ensure `app.use(express.json())` is included in backend `index.ts` (it is). Also make sure the client sends `Content-Type: application/json` and uses `POST` (not `GET`) when sending a body.

 - Wrong URL format for fetch-by-id
   - When calling `/quiz/:id` from client or Postman, do NOT include the `:` in the actual request URL. Use `/quiz/64f1a2...`.

 - JWT `invalid signature` or secret undefined
   - Ensure `dotenv.config()` runs before any module that needs `process.env.JWT_SECRET`. The backend `index.ts` must call `dotenv.config()` at the top. Restart the server after changing `.env`.

 - React "Rendered more hooks than during the previous render"
   - This happens if hook calls (useState/useEffect/etc.) are declared conditionally or after an early return — always declare hooks at the top of the component. Also restart the dev server after major hook-order edits to clear HMR state.

 - Frontend expects different quiz shape than backend
   - Normalize shape at the backend (`/quiz/all`) or normalize in frontend after fetch. The project now returns `id` (string) and fields the UI expects.

 ---

 ## Development tips

 - When changing hooks or component signature, stop and restart the dev server to avoid Fast Refresh state mismatches.
 - Prefer returning a stable API shape from the backend (normalize `_id` → `id`, ensure arrays exist).
 - Add small integration smoke tests (curl or node script) for important endpoints like `/quiz/all`.

 ---

 ## Quick commands

 From project root:

 ```bash
 # Backend
 cd backend
 npm install
 npm run dev

 # Frontend (new terminal)
 cd frontend
 npm install
 npm run dev
 ```

 ---

 ## Contributing

 If you'd like help: create an issue with steps to reproduce, include logs and the failing endpoint.

 ---

 ## License

 MIT
