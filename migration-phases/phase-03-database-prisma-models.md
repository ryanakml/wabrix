# Phase 03: Database And Prisma Models

## Goal

Translate the current Convex document schema into a relational PostgreSQL schema managed by Prisma. This phase creates the durable data foundation for all migrated features.

## Current References

- `packages/backend/convex/schema.ts`
- `docs/phase-2/README.md`
- `docs/phase-3/README.md`
- `docs/phase-4/README.md`
- `docs/phase-5/README.md`
- `docs/phase-6/README.md`
- `docs/phase-7/README.md`
- `docs/phase-8/README.md`
- `docs/phase-9/README.md`
- `docs/phase-10/README.md`
- `docs/phase-11/README.md`
- `docs/phase-12/README.md`

## Target Deliverables

- Complete Prisma schema for all current domain tables.
- Raw SQL migration for `pgvector`.
- Seed script for default billing plans and optional local demo data.
- Repository helpers for common lookups.
- Database constraints for idempotency and tenant isolation.
- Migration documentation for timestamp and ID conventions.

## Schema Translation Rules

### ID Strategy

- Prefer UUIDs for all top-level tables.
- Use `@default(uuid())` or database-generated UUIDs consistently.
- Do not expose sequential IDs externally.

### Timestamp Strategy

- Convert Convex numeric millisecond timestamps to Prisma `DateTime`.
- Use:
  - `createdAt DateTime @default(now())`
  - `updatedAt DateTime @updatedAt`
- For provider timestamps, store as `DateTime` when they represent real dates.
- Use numeric fields only for counters, token counts, byte sizes, and durations.

### JSON Strategy

Use `Json` for fields currently typed as `v.any()` or flexible objects:

- audit details
- billing metadata
- WhatsApp template components
- Meta responses
- business profile object if not worth normalizing
- provider raw payload summaries where structured querying is not required

### Enum Strategy

Create Prisma enums for repeated state fields:

- organization role
- provider type
- knowledge source type
- knowledge source status
- WhatsApp connection status
- webhook processing status
- conversation status
- bot reply state
- message role
- content type
- delivery state
- outbound queue status
- notification type/severity/status
- template category/status
- subscription status
- billing gateway/currency

## Detailed Model Groups

### 1. Identity And Tenancy

Models:

- `User`
- `Organization`
- `OrganizationMember`
- `AuditLog`
- `RefreshToken`

Required constraints:

- `User.email` unique.
- `Organization.slug` unique if slugs are user-facing.
- `OrganizationMember.userId + organizationId` unique.
- Index `OrganizationMember.organizationId`.
- Index `AuditLog.organizationId + createdAt`.

### 2. Bot Runtime

Models:

- `BotProfile`
- `ModelProviderSetting`
- `PromptVersion`
- `AiRun`

Required constraints:

- Index `BotProfile.organizationId`.
- Decide whether each organization can have one active bot or multiple bots.
- If only one bot per org, add unique constraint on `BotProfile.organizationId`.
- Index `AiRun.organizationId + createdAt`.
- Index `AiRun.botId`.

Important fields:

- encrypted provider API key
- provider type
- model ID
- endpoint URL for OpenAI-compatible custom provider
- temperature
- max tokens
- localized prompt templates
- escalation settings

### 3. Knowledge And RAG

Models:

- `KnowledgeSource`
- `KnowledgeChunk`
- `KnowledgeUsageLog`

Required constraints:

- Index `KnowledgeSource.organizationId + createdAt`.
- Index `KnowledgeSource.botId`.
- Index `KnowledgeChunk.sourceId`.
- Index `KnowledgeChunk.botId`.
- Index `KnowledgeUsageLog.organizationId + createdAt`.

Vector implementation:

