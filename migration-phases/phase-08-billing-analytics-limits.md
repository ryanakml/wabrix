# Phase 08: Billing, Usage Limits, And Analytics

## Goal

Port billing, checkout, billing webhooks, subscriptions, usage counters, usage guards, and analytics from Convex/Next.js API routes into Express + Prisma.

## Current References

- `packages/backend/convex/billing.ts`
- `packages/backend/convex/lib/billing.ts`
- `packages/backend/convex/lib/aiCost.ts`
- `apps/web/lib/billing.ts`
- `apps/web/app/api/billing/checkout/route.ts`
- `apps/web/app/api/billing/webhooks/[gateway]/route.ts`
- `apps/web/app/[locale]/dashboard/billing/billing-client.tsx`
- `apps/web/app/[locale]/dashboard/analytics/analytics-client.tsx`
- `docs/phase-12/README.md`

## Target Deliverables

- Express checkout endpoint.
- Express billing webhook endpoint.
- Secure webhook signature verification.
- Provider-agnostic billing event persistence.
- Idempotent subscription updates.
- Usage counter service.
- Usage guard service for AI and outbound messages.
- Billing dashboard endpoint.
- Analytics dashboard endpoint.
- Overview metrics endpoints.
- Tests for webhook idempotency and usage enforcement.

## Critical Security Correction

The current Next.js billing webhook route logs invalid signatures but continues and returns `200`. Do not copy that behavior into the new production implementation.

Target behavior:

- Invalid production webhook signature must not update subscription state.
- Invalid production webhook should return a non-2xx response unless the provider requires a different safe acknowledgement strategy.
- If local development bypass is needed, gate it behind an explicit env var like `BILLING_WEBHOOK_ALLOW_INVALID_SIGNATURES=true` and never enable it in production.
- Do not log secret previews.

## API Contract

- `GET /billing/dashboard`
- `POST /billing/checkout`
- `POST /webhooks/billing/:gateway`
- `GET /analytics/dashboard`
- `GET /dashboard/overview`
- `GET /dashboard/overview/bar`
- `GET /dashboard/overview/area`
- `GET /dashboard/overview/pie`
- `GET /dashboard/overview/recent-sales`

## Detailed Tasks

### 1. Port Billing Helpers

Move or adapt from `packages/backend/convex/lib/billing.ts`:

- default plan definitions
- country normalization
- gateway resolution by country
- month period calculation
- Polar subscription status normalization
- Midtrans subscription status normalization
- usage limit error messages
- clamp/ratio helpers

Keep these in `packages/core/billing`.

### 2. Implement Plan Seed Sync

- Seed `starter`, `growth`, `scale`.
- Source values from `packages/config/src/index.ts`.
- Make seed idempotent.
- Add an admin-only sync endpoint only if needed; otherwise keep it as a seed script.

### 3. Implement Usage Counter Service

Service methods:

- `getCurrentUsageCounter(organizationId, now)`
- `incrementUsageCounters(input)`
- `getUsageGuardState(organizationId)`
- `assertUsageAllowed(organizationId, kind)`

Counters:

- AI run count
- AI prompt tokens
- AI completion tokens
- AI total tokens
- AI estimated cost USD
- inbound message count
- outbound message count
- outbound template message count
- delivery sent/delivered/read/failed count
- queue failure count
- media processed count

Rules:

- Upsert counter by `organizationId + periodKey`.
- Increment in a transaction where possible.
- Do not let counter failures silently bypass hard usage limits for outbound and AI.

### 4. Integrate Usage Guards

Enforce:

- AI token limit before AI preview and bot generation.
- Outbound message limit before automatic reply queueing and manual reply queueing.
- Template outbound count separately if plan needs it later.

If Phase 06 was implemented before Phase 08, replace temporary no-op guards with real checks.

### 5. Implement Checkout Endpoint

`POST /billing/checkout`:

- auth required
- organization context required
- validates `planKey`
- detects billing country from request/header/body
- chooses gateway:
  - Indonesia -> Midtrans
  - other countries -> Polar
- creates provider checkout/session
- stores pending billing event or checkout record if needed
- returns checkout URL and gateway metadata

### 6. Implement Billing Webhook Endpoint

`POST /webhooks/billing/:gateway`:

