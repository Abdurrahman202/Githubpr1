# TaskFlow — Full-Stack Technical Assessment

A Trello-like task management application built for the Software Engineer Intern technical assignment.

## Architecture

```text
frontend/   Next.js + React + Bootstrap + CSS
backend/    Node.js + Express + MongoDB + JWT + bcrypt
```

## Core assignment behavior

- Three workflow columns: To Do, Doing, Done
- Drag-and-drop task status updates
- Status changes persist through the API/database
- Normal users register and can manage their own work
- Normal users may only self-assign tasks
- Administrator is created by seeding, not public registration
- Admin can see users/tasks and assign/reassign tasks
- Passwords are hashed with bcrypt
- Authorization is enforced on the backend

## Start locally

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed:admin
npm run dev
```

### Frontend

Create `frontend/.env.local` from `.env.local.example`, then:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database

Use local MongoDB or MongoDB Atlas and set `MONGODB_URI` in `backend/.env`.

## Admin account

The admin credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`. Change the sample password before any real deployment.
