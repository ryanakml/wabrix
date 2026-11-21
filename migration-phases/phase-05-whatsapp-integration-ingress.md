# Phase 05: WhatsApp Integration And Express Ingress

## Goal

Port WhatsApp setup and webhook ingress from Cloudflare Worker/Hono + Convex HTTP actions into Express + Prisma + Redis + BullMQ.

## Current References

- `apps/ingress/src/index.ts`
- `apps/ingress/src/whatsapp.ts`
- `apps/ingress/src/index.test.ts`
- `packages/backend/convex/whatsapp.ts`
- `packages/backend/convex/whatsappAction.ts`
- `packages/backend/convex/whatsappWebhookEvents.ts`
- `packages/backend/convex/http.ts`
- `apps/web/app/[locale]/dashboard/whatsapp/whatsapp-settings-client.tsx`

## Target Deliverables

- WhatsApp integration REST endpoints in Express.
- Encrypted WhatsApp access token and app secret storage.
- Hashed verify token storage.
- Frontend-safe integration state shape.
- Template CRUD and Meta sync job trigger.
- Lifecycle refresh job trigger.
- Express `GET /webhooks/whatsapp`.
- Express `POST /webhooks/whatsapp` with exact raw-body signature validation.
- Redis-backed rate limit per `phoneNumberId`.
- Raw event persistence in PostgreSQL.
- BullMQ enqueue for downstream processors.

## API Contract

### Integration

- `GET /whatsapp/integration`
- `PUT /whatsapp/integration`
- `POST /whatsapp/lifecycle/refresh`
- `POST /whatsapp/phone/request-code`
- `POST /whatsapp/phone/verify-code`

### Templates

- `GET /whatsapp/templates`
- `POST /whatsapp/templates`
- `PATCH /whatsapp/templates/:templateId`
- `DELETE /whatsapp/templates/:templateId`
- `POST /whatsapp/templates/sync`

### Webhooks

- `GET /webhooks/whatsapp`
- `POST /webhooks/whatsapp`

## Detailed Tasks

### 1. Port Webhook Core Helpers

Move reusable helper logic from `apps/ingress/src/whatsapp.ts` into `packages/core/whatsapp/webhook`:

- HMAC SHA-256 Meta signature signing.
- Signature header normalization.
- Constant-time comparison.
- Raw JSON parsing.
- Phone number ID extraction.
- Business account ID extraction.
- Provider event ID extraction.
- Event type derivation.
- Media work derivation.
- Webhook event key construction.
- GET verification validation.

Keep these helpers framework-independent.

### 2. Configure Express Raw Body Handling

Meta signature verification must use the exact raw request body.

Implementation rules:

- Do not apply global JSON parsing before the WhatsApp webhook POST route.
- Use `express.raw({ type: "application/json" })` for `POST /webhooks/whatsapp`.
- Convert raw buffer to string only after signature validation input is captured.
- Reject requests if raw body is missing or already consumed.

### 3. Implement WhatsApp Integration State

`GET /whatsapp/integration` must return:

- current phone number ID
- business account ID
- enabled flag
- connection status
- webhook status
- approval status
- phone verification status
- profile status
- display name review status
- messaging limit tier
- business profile
- template summaries
- lifecycle blockers
- booleans for configured secrets

It must not return:

- access token
- app secret
- verify token
- encrypted secret payload

### 4. Implement Integration Save

`PUT /whatsapp/integration`:

- admin only.
- requires active Bot Studio profile.
- validates `phoneNumberId` and `businessAccountId`.
- encrypts `accessToken` if provided.
- encrypts `appSecret` if provided.
- hashes `verifyToken` if provided.
- preserves existing secrets when fields are omitted.
- updates connection status:
  - `not_connected` when missing required fields
  - `configured` when required fields exist and enabled
  - `disabled` when disabled
- writes audit log with secret-change booleans only.
- invalidates Redis integration cache.
- emits realtime event later in Phase 07, or records an event hook placeholder now.

### 5. Implement Template Management

- Port local template create/update/archive behavior.
- Store template components as JSON.
- Normalize category and status.
- Enforce unique `organizationId + name + languageCode`.
- Template sync:
  - API enqueues `whatsapp.templates.sync`
  - worker calls Meta Graph API
  - worker upserts template statuses
  - worker writes sync log
  - worker creates dashboard notification for rejected templates

If worker implementation is deferred to Phase 06, this phase should enqueue the job and include a no-op processor with explicit TODO.

### 6. Implement Lifecycle Actions

- Refresh lifecycle:
  - enqueue `whatsapp.lifecycle.apply-webhook` or a dedicated `whatsapp.lifecycle.refresh` job.
  - load current integration runtime.
  - call Meta for approval/profile/messaging tier state where available.
  - store lifecycle events.
- Phone verification:
  - request code action.
  - verify code action.
  - patch phone verification status.

### 7. Implement Webhook GET Verification

`GET /webhooks/whatsapp`:

