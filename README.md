# 🚀 Task Manager API

<p align="center">
  <strong>A production-ready, containerized REST API for managing private projects and tasks.</strong>
</p>

<p align="center">
  Built with <strong>Node.js · TypeScript · Express · PostgreSQL · Prisma · Docker</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-docker">Docker</a> •
  <a href="#-ci-cd">CI/CD</a>
</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge\&logo=express\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Production-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

</p>

---

## 🧠 What Is This?

**Task Manager API** is a backend service designed around a simple but realistic problem:

> **Manage projects and tasks securely while keeping every user's data isolated.**

The API provides authentication, private project/task management, advanced task querying, database migrations, API documentation, integration testing, and a production-oriented Docker setup.

This project is intentionally built closer to a **real-world backend service** than a basic CRUD tutorial.

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration
* Secure login
* JWT Bearer authentication
* Current authenticated user endpoint
* Owner-based resource isolation
* Protected project and task routes

### 📁 Project Management

* Create projects
* List owned projects
* Retrieve a project
* Update projects
* Delete projects
* Projects are isolated by authenticated user

### ✅ Task Management

* Create tasks
* Update tasks
* Delete tasks
* Retrieve individual tasks
* Filter by status
* Filter by priority
* Search tasks
* Pagination
* Sorting
* Due-date filtering

### 🗄️ Database

* PostgreSQL
* Prisma ORM
* Prisma migrations
* Seed support
* Relational data modeling

### 🧪 Quality

* TypeScript type safety
* Zod request validation
* Vitest integration tests
* ESLint
* Type checking

### 📚 API Documentation

* OpenAPI documentation
* Swagger UI
* Interactive API exploration

### 🐳 DevOps & Containerization

* Multi-stage Docker build
* Production runtime image
* Docker Compose environment
* PostgreSQL health checks
* Dedicated migration container
* API health endpoint
* GitHub Actions CI/CD
* GitHub Container Registry publishing

---

# 🏗️ Architecture

The project follows a clean containerized architecture:

```text
                        ┌─────────────────────┐
                        │       Client        │
                        │  Postman / Frontend │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │     Express API     │
                        │     :3000           │
                        └──────────┬──────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
                  ▼                ▼                ▼
             ┌─────────┐     ┌─────────┐      ┌──────────┐
             │  Auth   │     │Projects │      │  Tasks   │
             │  JWT    │     │         │      │          │
             └─────────┘     └─────────┘      └──────────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │    Prisma     │
                           │      ORM      │
                           └───────┬───────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │  PostgreSQL   │
                           │      :5432    │
                           └───────────────┘
```

### Docker Compose Flow

```text
docker compose up
        │
        ▼
┌───────────────────┐
│    PostgreSQL     │
│   Health Check    │
└─────────┬─────────┘
          │ healthy
          ▼
┌───────────────────┐
│      migrate      │
│ prisma migrate    │
│      deploy       │
└─────────┬─────────┘
          │ exit 0
          ▼
┌───────────────────┐
│        API        │
│     Express       │
│      :3000        │
└───────────────────┘
```

The API only starts after PostgreSQL is healthy and Prisma migrations complete successfully.

---

# 🛠️ Tech Stack

| Layer            | Technology                |
| ---------------- | ------------------------- |
| Runtime          | Node.js 22                |
| Language         | TypeScript                |
| Framework        | Express 5                 |
| Database         | PostgreSQL 17             |
| ORM              | Prisma 6                  |
| Validation       | Zod                       |
| Authentication   | JWT                       |
| Documentation    | OpenAPI / Swagger UI      |
| Testing          | Vitest                    |
| Containerization | Docker                    |
| Orchestration    | Docker Compose            |
| CI/CD            | GitHub Actions            |
| Registry         | GitHub Container Registry |

---

# 🚀 Quick Start

## Prerequisites

Make sure you have:

* Docker Desktop
* Docker Compose
* Git

Clone the repository:

```bash
git clone https://github.com/ahmedmediaworkx/task-manager-api.git

cd task-manager-api
```

---

## ⚙️ Environment Configuration

Create a `.env` file:

