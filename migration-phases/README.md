# Migration Phases

This folder converts `STACK_MIGRATION_ASSESSMENT.md` into an executable phase plan for migrating Wabrix from the current Convex/Clerk/Cloudflare/Next.js implementation into the FlowDesk target stack:

- Express.js API
- PostgreSQL + Prisma
- Redis
- BullMQ workers
- Socket.IO realtime
- JWT auth
- React + Vite dashboard
- Docker Compose + Nginx deployment

## Execution Rule

Do not delete the current Convex implementation at the beginning. Keep it as the reference system until the new stack reaches functional parity. The safest migration strategy is a strangler migration:

1. Build the new runtime next to the current system.
2. Port one domain boundary at a time.
3. Verify each migrated flow manually and with tests.
4. Switch the frontend to the new API only after backend contracts stabilize.
5. Remove Convex/Clerk/Cloudflare-specific code only after production-equivalent parity is proven.

## Phase Index

| Phase | Document | Primary Outcome |
|---|---|---|
| 01 | `phase-01-runtime-foundation.md` | Express, worker, Prisma, Redis, Docker, shared package scaffolds exist. |
| 02 | `phase-02-auth-tenancy-rbac.md` | JWT auth, organizations, memberships, and tenant-scoped RBAC replace Clerk behavior. |
| 03 | `phase-03-database-prisma-models.md` | Convex schema is translated into relational Prisma/PostgreSQL models. |
| 04 | `phase-04-bot-studio-knowledge.md` | Bot Studio, AI runtime, knowledge ingestion, and `pgvector` retrieval work on the new backend. |
| 05 | `phase-05-whatsapp-integration-ingress.md` | WhatsApp integration setup and Express webhook ingress replace Cloudflare/Hono ingress behavior. |
| 06 | `phase-06-inbound-orchestrator-outbound.md` | Inbound processing, bot orchestration, media processing, outbound sending, and status reconciliation run through BullMQ. |
| 07 | `phase-07-inbox-realtime-notifications.md` | Inbox APIs, operator actions, notifications, browser push, and Socket.IO realtime are functional. |
| 08 | `phase-08-billing-analytics-limits.md` | Billing checkout, billing webhooks, subscriptions, usage limits, and analytics are ported. |
| 09 | `phase-09-frontend-vite-consolidation.md` | One Vite React dashboard replaces the two Next.js/Convex/Clerk web apps. |
| 10 | `phase-10-cutover-decommissioning.md` | Old stack dependencies are removed after parity, deployment, monitoring, and rollback are proven. |

## Recommended PR Order

1. `chore(runtime): add api worker db shared packages and docker compose`
2. `feat(auth): add jwt auth organizations memberships and rbac`
3. `feat(db): port convex schema to prisma and postgres`
4. `feat(bot): port bot studio and provider runtime`
5. `feat(knowledge): port ingestion and pgvector retrieval`
6. `feat(whatsapp): port integration setup and express ingress`
7. `feat(worker): port inbound bot media outbound workflows`
8. `feat(inbox): add rest inbox api socket realtime and notifications`
9. `feat(billing): port checkout webhooks usage limits analytics`
10. `feat(web): consolidate dashboard into vite api client`
11. `chore(cutover): remove old convex clerk cloudflare next dependencies`

## Global Manual Checkup Requirements

Every phase must end with:

- `pnpm install` if dependencies changed.
- `pnpm lint` or package-specific lint if global lint is temporarily noisy.
- `pnpm typecheck` or package-specific typecheck.
- Relevant unit/integration tests.
- Manual verification steps from the phase document.
- Updated `.env.example` when new env vars are introduced.
- Updated docs when behavior or setup changes.

## Global Blocking Rules

Do not move to the next phase when:

- Tenant isolation is not testable.
- A webhook route accepts invalid signatures in production mode.
- A worker can duplicate external side effects under retry.
- A secret can be returned to the frontend.
- A queue job is the only durable source of truth for a business event.
- A new API shape is not documented or validated.

