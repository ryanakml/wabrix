# Phase 01: Runtime Foundation

## Goal

Create the new stack skeleton beside the current implementation without deleting Convex, Clerk, Cloudflare Worker, or Next.js code. This phase proves that the target runtime can boot locally and provides stable package boundaries for all later work.

## Current References

- Root monorepo scripts in `package.json`.
- Workspace configuration in `pnpm-workspace.yaml`.
- Turborepo task setup in `turbo.json`.
- Current shared constants in `packages/config/src/index.ts`.
- Current backend package shape in `packages/backend/package.json`.
- Current ingress package shape in `apps/ingress/package.json`.

## Target Deliverables

- `apps/api`: Express API service.
- `apps/worker`: BullMQ worker service.
- `packages/db`: Prisma client, schema, migrations, seed entrypoint.
- `packages/shared`: shared DTOs, enums, errors, API response types, Zod schemas.
- `packages/core`: pure business rules and service helpers that can be reused by API and workers.
- `infra/docker-compose.yml`: local Postgres + Redis + API + worker + web wiring.
- Updated root scripts and Turbo tasks.
- Updated `.env.example`.

## Detailed Tasks

### 1. Add `apps/api`

- Create `apps/api/package.json` with scripts:
  - `dev`: run the API with watch mode.
  - `build`: compile TypeScript to `dist`.
  - `start`: run compiled API.
  - `lint`, `typecheck`, `test`.
- Create `apps/api/tsconfig.json` extending the shared base config.
- Create `apps/api/src/server.ts` for process startup.
- Create `apps/api/src/app.ts` that builds and exports the Express app for tests.
- Add middleware in this order:
  - request ID
  - structured request logging
  - JSON body parsing for normal API routes
  - CORS with explicit allowed origins
  - API routes
  - 404 handler
  - error handler
- Add routes:
  - `GET /health`
  - `GET /ready`
  - `GET /version`
- Make `GET /health` not depend on database or Redis.
- Make `GET /ready` check Postgres and Redis connectivity.

### 2. Add `apps/worker`

- Create `apps/worker/package.json` with scripts:
  - `dev`
  - `build`
  - `start`
  - `lint`
  - `typecheck`
  - `test`
- Create `apps/worker/src/index.ts` for worker process startup.
- Create a queue registry that names all planned queues even if processors are placeholders:
  - `whatsapp.inbound.normalize`
  - `whatsapp.status.reconcile`
  - `whatsapp.template.apply-webhook`
  - `whatsapp.lifecycle.apply-webhook`
  - `bot.reply.generate`
  - `whatsapp.outbound.send`
  - `whatsapp.media.process`
  - `knowledge.ingest`
  - `billing.webhook.process`
  - `notifications.dispatch`
- Add graceful shutdown for `SIGINT` and `SIGTERM`.
- Add a minimal smoke processor for one internal test queue or no-op health job.
- Do not implement domain behavior yet.

### 3. Add `packages/db`

- Add dependencies:
  - `prisma`
  - `@prisma/client`
- Create `packages/db/prisma/schema.prisma`.
- Add an initial placeholder model if needed to validate Prisma generation.
- Create `packages/db/src/client.ts` exporting a singleton Prisma client.
- Create `packages/db/src/index.ts` exporting client and generated types.
- Create scripts:
  - `db:generate`
  - `db:migrate:dev`
  - `db:migrate:deploy`
  - `db:studio`
  - `db:seed`
- Do not port the full schema in this phase unless it is small enough to do safely. Full schema translation is Phase 03.

### 4. Add `packages/shared`

- Add `packages/shared/src/index.ts`.
- Add shared primitives:
  - `ApiErrorCode`
  - `ApiErrorShape`
  - `ApiSuccessShape<T>`
  - `PaginationInput`
  - `PaginationOutput`
  - `OrganizationRole`
  - `SupportedLocale`
  - common Zod helpers
- Keep this package free of Node-only dependencies unless necessary.

### 5. Add `packages/core`

