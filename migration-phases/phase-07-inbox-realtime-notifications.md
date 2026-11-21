# Phase 07: Inbox, Realtime, And Notifications

## Goal

Port the operator workspace, conversation controls, dashboard notifications, browser push, and realtime update behavior from Convex reactive queries to REST + Socket.IO.

## Current References

- `packages/backend/convex/inbox.ts`
- `packages/backend/convex/notifications.ts`
- `packages/backend/convex/notificationAction.ts`
- `apps/web/app/[locale]/dashboard/inbox/inbox-client.tsx`
- `apps/web-2/src/features/chat/components/messenger.tsx`
- `apps/web-2/src/features/contacts/components/contacts-page.tsx`
- `apps/web-2/src/features/notifications/*`
- `docs/phase-10/README.md`

## Target Deliverables

- Inbox REST endpoints.
- Conversation action endpoints.
- Notification REST endpoints.
- Browser push subscription endpoints.
- Socket.IO server with authenticated organization rooms.
- Redis adapter for Socket.IO.
- Frontend-ready event contract.
- Tests for access control, action side effects, notification dedupe, and realtime emission.

## API Contract

### Inbox Reads

- `GET /inbox/workspace?selectedConversationId=...`
- `GET /inbox/chat?selectedConversationId=...`
- `GET /contacts`
- `GET /conversations/:conversationId/drawer`

### Conversation Actions

- `PATCH /conversations/:conversationId/bot-pause`
- `PATCH /conversations/:conversationId/handoff`
- `PATCH /conversations/:conversationId/assignment`
- `PATCH /conversations/:conversationId/status`
- `POST /conversations/:conversationId/notes`
- `POST /conversations/:conversationId/manual-replies`
- `POST /conversations/:conversationId/template-replies`
- `POST /inbox/translate`

### Notifications

- `GET /notifications`
- `PATCH /notifications/:notificationId/read`
- `POST /notifications/read-all`
- `POST /notifications/web-push-subscriptions`
- `DELETE /notifications/web-push-subscriptions/:subscriptionId`

## Detailed Tasks

### 1. Build Inbox Workspace Query

Port `getInboxWorkspace` behavior:

- Load authenticated organization.
- List recent conversations ordered by `lastMessageAt`.
- Include contact summary:
  - WhatsApp ID
  - profile name
  - opt-out state
  - service window expiry
- Include conversation summary:
  - status
  - assignment
  - bot paused
  - handoff requested
  - bot reply state/error
  - last message preview
  - service window warning
- Resolve selected conversation:
  - requested conversation if valid
  - otherwise most recent conversation
- Include selected conversation messages.
- Include notes.
- Include queue rows.
- Include template suggestions.
- Include lifecycle/integration cards where needed.
- Include team members for assignment.

### 2. Build Chat-Focused Query

Port or adapt `getInboxChatWorkspace` for the richer `apps/web-2` chat UI:

- conversation list
- selected conversation
- messages
- drawer state
- template suggestions
- queue state

This can reuse the same service as workspace query with a lighter response mapper.

### 3. Build Contacts Query

- List tenant-scoped WhatsApp contacts.
- Include latest conversation summary.
- Support pagination.
- Support search by WhatsApp ID and profile name.
- Support opt-out filter if useful.

### 4. Implement Conversation Actions

Action rules:

- Operators can:
  - assign conversations
  - pause/resume bot
  - toggle handoff
  - close/reopen conversation
  - add notes
  - send manual replies inside service window
  - send approved templates outside service window
- Admins can do all operator actions.
- Viewers cannot mutate if viewer role exists.

Each mutation must:

- verify conversation belongs to organization
- write audit log when operationally useful
- update conversation row
- emit Socket.IO event after DB commit
- never bypass outbound queue for messages

### 5. Implement Manual Reply

Rules:

- conversation must be open
- freeform reply requires open WhatsApp service window
- contact must not be opted out unless business policy allows explicit manual override
- create transcript `Message` with role `agent`
- create outbound `WhatsAppMessage`
- create `OutboundQueue`
- enqueue `whatsapp.outbound.send`
- return queue state

### 6. Implement Template Reply

Rules:

- conversation must exist and belong to org
- template must belong to org and be approved
- does not require open service window
- create transcript with content type `template`
- create transport row with template metadata
- create outbound queue row with `payloadType=template`
- enqueue `whatsapp.outbound.send`

### 7. Implement Translation Endpoint

`POST /inbox/translate`:

- accepts message IDs or explicit message payloads
- verifies messages belong to active organization
- uses active tenant AI runtime
- does not overwrite stored transcript
- returns translated strings keyed by message ID
- logs AI usage if Phase 08 is available