- reads `hub.mode`
- reads `hub.verify_token`
- reads `hub.challenge`
- validates mode is `subscribe`
- compares verify token against configured environment token or hashed integration token strategy
- returns challenge body as plain text on success
- marks matching integration as `verified` when token hash matches an integration

Recommended behavior:

- Keep a global `META_VERIFY_TOKEN` for initial local setup if needed.
- Prefer hashed per-integration token lookup for multi-tenant production.

### 8. Implement Webhook POST

`POST /webhooks/whatsapp`:

- reads raw body
- validates `X-Hub-Signature-256`
- rejects invalid signature with HTTP `401`
- parses JSON after signature validation
- extracts `phoneNumberId`
- applies Redis rate limit by phone number
- builds event key
- derives event type
- derives media work metadata
- looks up integration by phone number ID or business account ID
- persists `WhatsAppWebhookEvent`
- if duplicate:
  - increments attempt count
  - returns existing processing status
  - does not enqueue duplicate downstream jobs
- if new:
  - updates integration webhook status
  - enqueues appropriate BullMQ job:
    - `messages` -> `whatsapp.inbound.normalize`
    - `statuses` -> `whatsapp.status.reconcile`
    - template status -> `whatsapp.template.apply-webhook`
    - lifecycle event -> `whatsapp.lifecycle.apply-webhook`

### 9. Implement Redis Rate Limit

Start simple:

- key: `rl:wa:webhook:{phoneNumberId}`
- limit: configurable count/window
- use Redis `INCR` + `EXPIRE` or a Lua token bucket.

Env vars:

- `WHATSAPP_WEBHOOK_RATE_LIMIT_MAX`
- `WHATSAPP_WEBHOOK_RATE_LIMIT_WINDOW_SECONDS`

### 10. Preserve Webhook Durability Invariant

The route must not return success until raw event persistence succeeds.

Valid success cases:

- new event persisted and job enqueued
- duplicate event detected and attempt count updated

Invalid success cases:

- DB unavailable
- invalid signature
- invalid JSON
- rate-limited request

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

- Valid GET verification returns challenge.
- Invalid verify token is rejected.
- Valid signed POST persists raw payload.
- Invalid signature is rejected before JSON processing.
- Raw body whitespace changes affect signature.
- Rate limit is scoped by phone number ID.
- Duplicate event increments attempt count and does not enqueue a second job.
- Missing integration persists event as unassociated or ignored according to chosen policy.
- Integration save encrypts secrets and returns redacted state.

## Manual Checkup And DoD

### Integration Save Check

Run:

```bash
curl -s -X PUT http://localhost:4000/whatsapp/integration \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId":"12345",
    "businessAccountId":"waba_123",
    "accessToken":"test-access-token",
    "appSecret":"test-app-secret",
    "verifyToken":"test-verify-token",
    "enabled":true
  }'
```

Expected result:

- HTTP `200`.
- State is `configured`.
- Response includes configured booleans.
- Response does not include raw or encrypted secrets.
- Database stores encrypted access/app secrets and hashed verify token.

### Webhook GET Check

Run:

```bash
curl -i "http://localhost:4000/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=test-verify-token&hub.challenge=challenge_123"
```

Expected result:

- HTTP `200`.
- Response body is exactly `challenge_123`.
- Integration webhook status becomes `verified`.

### Signed POST Check

1. Prepare a payload:

   ```bash
   cat > /tmp/wa-payload.json <<'JSON'
   {"object":"whatsapp_business_account","entry":[{"id":"waba_123","changes":[{"field":"messages","value":{"metadata":{"phone_number_id":"12345"},"messages":[{"id":"wamid.test.1","from":"628123456789","timestamp":"1710000000","type":"text","text":{"body":"Hello"}}]}}]}]}
   JSON
   ```

2. Generate signature with a local helper or test script using the same app secret.
3. Send:

   ```bash
   curl -i -X POST http://localhost:4000/webhooks/whatsapp \
     -H "Content-Type: application/json" \
     -H "X-Hub-Signature-256: sha256=<signature>" \
     --data-binary @/tmp/wa-payload.json
   ```

Expected result:

- HTTP `200`.
- Response includes `duplicate:false`.
- Database has one raw webhook event.
- BullMQ has one `whatsapp.inbound.normalize` job.

### Duplicate POST Check

Send the exact same request again.

Expected result:

- HTTP `200`.
- Response includes `duplicate:true`.
- Same event row has `attemptCount` incremented.
- BullMQ does not receive a duplicate normalization job.

### Invalid Signature Check

Run:

```bash
curl -i -X POST http://localhost:4000/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=deadbeef" \
  --data-binary @/tmp/wa-payload.json
```

Expected result:

- HTTP `401`.
- No raw event row is created.
- No queue job is created.

### Phase Exit Criteria

- WhatsApp integration setup works without Convex.
- Webhook GET and POST work in Express.
- Raw body signature behavior matches the current worker behavior.
- Redis rate limiting works per phone number.
- Raw events are durable before acknowledgement.
- New webhook events enqueue BullMQ jobs exactly once.

