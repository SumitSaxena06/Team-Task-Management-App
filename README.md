# 🚀 TaskFlow — Project & Task Management App

A full-stack MERN application for project management with role-based access control.

## ✨ Features

- 🔐 **Authentication** — JWT-based signup/login with secure password hashing
- 👥 **Role-Based Access** — Admin (full access) and Member (project-scoped) roles
- 📁 **Project Management** — Create, edit, delete projects with team members
- ✅ **Task Tracking** — Create tasks, assign to members, track status (Board + List views)
- 📊 **Dashboard** — Stats, progress bars, recent activity
- ⚙️ **Settings** — Update profile and change password
- 🔍 **Filters** — Search and filter tasks by status, priority, and project

---

## 🛠️ Tech Stack

| Layer    | Tech                            |
|----------|---------------------------------|
| Frontend | React 18, React Router v6       |
| Backend  | Node.js, Express.js             |
| Database | MongoDB + Mongoose              |
| Auth     | JWT + bcryptjs                  |
| Styling  | Custom CSS (dark theme)         |
| HTTP     | Axios                           |

---

## 📁 Project Structure

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
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
npm run install-all
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Run Development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all accessible projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project (owner/admin) |
| DELETE | `/api/projects/:id` | Delete project (owner/admin) |
| POST | `/api/projects/:id/members` | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks (filtered) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/dashboard/stats` | Dashboard stats |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/search?q=` | Search users |
| PUT | `/api/users/:id/role` | Update role |
| DELETE | `/api/users/:id` | Delete user |

---

## 🔐 Role-Based Access

| Feature | Admin | Member |
|---------|-------|--------|
| View all projects | ✅ | ❌ (own projects only) |
| Create projects | ✅ | ✅ |
| Delete any project | ✅ | ❌ |
| Manage all users | ✅ | ❌ |
| View Users page | ✅ | ❌ |
| Create tasks | ✅ | ✅ (own projects) |
| Assign tasks | ✅ | ✅ (own projects) |

---

## ☁️ Deployment

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Replace `MONGO_URI` with your Atlas connection string

### Backend (Render / Railway / Fly.io)
```bash
# Set env vars in dashboard, then deploy from GitHub
# Build command: cd server && npm install
# Start command: cd server && npm start
```

### Frontend (Vercel / Netlify)
```bash
# Build command: cd client && npm run build
# Output directory: client/build
# Set REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 🐙 Push to GitHub

```bash
cd taskflow
git init
git add .
git commit -m "feat: initial TaskFlow MERN app"
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

---

## 📝 License

MIT
