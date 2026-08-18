# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

StickModel — a structural wireframe modeling service for building design. Next.js 16 (App Router) full-stack app with Prisma/PostgreSQL, deployed via Docker Compose on a DigitalOcean droplet behind Nginx. Live at https://stickmodel.com.

## Commands

```bash
npm run dev              # start dev server (next dev)
npm run build             # prisma generate && next build — run this to typecheck the whole app
npm run lint               # eslint
npm run db:seed            # tsx prisma/seed.ts
npm run setup               # scripts/setup.js — validates .env, generates Prisma client
npx prisma migrate dev      # create/apply a migration in dev
npx prisma studio            # inspect the database
```

There is no test suite/runner configured in this repo. `scripts/e2e-webhook-test.ts` and `scripts/mock-webhook-server.js` are manual scripts for exercising the outbound file-upload webhook (see `lib/webhook.ts`), not part of an automated suite.

Local Postgres isn't assumed to be running standalone — `docker-compose.yml` is the reference way to run the full stack (app + nginx) against production-shaped config; `DATABASE_URL` in `.env` normally points at the managed DigitalOcean Postgres instance directly for local dev.

## Architecture

**Auth**: Custom JWT-based sessions (`jose`), not NextAuth. `lib/auth.ts` issues a 7-day JWT stored in an httpOnly `session` cookie, containing `{ id, email, name, role }`. `getCurrentUser()` reads it in Server Components/route handlers (via `next/headers`); `getUserFromRequest()` reads it in `middleware.ts` (via `NextRequest`) — use whichever matches the context, they are not interchangeable. `role` is a plain string (`"user" | "admin"`), checked ad hoc rather than via a permissions system.

**Route protection is centralized in `middleware.ts`**, not per-page: it defines `publicPaths` (exact matches) and a blog-specific rule (`/blog` and `/blog/[slug]` are public, `/blog/new` and `/blog/[slug]/edit` require admin). Everything else requires a session; `adminPaths` (`/admin`, `/blog/new`) plus blog-edit paths additionally require `role === 'admin'`. API routes are excluded from the middleware matcher — **every `app/api/**/route.ts` handler must do its own `getCurrentUser()` + role/ownership check**, following the pattern in `app/api/projects/[id]/route.ts` (401 if no user, 403 if wrong owner/role).

**Data model** (`prisma/schema.prisma`): `User` → `Project[]` → `ProjectStep[]`, plus `BlogPost` and `OtpVerification` (invite-request flow). A `Project` has both a top-level deliverable (`userFileUrl`/`adminFileUrl` etc.) and an ordered list of `ProjectStep`s, each with its own user/admin file pair and its own `cost`/`isPaid`/`currency`. Payment gating is manual: non-admin reads of a project strip `adminFileUrl` (project- and step-level) when `cost > 0` and `isPaidInitial`/`isPaid` is false — see the gating block in `app/api/projects/[id]/route.ts` GET. `queueOrder` drives the admin-facing project queue (`app/api/projects/queue`).

**File storage** is DigitalOcean Spaces (S3-compatible, via `@aws-sdk/client-s3`), with `lib/blob.ts` generating deterministic pathnames (`users/{userId}/projects/{projectId}/uploads|responses/{fileName}`). Vercel Blob (`@vercel/blob`, `app/api/blob/upload`) is used as a secondary/backup path. Every user- or admin-side file upload should fire `notifyFileUploadWebhook()` (`lib/webhook.ts`) so an external pipeline is notified — see the `notifyFileUploadWebhook` calls in the projects route for the expected payload shape. The webhook is opt-in (no-op unless `FILE_UPLOAD_WEBHOOK_URL` is set), validates the URL (https required in production, no embedded credentials), HMAC-signs the body with `FILE_UPLOAD_WEBHOOK_SECRET`, and retries with backoff.

**Payments**: two independent providers — PayPal (`app/api/paypal/*`, `@paypal/react-paypal-js`) for USD and PayU (`app/api/payu/*`) for INR, matching the `currency` field on `Project`/`ProjectStep`.

**Email**: Zepto Mail API (`lib/email.ts`), used for admin notifications (file uploads, notes added, project finished) and the OTP-based invite-request signup flow (`lib/otp-store.ts` + `app/api/auth/send-otp`, `app/api/auth/request-invite`). There's no public signup — access is invite/OTP gated.

**3D rendering**: `three` + `@react-three/fiber`/`drei` for wireframe/building model viewers (`components/ModelViewer.tsx`, `components/landing/BuildingModel.tsx`). Model assets are served from `public/models` and are deliberately excluded from the auth middleware matcher.

**UI**: Tailwind v4 + shadcn/radix-ui primitives in `components/ui/`, class-variance-authority + `cn()` (`lib/utils.ts`) for variant composition. `framer-motion`/`gsap` are used for page/nav animation (e.g. `components/CardNav.tsx`).

## Deployment

Deployment is documented in detail in `PRODUCTION_SETUP.md` — read it before touching Docker, Nginx, `.env` structure, or production infra. Summary: build → push image to GHCR → SSH to droplet → `docker compose pull && docker compose up -d`. Never commit `.env`. `docker-compose.yml` env vars are the authoritative list of what production expects to be set.