- uses raw body for signature verification.
- supports `polar`.
- supports `midtrans`.
- validates gateway path.
- verifies signature.
- normalizes payload.
- builds idempotency key.
- inserts `BillingEvent` if new.
- if duplicate, returns safe success without reapplying state.
- finds organization by:
  - explicit metadata/reference
  - checkout id
  - order id
  - subscription id
- updates subscription state in a transaction.
- writes audit log if useful.

### 7. Implement Subscription Logic

Rules:

- Active/trialing subscriptions provide entitlements.
- Past due/canceled/incomplete should fall back to free/default limits or block paid-only features according to product decision.
- Store current period boundaries.
- Store gateway, currency, amount, and provider IDs.
- Preserve raw payload in `BillingEvent`.

### 8. Implement Dashboard Endpoints

`GET /billing/dashboard`:

- current plan
- subscription status
- current usage period
- limits
- usage bars
- available plans
- selected billing gateway/currency

`GET /analytics/dashboard`:

- message counts
- delivery state counts
- AI token usage
- estimated AI cost
- queue failures
- media processed
- trends by month

Overview endpoints:

- summary cards
- bar chart
- area chart
- pie chart
- recent sales/events

### 9. Integrate Realtime And Cache

- Invalidate billing dashboard cache when subscription or usage changes.
- Emit `billing.updated` after subscription changes.
- Emit `analytics.updated` after usage counter updates if realtime analytics is in scope.

## Automated Checks

Run:

```bash
pnpm --filter @wabrix/core test
pnpm --filter @wabrix/api test
pnpm --filter @wabrix/worker test
pnpm --filter @wabrix/api typecheck
pnpm lint
```

Recommended tests:

- Gateway resolution chooses Midtrans for `ID` or `IDN`.
- Gateway resolution chooses Polar for other countries.
- Plan seed is idempotent.
- Usage counter upsert increments correctly.
- AI usage guard blocks over-limit org.
- Outbound usage guard blocks over-limit org.
- Polar webhook rejects invalid signature in production.
- Midtrans webhook rejects invalid signature in production.
- Duplicate billing webhook does not create duplicate event or subscription update.
- Subscription update maps statuses correctly.
- Billing dashboard hides provider raw payloads.

## Manual Checkup And DoD

### Plan Seed Check

Run:

```bash
pnpm --filter @wabrix/db db:seed
```

Expected result:

- `starter`, `growth`, and `scale` exist.
- Running seed twice does not duplicate plans.
- Dashboard endpoint returns all active plans.

### Checkout Check

Run:

```bash
curl -s -X POST http://localhost:4000/billing/checkout \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{"planKey":"starter","billingCountry":"ID"}'
```

Expected result:

- Response uses Midtrans for Indonesia.
- Response includes checkout URL or sandbox redirect URL.
- No server key or provider secret is returned.

Repeat with `"billingCountry":"US"`.

Expected result:

- Response uses Polar.

### Webhook Signature Check

Send an invalid webhook signature to each gateway in production-like config.

Expected result:

- Request is rejected.
- No subscription changes.
- No successful billing event is processed.
- Logs do not reveal secrets.

### Webhook Idempotency Check

1. Send the same valid webhook twice.
2. Inspect `billingEvents`.
3. Inspect `subscriptions`.

Expected result:

- One billing event exists for the idempotency key.
- Subscription state is applied once.
- Second request returns safe duplicate acknowledgement.

### Usage Guard Check

1. Manually set current usage above plan limit.
2. Try AI preview.
3. Try manual outbound reply.

Expected result:

- AI preview fails with a clear usage-limit error.
- Outbound queue creation fails with a clear usage-limit error.
- No AI provider call happens when AI is blocked.
- No outbound queue row is created when outbound is blocked.

### Dashboard Check

Run:

```bash
curl -s http://localhost:4000/billing/dashboard \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID"

curl -s http://localhost:4000/analytics/dashboard \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID"
```

Expected result:

- Billing dashboard returns plan, subscription, limits, and usage.
- Analytics dashboard returns message, delivery, AI, queue, and media metrics.
- No provider raw payloads or secrets are returned.

### Phase Exit Criteria

- Billing and analytics no longer depend on Next.js API routes or Convex.
- Webhook signatures fail closed in production.
- Usage limits are enforced in AI and outbound flows.
- Billing events are idempotent.
- Dashboard endpoints provide the frontend data needed for migration.