### 8. Implement Notification Store

Port notification behavior:

- Notification types:
  - inbound message
  - service window expiring
  - bot reply failed
  - outbound send failed
  - template rejected
  - WABA action required
- Use `dedupeKey` to upsert instead of creating spam.
- Track read state per user.
- Add mark-one-read and mark-all-read.
- Keep notification body short and operator-actionable.

### 9. Implement Browser Push

- Save browser push subscriptions.
- Delete subscription by id or endpoint.
- Dispatch push through `notifications.dispatch` queue.
- Remove subscriptions after permanent push failures.
- Require VAPID env vars:
  - `WEB_PUSH_VAPID_PUBLIC_KEY`
  - `WEB_PUSH_VAPID_PRIVATE_KEY`
  - `WEB_PUSH_VAPID_SUBJECT`

### 10. Implement Socket.IO

Server:

- Attach Socket.IO to API HTTP server.
- Authenticate socket handshake with access token.
- Validate organization membership before joining room.
- Join `org:{organizationId}`.
- Optional selected conversation room:
  - `org:{organizationId}:conversation:{conversationId}`
- Use Redis adapter for multi-instance support.

Events:

- `conversation.created`
- `conversation.updated`
- `message.created`
- `message.updated`
- `outbound.updated`
- `notification.created`
- `notification.updated`
- `whatsapp.integration.updated`
- `whatsapp.template.updated`
- `knowledge.updated`
- `billing.updated`
- `analytics.updated`

Start with invalidation-style payloads:

- entity id
- organization id
- event type
- updated at

Avoid sending full customer transcript through socket events until privacy and caching rules are clear.

## Automated Checks

Run:

```bash
pnpm --filter @wabrix/api test
pnpm --filter @wabrix/worker test
pnpm --filter @wabrix/core test
pnpm --filter @wabrix/api typecheck
pnpm lint
```

Recommended tests:

- Inbox query returns only active org conversations.
- Assignment cannot target a user outside org.
- Bot pause updates state and blocks later generation.
- Handoff updates state.
- Closed conversation cannot receive manual freeform reply.
- Expired service window blocks manual freeform reply.
- Approved template can be queued outside service window.
- Notification dedupe updates existing row.
- Read state is per user.
- Socket connection rejects invalid token.
- Socket connection rejects org where user is not a member.
- Mutations emit expected events.

## Manual Checkup And DoD

### Inbox Workspace Check

Run:

```bash
curl -s "http://localhost:4000/inbox/workspace" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID"
```

Expected result:

- Response includes conversation list.
- Selected conversation is present when conversations exist.
- Messages are ordered correctly.
- Contact and service-window metadata are included.
- No other organization's conversations are returned.

### Operator Action Check

1. Pause bot:

   ```bash
   curl -s -X PATCH http://localhost:4000/conversations/$CONVERSATION_ID/bot-pause \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "X-Organization-Id: $ORG_ID" \
     -H "Content-Type: application/json" \
     -d '{"botPaused":true}'
   ```

2. Fetch workspace again.

Expected result:

- Conversation shows `botPaused:true`.
- Later bot generation for that conversation is blocked.

### Manual Reply Check

Run:

```bash
curl -s -X POST http://localhost:4000/conversations/$CONVERSATION_ID/manual-replies \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{"body":"Thanks, a human operator is checking this now."}'
```

Expected result:

- Transcript message is created with role `agent`.
- Transport row is created.
- Outbound queue row is created.
- BullMQ send job is enqueued.
- No direct Meta send happens in the API request.

### Template Reply Check

1. Create or sync an approved template.
2. Expire service window manually.
3. Send template reply.

Expected result:

- Template reply is accepted outside service window.
- Queue row has `payloadType=template`.
- Freeform manual reply remains blocked outside service window.

### Socket.IO Check

Use a small local client script or browser console:

1. Connect with access token.
2. Join active organization.
3. Trigger a conversation update through REST.

Expected result:

- Client receives `conversation.updated`.
- A token for a different user/org cannot join the room.
- Event payload does not expose secrets.

### Notification Check

1. Trigger an inbound message or outbound failure.
2. Fetch notifications:

   ```bash
   curl -s http://localhost:4000/notifications \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "X-Organization-Id: $ORG_ID"
   ```

3. Mark one notification read.

Expected result:

- Notification appears once.
- Re-triggering same dedupe key updates existing notification.
- Read state applies only to current user.

### Phase Exit Criteria

- Operators can run the inbox without Convex reactive queries.
- Conversation actions are tenant-scoped and role-protected.
- Manual/template replies reuse durable outbound queue.
- Socket.IO emits usable invalidation events.
- Notifications are deduped and readable per user.

