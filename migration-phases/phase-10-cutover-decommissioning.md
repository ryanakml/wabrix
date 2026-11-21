# Phase 10: Cutover And Decommissioning

## Goal

Switch the product fully to the new stack, remove old platform dependencies, and prove deployment, monitoring, rollback, and operational safety.

## Current References

- `STACK_MIGRATION_ASSESSMENT.md`
- `migration-phases/*`
- `README.md`
- `environment-and-deployment-guide.md`
- `apps/web`
- `apps/web-2`
- `apps/ingress`
- `packages/backend`
- `turbo.json`
- `.env.example`

## Target Deliverables

- One production-ready web app.
- Express API and BullMQ worker are the active backend.
- PostgreSQL and Redis are the active data/queue infrastructure.
- Convex code is archived or removed.
- Clerk code is removed.
- Cloudflare Worker is removed or explicitly retained only as optional edge ingress.
- Old Next.js API routes are removed.
- Documentation reflects the new stack.
- Docker Compose production path works.
- Rollback plan exists.

## Detailed Tasks

### 1. Verify Functional Parity

Before deleting anything, verify these flows on the new stack:

- register/login/refresh/logout
- create/select organization
- Bot Studio save and preview
- knowledge source add/delete/retrieve
- WhatsApp integration save
- webhook GET verification
- webhook POST inbound processing
- bot reply generation
- outbound send
- status reconciliation
- media processing
- inbox actions
- notifications and realtime
- billing checkout
- billing webhook
- usage limits
- analytics

Create a parity checklist in the PR description or a new doc.

### 2. Decide What Happens To Old Apps

Options:

- Delete old `apps/web` and rename Vite app to `apps/web`.
- Keep old Next app temporarily as `apps/web-legacy`.
- Delete `apps/web-2` after assets and useful components are migrated.

Recommended:

- Keep only one production dashboard.
- Archive old code only if there is a business need.
- Do not keep two dashboards connected to different backends.

### 3. Remove Convex Dependency

Remove or archive:

- `packages/backend/convex`
- `packages/backend/convex/_generated`
- Convex package dependencies
- `npx convex` setup docs
- Convex env vars:
  - `NEXT_PUBLIC_CONVEX_URL`
  - `CONVEX_HTTP_URL`
  - `CONVEX_SHARED_SECRET`
  - `CONVEX_DEPLOYMENT`

Before removal, ensure no imports remain:

```bash
rg "convex|@wabrix/backend/convex|NEXT_PUBLIC_CONVEX_URL|CONVEX_HTTP_URL|CONVEX_SHARED_SECRET"
```

### 4. Remove Clerk Dependency

Remove:

- `@clerk/nextjs`
- `@clerk/backend`
- `@clerk/themes`
- Clerk middleware
- Clerk webhook handling
- Clerk UI components
- Clerk env vars:
  - `CLERK_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`
  - `CLERK_ISSUER_URL`

Before removal, ensure no imports remain:

```bash
rg "clerk|@clerk|CLERK_"
```

### 5. Remove Or Reposition Cloudflare Worker

If Express ingress is the final path:

- remove Wrangler dependency
- remove Cloudflare worker deployment docs
- remove `apps/ingress` Hono code or archive it as `apps/ingress-worker-legacy`

If Cloudflare remains as optional edge ingress:

- document it as an adapter that forwards to Express API
- ensure business processing still happens in API/worker/Postgres
- keep raw event durability invariant documented

### 6. Remove Next.js API Routes

If Vite is final:

- remove Next.js app API routes
- move all server-only logic into Express
- remove `next-intl` middleware if no longer used
- remove Next build assumptions from root docs

Before removal:

```bash
rg "NextResponse|next/server|app/api|next-intl|next.config"
```

### 7. Update Environment Documentation

Update `.env.example` to include only active variables:

- `API_PORT`
- `API_BASE_URL`
- `WEB_ORIGIN`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ENCRYPTION_SECRET`
- `META_APP_SECRET`
- `META_VERIFY_TOKEN`
- `WHATSAPP_GRAPH_API_BASE_URL`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `FIRECRAWL_API_KEY`
- `MEDIA_STORAGE_*`
- `POLAR_*`
- `MIDTRANS_*`
- `WEB_PUSH_*`
- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`
- `VITE_DEFAULT_LOCALE`

Remove stale Convex/Clerk variables.

### 8. Update Docker And Deployment

Production Compose should include:

