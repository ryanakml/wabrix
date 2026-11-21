# Phase 09: Frontend Vite Consolidation

## Goal

Replace the two current Next.js web apps and Convex/Clerk client wiring with one React + Vite dashboard that talks to the Express API through TanStack Query and receives realtime updates through Socket.IO.

## Current References

- `apps/web`
- `apps/web-2`
- `apps/web/app/[locale]/dashboard/*`
- `apps/web/messages/en.json`
- `apps/web/messages/id.json`
- `apps/web-2/src/features/*`
- `apps/web-2/src/components/ui/*`
- `apps/web-2/src/components/layout/*`
- `apps/web-2/public/*`

## Target Deliverables

- One Vite React app.
- Internal auth screens.
- Organization switcher.
- API client package or module.
- TanStack Query provider and hooks.
- Socket.IO client provider.
- Migrated product screens:
  - public landing
  - pricing
  - onboarding
  - dashboard overview
  - Bot Studio
  - Knowledge Base
  - WhatsApp Integration
  - Inbox/Chat
  - Contacts
  - Billing
  - Analytics
  - Notifications
- No `convex/react`.
- No `@clerk/nextjs`.
- No Next.js API dependency.

## Frontend Source Selection

Use the existing apps deliberately:

- Use `apps/web` for behavior parity because it maps directly to current completed flows and tests.
- Use `apps/web-2` for richer layout, public pages, dashboard shell, notifications, contacts, chat UI, and assets.
- Do not migrate mock product/user admin modules unless they are still product requirements.
- Do not keep both web apps long term.

## Detailed Tasks

### 1. Decide Target App Path

Recommended:

- Replace `apps/web` with Vite only after the new Vite app works.
- During migration, create `apps/dashboard` or `apps/web-vite`.
- Rename later if required.

This avoids breaking the existing Next.js reference UI while backend work is still being verified.

### 2. Scaffold Vite

- Add Vite React TypeScript app.
- Add Tailwind CSS.
- Add routing with React Router or TanStack Router.
- Add TanStack Query.
- Add Socket.IO client.
- Add form utilities already used or preferred.
- Add toast library.
- Add shared UI imports from `packages/ui` or copy mature components from `apps/web-2`.

### 3. Build API Client

Create `src/lib/api-client.ts` or `packages/shared-client`:

- central `fetchJson` wrapper
- base URL from `VITE_API_BASE_URL`
- attach access token
- attach active `X-Organization-Id`
- handle refresh token flow
- normalize API errors
- logout on refresh failure

Recommended modules:

- `auth`
- `organizations`
- `botStudio`
- `knowledge`
- `whatsapp`
- `inbox`
- `contacts`
- `notifications`
- `billing`
- `analytics`

### 4. Build Auth State

- Login page.
- Register page.
- Token storage strategy:
  - safest: refresh token in httpOnly cookie if API supports it
  - acceptable for local MVP: secure storage with clear risk documentation
- Current user loader.
- Protected route wrapper.
- Logout flow.

Replace:

- Clerk `SignIn`
- Clerk `OrganizationList`
- Clerk `OrganizationSwitcher`
- Clerk `UserButton`
- Clerk middleware behavior

### 5. Build Organization Context

- Organization selector.
- Create organization modal/page.
- Active org persistence.
- Membership role display.
- Role-aware navigation.
- Ensure API client sends `X-Organization-Id`.

### 6. Migrate Layout And Public Pages

From `apps/web-2`, port:

- landing page
- pricing page
- public docs/security pages if still desired
- dashboard shell
- sidebar
- header
- theme system if compatible
- static images/assets

Keep route set intentionally small if delivery speed matters.

### 7. Migrate Bot Studio

Replace Convex hooks:

- `useQuery(api.configuration.getBotStudioState)` -> `useQuery(["bot-studio"], apiClient.botStudio.getState)`
- `useMutation(api.configuration.saveBotStudioState)` -> `useMutation(apiClient.botStudio.saveState)`
- `useAction(api.ai.previewBotReply)` -> `useMutation(apiClient.botStudio.previewReply)`

Manual UI requirements:

- show missing runtime as API connectivity error, not Convex env error
- save provider settings
- preserve API key placeholder behavior
- preview replies
- show RAG metadata

### 8. Migrate Knowledge Base

Replace:

- knowledge state query
- ingest action
- delete mutation
- upload URL mutation

UI requirements:

- inline source
- website source
- file/document path if API supports it
- source list
- source preview
- recent usage
- SSRF/private URL error display
- admin-only management controls

### 9. Migrate WhatsApp Integration

Replace:

- integration state query
- save integration mutation
- template save/archive mutation
- template sync action
- lifecycle refresh action
- phone verification actions

UI requirements:

- show webhook URL from `VITE_API_BASE_URL` or `VITE_PUBLIC_INGRESS_URL`
- show configured booleans, not secrets
- show WABA lifecycle state
- show template list and rejection reasons
- show webhook verification state