- Enable `pgvector` in a raw SQL migration:

  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```

- Store embeddings in a `vector(n)` column.
- Use the correct dimension for the embedding model. Verify the dimension before locking migration.
- If Prisma cannot model vector directly, declare it as `Unsupported("vector(n)")` and use raw SQL for vector search.

### 4. WhatsApp Integration And Webhook Events

Models:

- `WhatsAppIntegration`
- `WhatsAppWebhookEvent`
- `WhatsAppTemplate`
- `WhatsAppTemplateSyncLog`
- `WabaLifecycleEvent`

Required constraints:

- Index `WhatsAppIntegration.organizationId`.
- Index `WhatsAppIntegration.botId`.
- Unique or index `WhatsAppIntegration.phoneNumberId`; choose unique if one phone number cannot belong to multiple orgs.
- Index or unique `WhatsAppIntegration.verifyTokenHash`.
- Unique `WhatsAppWebhookEvent.eventKey`.
- Index `WhatsAppWebhookEvent.organizationId + receivedAt`.
- Index `WhatsAppWebhookEvent.phoneNumberId + receivedAt`.
- Unique `WhatsAppTemplate.organizationId + name + languageCode`.
- Index `WhatsAppTemplate.metaTemplateId`.

### 5. Inbox Domain

Models:

- `WhatsAppContact`
- `Conversation`
- `ConversationNote`
- `Message`
- `WhatsAppMessage`
- `WhatsAppMedia`

Required constraints:

- Unique `WhatsAppContact.organizationId + waId`.
- Index `Conversation.organizationId + lastMessageAt`.
- Index `Conversation.organizationId + lastInboundAt`.
- Index `Conversation.contactId`.
- Index `Message.conversationId + createdAt`.
- Unique or index `WhatsAppMessage.providerMessageId`.
- Index `WhatsAppMessage.conversationId + createdAt`.
- Index `WhatsAppMedia.whatsappMessageId`.
- Index `WhatsAppMedia.organizationId + createdAt`.

### 6. Outbound Queue

Model:

- `OutboundQueue`

Required constraints:

- Unique `OutboundQueue.idempotencyKey`.
- Unique or index `OutboundQueue.messageId`.
- Index `OutboundQueue.status + nextAttemptAt`.
- Index `OutboundQueue.providerMessageId`.
- Index `OutboundQueue.organizationId + createdAt`.

This table remains durable even though BullMQ executes jobs. Do not rely only on Redis for outbound state.

### 7. Notifications

Models:

- `DashboardNotification`
- `DashboardNotificationFeedState`
- `WebPushSubscription`

Required constraints:

- Unique `DashboardNotification.dedupeKey`.
- Index `DashboardNotification.organizationId + createdAt`.
- Index `DashboardNotification.conversationId`.
- Unique `DashboardNotificationFeedState.organizationId + userId`.
- Unique `WebPushSubscription.organizationId + endpoint`.
- Index `WebPushSubscription.organizationId + userId`.

### 8. Billing

Models:

- `Plan`
- `Subscription`
- `UsageCounter`
- `BillingEvent`

Required constraints:

- Unique `Plan.key`.
- Index `Plan.active`.
- Index `Subscription.organizationId`.
- Index `Subscription.organizationId + status`.
- Index provider IDs:
  - `providerSubscriptionId`
  - `providerCheckoutId`
  - `providerOrderId`
- Unique `UsageCounter.organizationId + periodKey`.
- Unique `BillingEvent.idempotencyKey`.
- Index `BillingEvent.organizationId + createdAt`.

## Detailed Tasks

### 1. Write Prisma Schema

- Translate each Convex table into a Prisma model.
- Add relations and `onDelete` behavior deliberately:
  - avoid cascade-deleting audit logs
  - avoid cascade-deleting billing events
  - allow controlled deletion for knowledge chunks when a source is deleted
- Use plural database table names through `@@map` only if a snake_case database convention is chosen.
- Keep field names consistent with TypeScript services where possible.

### 2. Add Raw SQL Migrations

- Add `pgvector` extension.
- Add vector index after the table exists.
- Add any partial indexes Prisma cannot express.
- Add case-insensitive unique email if using Postgres `citext`, or normalize emails in application code.

### 3. Seed Defaults

- Seed `Plan` from `packages/config/src/index.ts`.
- Seed a local admin user only for development if explicitly gated by `NODE_ENV`.
- Seed demo org/conversation data only if it is clearly marked development-only.

### 4. Add Repository Smoke Tests

- Test DB client can connect.
- Test seed creates the three default plans.
- Test unique constraints reject duplicate event keys, duplicate usage counter period, and duplicate org contact.
- Test vector insert/search if `pgvector` is enabled in local Postgres.

## Automated Checks

Run:

```bash
docker compose -f infra/docker-compose.yml up -d postgres
pnpm --filter @wabrix/db db:generate
pnpm --filter @wabrix/db db:migrate:dev
pnpm --filter @wabrix/db db:seed
pnpm --filter @wabrix/db test
pnpm --filter @wabrix/db typecheck
pnpm lint
```

## Manual Checkup And DoD

### Migration Check

1. Reset local database if safe:

   ```bash
   docker compose -f infra/docker-compose.yml down -v
   docker compose -f infra/docker-compose.yml up -d postgres redis
   ```

2. Run migrations:

   ```bash
   pnpm --filter @wabrix/db db:migrate:dev
   ```

3. Inspect tables:

   ```bash
   docker compose -f infra/docker-compose.yml exec postgres psql -U postgres -d wabrix -c "\\dt"
   ```

Expected result:

- All target tables exist.
- Migration runs from empty database without manual SQL outside migrations.

### Constraint Check

Run SQL checks or Prisma test helpers to verify:

- Duplicate `whatsapp_webhook_events.event_key` fails.
- Duplicate `outbound_queue.idempotency_key` fails.
- Duplicate `billing_events.idempotency_key` fails.
- Duplicate `usage_counters.organization_id + period_key` fails.
- Duplicate `whatsapp_contacts.organization_id + wa_id` fails.

Expected result:

- Database rejects duplicates, not just service code.

### Vector Check

1. Confirm extension:

   ```bash
   docker compose -f infra/docker-compose.yml exec postgres psql -U postgres -d wabrix -c "select extname from pg_extension where extname = 'vector';"
   ```

2. Insert one test chunk and query nearest neighbor through the repository test or raw SQL.

Expected result:

- `vector` extension is installed.
- A vector field can be inserted.
- Similarity query returns expected rows.

### Seed Check

Run:

```bash
pnpm --filter @wabrix/db db:seed
```

Expected result:

- Plans `starter`, `growth`, and `scale` exist.
- Running seed twice is idempotent.
- Prices and entitlements match `packages/config/src/index.ts`.

### Phase Exit Criteria

- Full data model exists in Prisma.
- Migrations are reproducible from empty database.
- Key idempotency constraints are enforced at database level.
- `pgvector` strategy is implemented or explicitly stubbed with a documented blocker.
- Auth and feature modules can now use relational models instead of Convex tables.

