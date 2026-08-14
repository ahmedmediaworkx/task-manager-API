# Task Manager API

An Express and TypeScript REST API for private projects and tasks. It uses PostgreSQL through Prisma, JWT bearer authentication, Zod validation, Swagger UI, and Vitest integration tests.

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Set `DATABASE_URL` in `.env` to an existing PostgreSQL database and replace `JWT_SECRET` with at least 32 random characters. The API runs at `http://localhost:3000`, Swagger UI at `http://localhost:3000/docs`, and health status at `http://localhost:3000/health`.

Seed login: `demo@example.com` / `DemoPass123!`. This account is intended only for local development.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with reload |
| `npm run build` | Compile TypeScript into `dist` |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Run ESLint |
| `npm test` | Run integration tests |
| `npm run db:migrate` | Create/apply a development migration |
| `npm run db:seed` | Insert local sample data |

Tests require a separate PostgreSQL database. Set `DATABASE_URL` to that database while running `npx prisma db push` and `npm test`; never point tests at a database containing valuable data because each test clears all application tables.

## API

Authentication routes are `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, and `GET /api/v1/auth/me`. Send the returned token as `Authorization: Bearer <token>`.

Projects support list, create, read, update, and delete at `/api/v1/projects`. Tasks are created and listed under `/api/v1/projects/:projectId/tasks`, then read, updated, and deleted at `/api/v1/tasks/:taskId`. Task lists accept `status`, `priority`, `search`, `page`, `limit`, `sort`, and `order` query parameters. Resources are private to their owner; access by another user returns `404`.