- API
- worker
- web
- Postgres or managed database connection
- Redis or managed Redis connection
- Nginx

Nginx should route:

- `/` to web
- `/api` to API if using an API prefix
- `/webhooks/whatsapp` to API/ingress
- `/webhooks/billing/*` to API
- Socket.IO path to API with websocket upgrade headers

### 9. Add Observability And Operations

Minimum operational visibility:

- API structured logs.
- Worker structured logs.
- request IDs.
- job IDs.
- queue failure metrics.
- health endpoints.
- readiness endpoints.
- database migration command.
- seed command.
- backup/restore notes for Postgres.
- Redis persistence expectations.

Optional:

- Axiom integration.
- Sentry.
- OpenTelemetry.

### 10. Define Rollback

Rollback plan must state:

- how to stop new API/worker
- how to restore previous deployment
- whether old Convex data remains current or stale
- whether dual-write was used
- whether data backfill is reversible
- how webhook URLs are switched back
- how billing webhook URLs are switched back

If old Convex is not receiving writes during migration, rollback to old stack may lose data written only to Postgres. Call this out explicitly.

### 11. Final Cleanup

Run searches:

```bash
rg "Convex|convex|Clerk|clerk|Cloudflare|wrangler|Hono|next/server|NEXT_PUBLIC_CONVEX|CLERK_"
```

For each remaining result:

- remove it
- update wording
- or document why it remains

## Automated Checks

Run full checks:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
docker compose -f infra/docker-compose.yml build
docker compose -f infra/docker-compose.yml up -d
```

Then run smoke checks against the running stack.

## Manual Checkup And DoD

### Clean Dependency Check

Run:

```bash
pnpm why convex
pnpm why @clerk/nextjs
pnpm why wrangler
pnpm why next
```

Expected result:

- No Convex dependency remains unless an explicitly archived package is excluded from production.
- No Clerk dependency remains.
- No Wrangler dependency remains unless optional edge adapter is retained.
- No Next dependency remains if Vite is final.

### Import Search Check

Run:

```bash
rg "convex|@clerk|CLERK_|CONVEX_|wrangler|next/server|NextResponse"
```

Expected result:

- No active production code references removed stack components.
- Any remaining docs mention them only as legacy/migration references.

### Full Local Stack Check

Run:

```bash
docker compose -f infra/docker-compose.yml down -v
docker compose -f infra/docker-compose.yml up --build
```

Expected result:

- Postgres starts.
- Redis starts.
- API starts.
- Worker starts.
- Web starts.
- Nginx starts if included.
- Health endpoints pass.
- Worker does not crash-loop.

### End-To-End Smoke Check

Verify in order:

1. Register user.
2. Create organization.
3. Save Bot Studio config.
4. Add inline knowledge.
5. Save WhatsApp integration.
6. Verify webhook GET.
7. Send signed inbound webhook.
8. Worker normalizes inbound event.
9. Bot generates reply.
10. Outbound queue sends or mock-sends message.
11. Send status webhook.
12. Inbox shows updated delivery state.
13. Trigger checkout.
14. Process valid billing webhook.
15. Confirm usage limits are visible.

Expected result:

- Flow works without Convex, Clerk, Cloudflare Worker, or Next.js API routes.

### Production-Like Webhook Check

Use production-like env settings:

- invalid WhatsApp signature returns `401`.
- invalid billing signature is rejected.
- duplicate WhatsApp event does not duplicate messages.
- duplicate billing webhook does not duplicate subscription changes.

Expected result:

- Security-sensitive routes fail closed.
- Idempotency works at database level.

### Realtime Check

1. Open two browser sessions.
2. Trigger inbound message.
3. Trigger operator action.
4. Trigger notification.

Expected result:

- Both sessions update through Socket.IO.
- Cross-org session receives nothing.
- Socket reconnect works after API restart.

### Rollback Check

Before production cutover, execute a rollback drill in staging:

1. Deploy new stack.
2. Switch webhook URLs to new stack.
3. Send test traffic.
4. Roll back to previous deployment or previous container image.
5. Restore webhook URLs.

Expected result:

- Rollback steps are documented and executable.
- Data loss risk is explicitly understood.
- Operators know which system is authoritative.

### Phase Exit Criteria

- New stack is authoritative.
- Old platform-specific dependencies are removed or clearly archived.
- Documentation matches the actual runtime.
- Deployment and rollback are tested.
- Security-sensitive endpoints fail closed.
- Product flows pass end-to-end on the new stack.

