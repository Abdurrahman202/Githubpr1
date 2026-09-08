# TaskFlow - Full-Stack Task Management App

TaskFlow is a Trello-style task management application built for a Software Engineer Intern technical assessment. It provides role-based authentication, a drag-and-drop task board, persistent task status updates, and an administrator workspace for managing users and task assignments.

## Live Application

- Frontend: https://taskflow-frontend-blue-three.vercel.app
- Backend API: https://taskflow-backend-olive.vercel.app
- Health check: https://taskflow-backend-olive.vercel.app/api/health

## GitHub Repository

https://github.com/Abdurrahman202/Githubpr1

## Technology Stack

### Frontend
- Next.js
- React
- JavaScript
- Bootstrap
- Custom CSS
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs password hashing
- CORS

### Deployment
- Frontend: Vercel
- Backend: Vercel Serverless Functions
- Database: MongoDB Atlas

## Main Features

### Normal User
- Register and log in securely
- View a personal task board
- Create tasks
- View tasks across To Do, Doing, and Done columns
- Drag and drop tasks between workflow columns
- Persist task status changes in MongoDB
- Manage tasks they created or are assigned to
- Self-assign eligible unassigned tasks only to themselves

### Administrator
- Log in using a seeded administrator account
- View all users
- View all tasks
- View system statistics
- Assign tasks to users
- Reassign tasks between users
- Manage task assignments across the system

## Security

- Passwords are hashed with bcrypt before storage
- JWT authentication is used for protected API requests
- Role-based authorization is enforced on the backend
- Administrator accounts are created through a seed script, not public registration
- MongoDB credentials and JWT secrets are stored in environment variables
- Sensitive `.env` files are excluded from Git through `.gitignore`
- CORS restricts browser requests to the configured frontend origin

## Project Structure

```text
Githubpr1/
|-- backend/
|   |-- api/
|   |-- scripts/
|   |-- src/
|   |   |-- config/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- utils/
|   |-- .env.example
|   `-- package.json
|
|-- frontend/
|   |-- app/
|   |   |-- admin/
|   |   |-- dashboard/
|   |   |-- login/
|   |   `-- register/
|   |-- lib/
|   |-- .env.local.example
|   `-- package.json
|
|-- .gitignore
|-- README.md
`-- START-HERE.txt
```

## Local Setup

### Prerequisites

Install:
- Node.js
- npm
- MongoDB locally, or use MongoDB Atlas
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Abdurrahman202/Githubpr1.git
cd Githubpr1
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` using `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace-this-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
ADMIN_NAME=TaskFlow Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-secure-password
```

Seed the administrator account:

```bash
npm run seed:admin
```

Start the backend:

```bash
npm run dev
```

The local API will run at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

### Backend

| Variable | Purpose |
| --- | --- |
| `PORT` | Local backend port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `ADMIN_NAME` | Seeded administrator display name |
| `ADMIN_EMAIL` | Seeded administrator email |
| `ADMIN_PASSWORD` | Seeded administrator password |

### Frontend

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the deployed or local backend API |

## REST API

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a normal user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Return the authenticated user |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get tasks visible to the authenticated user |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update task workflow status |
| DELETE | `/api/tasks/:id` | Delete a task when authorized |
| PATCH | `/api/tasks/:id/assign` | Assign or reassign a task according to role permissions |

### Administrator

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/admin/users` | View all users |
| GET | `/api/admin/stats` | View administrator statistics |

## Deployment

### Backend - Vercel

The backend is deployed from the `backend` directory. Production environment variables include:

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`

MongoDB Atlas Network Access must allow the deployed server to connect. For this assessment deployment, Atlas is configured to accept connections from the deployment environment while database access remains protected by credentials.

### Frontend - Vercel

The frontend is deployed from the `frontend` directory with:

```env
NEXT_PUBLIC_API_URL=https://taskflow-backend-olive.vercel.app/api
```

The backend `FRONTEND_URL` is configured to allow the production frontend origin:

```text
https://taskflow-frontend-blue-three.vercel.app
```

## Testing Checklist

The deployed application should be tested with the following workflow:

1. Register a normal user
2. Log in
3. Create a new task
4. Drag the task from To Do to Doing
5. Drag the task from Doing to Done
6. Refresh the page and confirm the status remains saved
7. Log in as the administrator
8. Confirm all users and tasks are visible
9. Assign or reassign a task
10. Log back in as a normal user and confirm role restrictions remain enforced

## Application Screenshots

The assessment requires screenshots in the README. Before final submission, add clear screenshots of:

- Landing page / authentication screen
- Normal user task board
- Task creation and drag-and-drop board
- Administrator dashboard and task assignment view

For a clean repository, place them under `docs/screenshots/` and embed them in this section.

## Submission Notes

Administrator credentials should be provided only in the required submission text file or directly to the evaluator. Do not publish the administrator password in this public README or commit production secrets to GitHub.

## Assessment Coverage

This project addresses the required areas of the assignment:

- Full-stack frontend and backend separation
- REST API design
- Authentication and backend authorization
- Secure password hashing
- Role-based user and administrator permissions
- MongoDB data persistence
- Drag-and-drop task status management
- Responsive frontend interface
- Online frontend and backend deployment
- Environment-variable based secret management
- Setup and deployment documentation
