![Banner image](/Banner.png)
# Whoops
> A real-time collaborative document editor with role-based access control, rich text editing, and version history.

Full-stack real-time collaborative editor built with **Next.js**, **Express**, **Prisma**, and **Redis**, enabling seamless document editing, team collaboration, and scalable productivity workflows.


![Whoops](https://img.shields.io/badge/Whoops-Document%20Editor-2563EB?style=for-the-badge&logo=files&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)


---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Contributing](#contributing)

---

## Description

Whoops is a full-stack collaborative document editing platform built for teams. It supports real-time multi-user editing powered by **Yjs** and **WebSockets**, rich text formatting via **Tiptap**, and a complete document management system with role-based permissions. Users can sign in via Google, GitHub, or email OTP, create and manage documents, invite collaborators, and see live cursor presence of other users in real time.

---

## Features

- **Authentication** — Google OAuth, GitHub OAuth, and passwordless Email OTP login
- **Rich Text Editor** — Powered by Tiptap with support for headings, bold, italic, lists, colors, and more
- **Real-time Collaboration** — Live co-editing with Yjs + WebSocket, with per-user cursor presence and labels
- **Collaborator Management** — Invite users by email, assign EDITOR or VIEWER roles, remove collaborators
- **Role-Based Access Control** — OWNER, EDITOR, and VIEWER roles with instant permission propagation via Yjs awareness
- **Document Versioning** — Binary Yjs state stored per save in `DocumentVersion`, with automatic cleanup keeping the latest 20 versions
- **Auto-save** — Content is debounced and saved automatically as you type
- **Dark / Light Mode** — Full theme support with CSS variables
- **Dashboard** — Separate views for owned and shared documents with inline scrollable lists
- **Profile Management** — Update name, upload profile photo, delete account
- **Email Notifications** — Invite emails sent on collaborator addition
- **Scheduled Cleanup** — Cron job runs every 12 hours to prune old document versions

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework with SSR and routing |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Tiptap | Rich text editor |
| Yjs | CRDT-based real-time collaboration |
| y-websocket | WebSocket provider for Yjs |
| NextAuth.js | Authentication (OAuth + Credentials) |
| Axios | HTTP client |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Express.js | REST API server |
| TypeScript | Type safety |
| Prisma | ORM for database access |
| PostgreSQL (Supabase) | Relational database |
| Redis | OTP storage and session caching |
| y-websocket | WebSocket server for Yjs collaboration |
| node-cron | Scheduled jobs |
| Nodemailer | Email delivery |
| Winston | Logging |
| JSON Web Tokens | API authentication |

---

## Project Structure
```
Whoops/
├── client/                          # Next.js frontend application
│   ├── .next/                       # Next.js build output and cached files
│   ├── app/                         # App Router pages, layouts, and route segments
│   ├── components/                  # Reusable React UI components
│   ├── config/                      # Client-side configuration files
│   ├── context/                     # React context providers (e.g., ToastContext)
│   ├── node_modules/                # Installed frontend dependencies
│   ├── public/                      # Static assets served directly (images, icons, etc.)
│   ├── types/                       # Shared TypeScript types/interfaces
│   ├── utils/                       # Helper utilities (axios, collaboration logic, etc.)
│   ├── .env.local                   # Local development environment variables
│   ├── .env.prod                    # Production environment variables
│   ├── .gitignore                   # Files ignored by Git version control
│   ├── .prettierignore              # Files ignored by Prettier formatter
│   ├── .prettierrc                  # Prettier configuration rules
│   ├── eslint.config.mjs            # ESLint configuration for linting code
│   ├── next-env.d.ts                # Type definitions generated by Next.js
│   ├── next.config.ts               # Next.js framework configuration
│   ├── package-lock.json            # Exact dependency versions for npm installs
│   ├── package.json                 # Frontend project metadata and dependencies
│   ├── postcss.config.mjs           # PostCSS configuration (used by TailwindCSS)
│   ├── README.md                    # Frontend documentation
│   └── tsconfig.json                # TypeScript configuration for the frontend
│
├── server/                          # Express backend application
│   ├── config/                      # Backend configuration (Prisma, Redis, Logger, WebSocket)
│   ├── controllers/                 # Request handlers that process API requests
│   ├── middleware/                  # Express middleware (auth, validation, etc.)
│   ├── node_modules/                # Installed backend dependencies
│   ├── prisma/                      # Prisma schema and database files
│   ├── repositories/                # Data access layer interacting with the database
│   ├── routes/                      # API route definitions and endpoint mappings
│   ├── services/                    # Business logic layer used by controllers
│   ├── utils/                       # Backend helper utilities
│   ├── worker/                      # Background workers for async jobs
│   ├── .env                         # Backend environment variables (DB, secrets)
│   ├── .gitignore                   # Backend Git ignore rules
│   ├── .prettierignore              # Files ignored by Prettier
│   ├── .prettierrc                  # Prettier configuration
│   ├── dump.rdb                     # Redis snapshot database file
│   ├── index.ts                     # Entry point that starts the Express server
│   ├── package-lock.json            # Exact dependency versions for backend npm installs
│   ├── package.json                 # Backend project metadata and dependencies
│   ├── prisma.config.ts             # Prisma client configuration
│   └── tsconfig.json                # TypeScript configuration for the backend
│
├── Banner.png                       # Project banner used in documentation
└── README.md                        # Main project documentation and overview
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database (or a [Supabase](https://supabase.com) project)
- Redis instance (local or [Upstash](https://upstash.com))
- Google and/or GitHub OAuth app credentials

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Whoops.git
cd Whoops
```

### 2. Install dependencies
```bash
# server
cd server
npm install

# client
cd ../client
npm install
```

### 3. Set up environment variables

Create `.env` files in both `server/` and `client/` — see [Environment Variables](#environment-variables) below.

### 4. Run database migrations
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### 5. Start the redis server
```bash
# server (from /server)
redis-server
```

### 6. Start the development servers
```bash
# server (from /server)
npm run dev

# client (from /client)
npm run dev
```

The client runs at `http://localhost:3000` and the server at `http://localhost:8000`.

---

## Environment Variables

### server — `server/.env`

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Connection pooling (transaction mode) — for runtime queries | `postgresql://user:pass@host:5432/Whoops?pgbouncer=true` |
| `DIRECT_URL` | Session mode pooler — for migrations | `postgresql://user:pass@host:5432/Whoops` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for signing JWTs | `your-secret-key` |
| `PORT` | Port for the Express server | `8000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | client base URL for CORS and email links | `http://localhost:3000` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username / email address | `you@gmail.com` |
| `SMTP_PASS` | SMTP password or app password | `your-app-password` |

### client — `client/.env.local`

| Variable | Description | Example |
|---|---|---|
| `NEXTAUTH_URL` | Base URL of the Next.js app | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | `your-nextauth-secret` |
| `NEXT_PUBLIC_API_URL` | server API base URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_WEBSOCKET_URL` | WebSocket server URL | `ws://localhost:8000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-secret` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `your-github-client-id` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `your-github-secret` |

---

## API Routes

### Auth — `/api/v1/auth`

| Method | Name | Route | Description |
|---|---|---|---|
| `POST` | Register | `/api/v1/auth/register` | Register or sign in a user via OAuth |
| `POST` | Send OTP | `/api/v1/auth/send-otp` | Send a one-time password to an email address |
| `POST` | Email auth | `/api/v1/auth/email`  | Verify OTP and return a JWT token |

### Documents — `/api/v1/document`

| Method | Name | Route | Description |
|---|---|---|---|
| `GET` | Get all documents | `/api/v1/document` | Fetch all documents owned by the authenticated user |
| `GET` | Get shared documents | `/api/v1/document/shared` | Fetch all documents shared with the authenticated user |
| `GET` | Get document | `/api/v1/document/:id` | Fetch a single document with latest version content and user role |
| `POST` | Create document | `/api/v1/document` | Create a new document |
| `PATCH` | Update document | `/api/v1/document/:id` | Update document title and/or description |
| `PATCH` | Save content | `/api/v1/document/:id/save` | Save a new Yjs binary snapshot as a document version |
| `DELETE` | Delete document | `/api/v1/document/:id` | Delete a document and all its versions |

### Collaborators — `/api/v1/document/:id/collaborators`

| Method | Name | Route | Description |
|---|---|---|---|
| `GET` | Get collaborators | `/api/v1/document/:id/collaborators` | Fetch all collaborators (including owner) for a document |
| `POST` | Invite collaborator | `/api/v1/document/:id/invite` | Invite a user by email with a specified role |
| `PATCH` | Update role | `/api/v1/document/:documentId/collaborators/:documentUserId` | Update a collaborator's role |
| `DELETE` | Remove collaborator | `/api/v1/document/:id/collaborators/:documentUserId` | Remove a collaborator from a document |

### User — `/api/v1/user`

| Method | Name | Route | Description |
|---|---|---|---|
| `GET` | Get profile | `/api/v1/user/profile` | Fetch the authenticated user's profile |
| `PATCH` | Update profile | `/api/v1/user/profile` | Update the authenticated user's name |
| `PATCH` | Update avatar | `/api/v1/user/profile/image` | Update the authenticated user's profile photo |
| `DELETE` | Delete account | `/api/v1/user/profile` | Permanently delete the user's account and all associated data |

### Health — `/api/v1/health`

| Method | Name | Route | Description |
|---|---|---|---|
| `GET` | Health check | `/api/v1/health` | Returns server status, uptime, memory, and system information |

---

## Contributing

Contributions are welcome! Here's how to get started:

### 1. Fork the repository

Click the **Fork** button at the top right of this page.

### 2. Create a feature branch
```bash
git checkout -b feat/your-feature-name
```

### 3. Commit your changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```bash
git commit -m "feat: add document search"
git commit -m "fix: resolve collaborator role sync issue"
git commit -m "chore: update dependencies"
```

### 4. Push and open a Pull Request
```bash
git push origin feat/your-feature-name
```

Then open a Pull Request against the `main` branch. Please include a clear description of what your PR does and why.

### Guidelines

- Keep PRs focused — one feature or fix per PR
- Write clean, typed TypeScript — avoid `any` where possible
- Follow the existing folder structure and naming conventions
- Test your changes locally before submitting

---

<div align="center">

Made with ❤️ by [Vaibhav Walde](https://github.com/Vaibhav-Walde)

</div>