```env
POSTGRES_USER=task_manager
POSTGRES_PASSWORD=change-this-password
POSTGRES_DB=task_manager
POSTGRES_PORT=5432

JWT_SECRET=replace-with-at-least-32-random-characters
JWT_EXPIRES_IN=1h

PORT=3000
```

> ⚠️ Never commit `.env` files or production secrets to Git.

---

# 🐳 Run With Docker

Start the complete stack:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

You should have:

```text
database
migrate
api
```

View API logs:

```bash
docker compose logs -f api
```

---

## 🌐 Service URLs

| Service         | URL                          |
| --------------- | ---------------------------- |
| 🚀 API          | http://localhost:3000        |
| 📚 Swagger UI   | http://localhost:3000/docs   |
| ❤️ Health Check | http://localhost:3000/health |
| 🐘 PostgreSQL   | localhost:5432               |

Open Swagger:

```text
http://localhost:3000/docs
```

---

# 🛑 Stop The Environment

Stop containers while keeping database data:

```bash
docker compose down
```

Remove containers **and PostgreSQL volume**:

```bash
docker compose down --volumes
```

> ⚠️ Removing the volume permanently deletes the local PostgreSQL data.

---

# 📦 Docker Image

The project uses a **multi-stage Docker build** to keep the production image smaller and separate build dependencies from runtime dependencies.

Build the production image:

```bash
docker build \
  --tag task-manager-api:local \
  --target runtime \
  .
```

The runtime container expects:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=replace-with-at-least-32-random-characters
JWT_EXPIRES_IN=1h
PORT=3000
NODE_ENV=production
```

---

# 🗃️ Database Migrations

Database migrations are handled by Prisma.

The Docker environment uses a dedicated migration service:

```bash
prisma migrate deploy
```

The migration container waits for PostgreSQL to become healthy before applying migrations.

The API starts only when the migration process exits successfully.

This prevents the application from starting against an uninitialized database.

---

# 🔌 API Reference

Base URL:

```text
http://localhost:3000/api/v1
```

## 🔐 Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login`    | Authenticate user   |
| `GET`  | `/auth/me`       | Get current user    |

---

## 📁 Projects

| Method   | Endpoint               | Description          |
| -------- | ---------------------- | -------------------- |
| `GET`    | `/projects`            | List user's projects |
| `POST`   | `/projects`            | Create project       |
| `GET`    | `/projects/:projectId` | Get project          |
| `PATCH`  | `/projects/:projectId` | Update project       |
| `DELETE` | `/projects/:projectId` | Delete project       |

---

## ✅ Tasks

| Method   | Endpoint                     | Description        |
| -------- | ---------------------------- | ------------------ |
| `GET`    | `/projects/:projectId/tasks` | List project tasks |
| `POST`   | `/projects/:projectId/tasks` | Create task        |
| `GET`    | `/tasks/:taskId`             | Get task           |
| `PATCH`  | `/tasks/:taskId`             | Update task        |
| `DELETE` | `/tasks/:taskId`             | Delete task        |

---

# 🔑 Authentication

After registration or login, the API returns an access token.

Send it using the standard Bearer authentication scheme:

```http
Authorization: Bearer <token>
```

Example:

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

# 🔎 Task Querying

The task endpoint supports advanced querying capabilities including:

```text
Filtering
Searching
Pagination
Sorting
Status
Priority
Due dates
```

Example:

```http
GET /api/v1/projects/:projectId/tasks?page=1&limit=20&status=TODO&sortBy=dueDate&order=asc
```

This makes the API suitable for clients such as:

* Web dashboards
* Mobile applications
* Admin panels
* Project management tools
* CLI clients

---

# 📚 Swagger / OpenAPI

Interactive API documentation is available through Swagger UI:

```text
http://localhost:3000/docs
```

Swagger allows you to:

* Explore endpoints
* Inspect request schemas
* Inspect response schemas
* Authenticate using JWT
* Execute requests directly from the browser

---

# 💻 Local Development Without Docker

You can also run the API directly on your machine.

### Requirements

* Node.js 20+
* PostgreSQL 14+

Install dependencies:

```bash
npm install
```

