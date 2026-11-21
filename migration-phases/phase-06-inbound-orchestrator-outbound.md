# Phase 06: Inbound, Bot Orchestration, Media, Outbound

## Goal

Port the runtime message processing pipeline from Convex scheduler/actions into BullMQ workers backed by PostgreSQL durable state.

## Current References

- `packages/backend/convex/inbound.ts`
- `packages/backend/convex/orchestrator.ts`
- `packages/backend/convex/orchestratorAction.ts`
- `packages/backend/convex/outbound.ts`
- `packages/backend/convex/outboundAction.ts`
- `packages/backend/convex/media.ts`
- `packages/backend/convex/mediaAction.ts`
- `packages/backend/convex/notifications.ts`
- `packages/backend/__tests__/inbound.test.ts`
- `packages/backend/__tests__/orchestrator.test.ts`
- `packages/backend/__tests__/outbound.test.ts`

## Target Deliverables

- BullMQ processor for inbound normalization.
- BullMQ processor for AI bot reply generation.
- BullMQ processor for outbound WhatsApp sending.
- BullMQ processor for status reconciliation.
- BullMQ processor for media processing.
- Durable state machines in PostgreSQL.
- Idempotent workers with safe retry behavior.
- Usage counters integrated where already available or stubbed until Phase 08.
- Tests for duplicate handling, service windows, stale claims, retries, and status reconciliation.

## Queue Payload Rule

Queue payloads should carry IDs only:

- `{ webhookEventId }`
- `{ conversationId }`
- `{ queueJobId }`
- `{ mediaId }`

Do not pass full message content, secrets, or tenant data in BullMQ payloads. Workers must reload current state from PostgreSQL.

## Detailed Tasks

### 1. Implement Inbound Normalization Worker

Queue: `whatsapp.inbound.normalize`

Processor steps:

1. Load `WhatsAppWebhookEvent` by id.
2. If missing, return `noop`.
3. If already normalized, return `duplicate`.
4. If event has no organization/integration/bot, mark `ignored`.
5. Parse raw payload.
6. Normalize each inbound message:
   - provider message ID
   - sender WhatsApp ID
   - profile name
   - message type
   - content type
   - content
   - provider media ID
   - media processing requirements
   - received timestamp
7. For each normalized message:
   - check duplicate `providerMessageId`
   - upsert `WhatsAppContact`
   - update `serviceWindowExpiresAt` to inbound time + 24 hours
   - find or create active open `Conversation`
   - process opt-out/opt-in keywords
   - insert transcript `Message`
   - insert `WhatsAppMessage`
   - link transcript to transport row
   - insert `WhatsAppMedia` if needed
   - enqueue `whatsapp.media.process` if media exists
   - enqueue or delay `bot.reply.generate` if eligible
8. Patch webhook event status to `normalized` or `normalized_media_queued`.

Important invariants:

- Duplicate provider message IDs must not create duplicate transcript rows.
- Unsupported payloads should create safe transcript text, not crash the worker.
- Bot auto-reply is only scheduled for inbound text when contact has not opted out.

### 2. Implement Bot Reply State Machine

Queue: `bot.reply.generate`

Port these concepts:

- debounce window
- service window open check
- service window expiring soon notification
- bot paused block
- handoff requested block
- closed conversation block
- contact opted out block
- generation token
- stale generation protection
- latest inbound already processed protection

Recommended worker flow:

1. Claim conversation in a transaction.
2. If not ready, return reason.
3. Load runtime state:
   - bot profile
   - provider settings
   - prompt version
   - knowledge corpus
4. Check AI usage limit if Phase 08 is available.
5. Decrypt provider API key.
6. Apply guardrails.
7. Retrieve RAG chunks.
8. Generate draft.
9. Log knowledge usage.
10. Log AI run.
11. Finalize draft in a transaction:
    - verify generation token still matches
    - verify no newer inbound invalidates result
    - verify service window still open
    - insert assistant transcript message
    - insert outbound transport row
    - insert outbound queue row
    - update conversation bot state to `queued`
12. Enqueue `whatsapp.outbound.send`.

### 3. Implement Outbound Queue Worker

Queue: `whatsapp.outbound.send`

Processor steps:

1. Load queue row by id.
2. Claim eligible row:
   - status is `queued`
   - `nextAttemptAt <= now`
   - assign claim token
   - set status `processing`
3. Reload integration and contact.
4. Recheck service window if `requiresOpenServiceWindow` is true.
5. Decrypt access token.
6. Send text or template message to Meta.
7. On success:
   - store provider message ID
   - mark queue `sent`
   - mark transcript `sent`
   - mark transport `sent`
   - increment delivery/usage counters
8. On retryable failure:
   - increment attempt count
   - set status `queued`
   - set `nextAttemptAt` using exponential backoff
   - keep same idempotency key
   - re-enqueue delayed job
9. On permanent failure:
   - mark queue `failed`
   - mark transcript `failed`
   - mark transport `failed`
   - create dashboard notification

External side-effect rule:

- Claim must happen before calling Meta.
- Finalization must verify the same claim token.
- Retries must reuse the same idempotency key.

### 4. Implement Status Reconciliation Worker

Queue: `whatsapp.status.reconcile`

Processor steps:

1. Load raw webhook event.
2. Parse status payload.
3. Normalize statuses:
   - provider message ID
   - status: `sent`, `delivered`, `read`, `failed`
   - timestamp
   - recipient WhatsApp ID
   - failure details
