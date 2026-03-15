# PulseBeat Workspace

## Overview

PulseBeat is an AI Health Application — a full-stack monorepo using TypeScript, React (Vite), and Express with PostgreSQL.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken + bcrypt)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **File uploads**: multer

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (auth, scan, music, dashboard routes)
│   └── pulsebeat/          # React + Vite frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── render.yaml             # Render.com deployment configuration
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

- User authentication (signup/login/logout)
- Biometric scanning (camera + VitalLens API)
- AI music recommendations based on mood
- Health dashboard with scan history

## API Routes

- `GET /api/healthz` — health check
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — login
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — get current user
- `POST /api/scan/analyze` — analyze biometric scan
- `GET /api/scan/history` — scan history
- `GET /api/music/recommendations` — music recommendations
- `GET /api/dashboard/stats` — dashboard statistics

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned by Replit)
- `SESSION_SECRET` — JWT signing secret
- `VITALLENS_API_KEY` — VitalLens biometric API key (optional)
- `YOUTUBE_API_KEY` — YouTube Data API key (optional)
- `FRONTEND_URL` — Frontend URL for CORS (production)

## Deploy to Render

The project includes a `render.yaml` for one-click deployment to Render.com:
1. Push the code to GitHub
2. Connect the repo in Render.com → "New Blueprint"
3. Set the environment variables: `VITALLENS_API_KEY`, `YOUTUBE_API_KEY`, `FRONTEND_URL`

## Development

- `pnpm --filter @workspace/api-server run dev` — run API server
- `PORT=21708 pnpm --filter @workspace/pulsebeat run dev` — run frontend
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks
- `pnpm --filter @workspace/db run push-force` — push DB schema

## TypeScript

- Always typecheck from the root: `pnpm run typecheck`
- Run codegen after OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen`