Configure your `.env` with a local PostgreSQL connection:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/task_manager?schema=public
JWT_SECRET=replace-with-at-least-32-random-characters
JWT_EXPIRES_IN=1h
PORT=3000
```

Create the database schema:

```bash
npx prisma migrate dev --name init
```

Seed sample data:

```bash
npm run db:seed
```

Start development mode:

```bash
npm run dev
```

---

# 🧰 NPM Scripts

| Command               | Purpose                              |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start development server with reload |
| `npm run build`       | Compile TypeScript                   |
| `npm start`           | Run compiled application             |
| `npm run typecheck`   | Run TypeScript type checking         |
| `npm run lint`        | Run ESLint                           |
| `npm test`            | Run integration tests                |
| `npm run db:generate` | Generate Prisma Client               |
| `npm run db:migrate`  | Create/apply development migration   |
| `npm run db:seed`     | Insert sample data                   |

---

# 🧪 Testing

Run the integration test suite:

```bash
npm test
```

Tests require a **separate test database**.

> ⚠️ Never point the test environment at a database containing important data.

---

# 🔄 CI/CD

GitHub Actions automatically builds and publishes the Docker image to **GitHub Container Registry**.

Workflow:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Build
   ├── Docker Build
   ├── Metadata
   └── Push
         │
         ▼
      GHCR
```

Workflow file:

```text
.github/workflows/publish-image.yml
```

---

# 📦 GitHub Container Registry

Published image:

```text
ghcr.io/ahmedmediaworkx/task-manager-api
```

Pull the latest image:

```bash
docker pull ghcr.io/ahmedmediaworkx/task-manager-api:latest
```

### Supported Tags

The workflow generates multiple useful tags:

```text
latest
<commit-sha>
1.0.0
1.0
1
<branch>
```

---

## 🚢 Release A Version

Create a semantic version tag:

```bash
git tag v1.0.0
```

Push it:

```bash
git push origin v1.0.0
```

GitHub Actions will automatically build and publish the release image.

---

# 🔐 Container Registry Authentication

For private packages:

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io \
  -u YOUR_GITHUB_USERNAME \
  --password-stdin
```

GitHub Actions uses the built-in:

```text
GITHUB_TOKEN
```

with:

```yaml
contents: read
packages: write
```

No separate registry password is required for publishing from GitHub Actions.

---

# 🧱 Project Structure

A simplified view of the project:

```text
task-manager-api/
│
├── .github/
│   └── workflows/
│       └── publish-image.yml
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── projects/
│   │   └── tasks/
│   │
│   ├── middleware/
│   ├── lib/
│   ├── routes/
│   └── server.ts
│
├── tests/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🎯 Engineering Goals

This project focuses on more than simply building REST endpoints.

The main engineering goals are:

* 🔐 Secure authentication
* 🧩 Modular API design
* 🗄️ Reliable database migrations
* 🐳 Production-oriented containers
* ❤️ Health-aware service startup
* 🧪 Automated integration testing
* 📚 Self-documented APIs
* 🔄 Automated image publishing
* 📦 Reproducible deployments

---

# 🧠 What This Project Demonstrates

This project demonstrates practical experience across:

```text
Backend Engineering
        ↓
REST API Design
        ↓
Authentication & Authorization
        ↓
Database Modeling
        ↓
Containerization
        ↓
Docker Compose
        ↓
CI/CD
        ↓
Container Registry
```

It's designed as a **Cloud / DevOps-oriented backend project**, not just a CRUD API.

---

# 📌 Production Considerations

Before deploying to production, make sure to:

* Use a managed PostgreSQL service
* Generate strong random secrets
* Store secrets in a secret manager
* Use HTTPS/TLS
* Configure proper CORS policies
* Configure production logging
* Add centralized monitoring
* Add rate limiting
* Configure backups
* Pin production image versions instead of relying only on `latest`

---

# 👨‍💻 Author

**Ahmed Wael (Abomorad)**

Cloud / DevOps Engineer focused on:

```text
AWS
Linux
Docker
Terraform
CI/CD
Cloud Infrastructure
Automation
```

---

<p align="center">

### ⭐ If you found this project useful, consider giving it a star.

</p>

<p align="center">

<strong>Built to learn. Built to ship. Built like production.</strong>

</p>

---
