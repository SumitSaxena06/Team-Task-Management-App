TaskFlow — Project & Task Management App

A full-stack MERN application for project management with role-based access control.

Features ==

**Authentication** — JWT-based signup/login with secure password hashing
**Role-Based Access** — Admin (full access) and Member (project-scoped) roles
**Project Management** — Create, edit, delete projects with team members
**Task Tracking** — Create tasks, assign to members, track status (Board + List views)
**Dashboard** — Stats, progress bars, recent activity
**Settings** — Update profile and change password
**Filters** — Search and filter tasks by status, priority, and project


## Tech Stack

| Layer    | Tech                            |
|----------|---------------------------------|
| Frontend | React 18, React Router v6       |
| Backend  | Node.js, Express.js             |
| Database | MongoDB + Mongoose              |
| Auth     | JWT + bcryptjs                  |
| Styling  | Custom CSS (dark theme)         |
| HTTP     | Axios                           |

---

## Project Structure

```
taskflow/
├── server/                  # Express API
│   ├── config/
│   ├── controllers/         # authController, projectController, taskController, userController
│   ├── middleware/          # auth.js (JWT, RBAC), validate.js
│   ├── models/              # User, Project, Task schemas
│   ├── routes/              # auth, projects, tasks, users
│   ├── index.js             # App entry point
│   └── .env.example
│
├── client/                  # React app
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/        # ProtectedRoute
│       │   ├── layout/      # AppLayout, Sidebar
│       │   ├── projects/    # ProjectModal, AddMemberModal
│       │   └── tasks/       # TaskCard, TaskModal
│       ├── context/         # AuthContext
│       ├── pages/           # Dashboard, Projects, Tasks, Users, Settings, Login, Register
│       ├── styles/          # globals.css, layout.css
│       └── utils/           # api.js (axios instance)
│
├── package.json             # Root scripts (concurrently)
├── .gitignore
└── README.md