4. Find matching `WhatsAppMessage`.
5. Patch transport state.
6. Patch transcript delivery state.
7. Patch matching outbound queue row if provider ID matches.
8. Patch conversation metadata.
9. Increment usage counters.
10. Mark webhook event `status_processed`.

Important invariant:

- Status webhook must never create a second outbound send.

### 5. Implement Media Processor

Queue: `whatsapp.media.process`

Processor steps:

1. Load `WhatsAppMedia`.
2. If already processed, return `duplicate`.
3. Load integration and access token.
4. Check media download deadline.
5. Fetch media metadata from Meta.
6. Download media binary.
7. Upload to object storage if configured and required.
8. For audio:
   - transcribe or produce fallback transcript.
9. For image/document:
   - summarize or extract text.
10. Patch `WhatsAppMedia`.
11. Patch transcript `Message` content with extracted context where appropriate.
12. Increment media usage counter.

### 6. Implement Manual Reply Queue Reuse

Inbox endpoints in Phase 07 will call these services, but queue primitives should exist now:

- `queueManualReply`
- `queueTemplateReply`

Rules:

- Manual freeform replies require open service window.
- Template replies do not require open service window but require approved template.
- Both create transcript, transport, and outbound queue rows.
- Both enqueue `whatsapp.outbound.send`.

### 7. Add Worker Observability

For every processor log:

- job id
- queue name
- organization id if known
- entity id
- attempt number
- status
- error code/message

Avoid logging:

- access tokens
- app secrets
- provider API keys
- full customer message bodies unless redacted/truncated

## Automated Checks

Run:

```bash
pnpm --filter @wabrix/core test
pnpm --filter @wabrix/worker test
pnpm --filter @wabrix/api test
pnpm --filter @wabrix/worker typecheck
pnpm lint
```

Recommended tests:

- Inbound text creates contact, conversation, transcript, transport row.
- Duplicate inbound provider message is ignored.
- Opt-out blocks bot scheduling.
- Opt-in unblocks later bot scheduling.
- Bot pause blocks generation.
- Handoff blocks generation.
- Closed service window blocks generation.
- Debounce coalesces multiple inbound messages.
- Stale generation token cannot finalize a reply.
- Successful generation creates outbound queue row.
- Outbound worker sends text with idempotency key.
- Retryable Meta failure reschedules with backoff.
- Permanent Meta failure marks queue/message failed.
- Status webhook reconciles delivery state.
- Media job marks expired if deadline passed.

## Manual Checkup And DoD

### Inbound Processing Check

1. Insert or create a configured org, bot, and WhatsApp integration.
2. Send a valid signed WhatsApp inbound webhook as in Phase 05.
3. Start worker:

   ```bash
   pnpm --filter @wabrix/worker dev
   ```

4. Inspect database.

Expected result:

- Raw webhook event becomes `normalized`.
- One contact exists for the sender.
- One open conversation exists.
- One user transcript message exists.
- One inbound `WhatsAppMessage` transport row exists.
- Contact service window expires 24 hours after inbound timestamp.
- Bot reply job is scheduled if message is text and contact did not opt out.

### Duplicate Inbound Check

Send the same webhook twice.

Expected result:

- `attemptCount` increments on raw event.
- There is still only one transcript message for the provider message ID.
- There is still only one transport row.

### Bot Generation Check

1. Ensure Bot Studio and knowledge are configured.
2. Wait for debounce or manually enqueue `bot.reply.generate`.
3. Inspect conversation and outbound queue.

Expected result:

- Conversation moves through `pending` or `generating` to `queued`.
- Assistant transcript message is created.
- Outbound queue row is created with stable idempotency key.
- AI run is logged.
- RAG usage is logged when matching chunks exist.

### Bot Blocking Check

Manually set each condition and enqueue generation:

- `botPaused=true`
- `handoffRequested=true`
- `status=closed`
- expired `serviceWindowExpiresAt`
- contact `optOut=true`

Expected result:

- Bot does not call AI.
- Conversation gets clear blocked/error state.
- No outbound queue row is created.

### Outbound Send Check

Use a mocked Meta API in local development or a test phone number.

Expected result:

- Worker claims queue row.
- Meta send receives `X-Idempotency-Key`.
- Queue row becomes `sent`.
- Transcript delivery state becomes `sent`.
- Provider message ID is stored.

### Retry Check

Force Meta mock to return `500` or `429`.

Expected result:

- Queue row returns to `queued`.
- Attempt count increments.
- Next attempt time moves forward.
- Same idempotency key is retained.

### Permanent Failure Check

Force Meta mock to return `400`.

Expected result:

- Queue row becomes `failed`.
- Transcript becomes `failed`.
- Failure notification is created.
- No infinite retries occur.

### Status Reconciliation Check

Send a signed status webhook for the provider message ID.

Expected result:

- Transport state updates to delivered/read/failed.
- Transcript delivery state matches.
- Queue row provider status is updated.
- No duplicate outbound job is created.

### Phase Exit Criteria

- Full message runtime works through BullMQ.
- Workers are idempotent under retry.
- Service window and opt-out rules are enforced in backend logic.
- External Meta sends are claim-protected.
- Status reconciliation is safe and does not send messages.
- Convex scheduler is no longer required for message processing parity.

