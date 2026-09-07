# TaskFlow Backend

Express + MongoDB API for the Software Engineer Intern Technical Assignment.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Backend-enforced user/admin authorization
- Task creation, editing, deletion and status changes
- Normal-user assignment restriction
- Admin assignment and reassignment
- Admin user list and statistics
- MongoDB persistence

## Local setup

1. Install Node.js 20+.
2. Start MongoDB locally or create a MongoDB Atlas database.
3. Copy `.env.example` to `.env` and fill in the values.
4. Install dependencies:

```bash
npm install
```

5. Create the required administrator account:

```bash
npm run seed:admin
```

6. Start the API:

```bash
npm run dev
```

API: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## Core endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `PATCH /api/tasks/:id/assign` (admin only)
- `DELETE /api/tasks/:id`
- `GET /api/admin/users` (admin only)
- `GET /api/admin/stats` (admin only)