- Add `packages/core/src/index.ts`.
- Add initial folders:
  - `auth`
  - `billing`
  - `bot`
  - `knowledge`
  - `whatsapp`
  - `inbox`
  - `outbound`
  - `notifications`
- Only add pure utilities in this phase.
- Do not import Express, BullMQ, Prisma, or Socket.IO into core modules unless the file is explicitly an adapter.

### 6. Add Infrastructure

- Create `infra/docker-compose.yml` with:
  - `postgres`
  - `redis`
  - optional `api`
  - optional `worker`
  - optional `web`
- Use named volumes:
  - `postgres_data`
  - `redis_data`
- Expose local ports:
  - API: `4000`
  - Postgres: `5432`
  - Redis: `6379`
- Add healthchecks for Postgres and Redis.
- Add `infra/.env.example` only if service-specific env isolation becomes clearer than a single root `.env.example`.

### 7. Update Root Tooling

- Update `pnpm-workspace.yaml` only if new folders are outside existing workspace globs.
- Update `turbo.json` to include any env vars needed by the new services.
- Ensure root `pnpm dev` can include new services without breaking current Convex/Next workflows.
- If running all services together is too heavy, add specific scripts:
  - `dev:api`
  - `dev:worker`
  - `dev:infra`

## Environment Variables

Add or reserve these in `.env.example`:

- `API_PORT=4000`
- `API_BASE_URL=http://localhost:4000`
- `WEB_ORIGIN=http://localhost:3000`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wabrix`
- `REDIS_URL=redis://localhost:6379`
- `JWT_ACCESS_SECRET=replace-me`
- `JWT_REFRESH_SECRET=replace-me`
- `ENCRYPTION_SECRET=replace-me`
- `NODE_ENV=development`

Keep existing Convex/Clerk variables for now. Removal happens in Phase 10.

## Automated Checks

Run:

```bash
pnpm install
pnpm --filter @wabrix/db db:generate
pnpm --filter @wabrix/api typecheck
pnpm --filter @wabrix/worker typecheck
pnpm --filter @wabrix/shared typecheck
pnpm --filter @wabrix/core typecheck
pnpm --filter @wabrix/api test
pnpm --filter @wabrix/worker test
pnpm lint
```

If global lint fails because existing code is unrelated, record the failure and run package-specific lint for newly added packages.

## Manual Checkup And DoD

### Local Infrastructure Check

1. Start infrastructure:

   ```bash
   docker compose -f infra/docker-compose.yml up -d postgres redis
   ```

2. Confirm containers are healthy:

   ```bash
   docker compose -f infra/docker-compose.yml ps
   ```

3. Connect to Postgres:

   ```bash
   docker compose -f infra/docker-compose.yml exec postgres psql -U postgres -d wabrix -c "select 1;"
   ```

4. Connect to Redis:

   ```bash
   docker compose -f infra/docker-compose.yml exec redis redis-cli ping
   ```

Expected result:

- Postgres returns `1`.
- Redis returns `PONG`.
- Healthchecks are healthy or running without restart loops.

### API Boot Check

1. Start API:

   ```bash
   pnpm --filter @wabrix/api dev
   ```

2. Call health endpoints:

   ```bash
   curl -i http://localhost:4000/health
   curl -i http://localhost:4000/ready
   curl -i http://localhost:4000/version
   ```

Expected result:

- `/health` returns HTTP `200` even if Postgres/Redis are down.
- `/ready` returns HTTP `200` only when Postgres and Redis are reachable.
- Error responses are JSON and include a stable error code.

### Worker Boot Check

1. Start worker:

   ```bash
   pnpm --filter @wabrix/worker dev
   ```

2. Stop it with `Ctrl+C`.

Expected result:

- Worker logs the queue registry.
- Worker exits cleanly without hanging.
- No domain jobs are accidentally processed yet.

### Phase Exit Criteria

- New packages build and typecheck.
- Docker Compose runs Postgres and Redis.
- API can boot independently of the current Next.js app.
- Worker can boot and shut down cleanly.
- Current Convex/Next workflow is not deleted or broken intentionally.