### 10. Migrate Inbox And Chat

Use best pieces from both apps:

- `apps/web` inbox behavior is complete.
- `apps/web-2` chat UI may be more polished.

Replace Convex query/action hooks with:

- `GET /inbox/workspace`
- conversation action mutations
- translation endpoint
- Socket.IO invalidation

UI requirements:

- conversation list
- search and sort
- selected thread
- assignment
- pause/resume bot
- handoff
- close/reopen
- internal notes
- manual reply
- template reply
- service-window warning
- delivery states
- queue/failure visibility
- optional translation

### 11. Migrate Notifications

- Notification center.
- Browser notification prompt.
- Web push subscription save/delete.
- Mark read.
- Mark all read.
- Socket event updates.

### 12. Migrate Billing And Analytics

- Pricing page calls static plan config or API plans.
- Billing dashboard calls `GET /billing/dashboard`.
- Checkout calls `POST /billing/checkout`.
- Analytics calls `GET /analytics/dashboard`.
- Overview widgets call overview endpoints.

### 13. Remove Frontend Env Assumptions

Replace:

- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_HTTP_URL`
- Clerk public key
- Next-specific env access

With:

- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`
- `VITE_DEFAULT_LOCALE`
- `VITE_PUBLIC_INGRESS_URL` if ingress is separate

### 14. Frontend Realtime Strategy

On Socket.IO events:

- invalidate relevant TanStack Query keys first.
- use direct cache patching only after behavior is stable.

Example mapping:

- `conversation.updated` -> invalidate `["inbox"]`, `["conversation", id]`
- `message.created` -> invalidate `["inbox"]`, `["conversation", conversationId]`
- `notification.created` -> invalidate `["notifications"]`
- `billing.updated` -> invalidate `["billing"]`

## Automated Checks

Run:

```bash
pnpm --filter @wabrix/web-vite typecheck
pnpm --filter @wabrix/web-vite lint
pnpm --filter @wabrix/web-vite test
pnpm --filter @wabrix/web-vite build
pnpm lint
```

Adjust package name based on the chosen app path.

Recommended tests:

- Auth forms submit expected API payloads.
- Protected routes redirect when unauthenticated.
- Organization switcher changes active organization header.
- Bot Studio saves and previews.
- Knowledge source creation handles success and SSRF error.
- WhatsApp setup does not render secrets.
- Inbox manual reply calls correct endpoint.
- Socket event invalidates expected query key.
- Billing checkout opens returned URL.

## Manual Checkup And DoD

### App Boot Check

Run:

```bash
pnpm --filter @wabrix/web-vite dev
```

Expected result:

- App boots without Next.js.
- Browser console has no missing Convex/Clerk env errors.
- API base URL is visible in config diagnostics if implemented.

### Auth Flow Check

1. Register a new user.
2. Create organization.
3. Logout.
4. Login again.

Expected result:

- Auth works without Clerk.
- Active organization is selected.
- Protected dashboard routes require login.

### Bot Studio UI Check

1. Open `/dashboard/bot-studio`.
2. Save bot settings.
3. Preview a reply.

Expected result:

- Data persists after refresh.
- API key field does not display saved key.
- Preview shows response and RAG metadata.

### Knowledge UI Check

1. Add inline source.
2. Add public website source.
3. Try private URL.
4. Delete source.

Expected result:

- Sources list updates.
- Private URL displays clear error.
- Deleted source disappears and is removed from retrieval.

### WhatsApp UI Check

1. Save integration settings.
2. Copy webhook URL.
3. Trigger lifecycle refresh or template sync.

Expected result:

- UI shows configured state.
- Secrets are never displayed.
- Template/lifecycle status updates after API response or socket invalidation.

### Inbox UI Check

1. Seed or receive an inbound message.
2. Open `/dashboard/inbox`.
3. Select conversation.
4. Pause bot.
5. Add note.
6. Send manual reply inside service window.
7. Send template reply outside service window.

Expected result:

- Conversation list and thread render.
- Actions update UI after REST response and/or socket event.
- Manual reply creates queued outbound state.
- Freeform reply is blocked outside service window.
- Template reply remains available when approved.

### Realtime Check

1. Open dashboard in two browser windows.
2. Trigger an inbound message or conversation action in one window.

Expected result:

- Other window updates without manual refresh.
- Network tab shows Socket.IO connection.
- No cross-org updates appear.

### Billing UI Check

1. Open billing dashboard.
2. Start checkout.
3. Open analytics.

Expected result:

- Billing data comes from Express API.
- Checkout uses returned provider URL.
- Analytics cards/charts render from new endpoints.

### Phase Exit Criteria

- Main dashboard works from Vite.
- No runtime dependency on Convex React hooks.
- No runtime dependency on Clerk components.
- No Next.js API route is needed for migrated flows.
- Socket.IO + TanStack Query provide acceptable realtime behavior.

