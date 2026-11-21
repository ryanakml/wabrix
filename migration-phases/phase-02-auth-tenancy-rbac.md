# Phase 02: Auth, Tenancy, And RBAC

## Goal

Replace Clerk-dependent identity assumptions with first-party JWT auth, database-backed organizations, memberships, and role checks. This phase creates the security foundation required by every tenant-scoped feature.

## Current References

- `packages/backend/convex/users.ts`
- `packages/backend/convex/rbac.ts`
- `packages/backend/convex/http.ts` Clerk webhook handling
- `apps/web/middleware.ts`
- `apps/web/providers/convex-client-provider.tsx`
- `apps/web/app/[locale]/onboarding/page.tsx`
- `apps/web/app/[locale]/dashboard/layout.tsx`

## Target Deliverables

- Auth module in `apps/api/src/modules/auth`.
- Organization module in `apps/api/src/modules/organizations`.
- JWT middleware in `apps/api/src/middlewares/auth.ts`.
- Organization context middleware in `apps/api/src/middlewares/organization-context.ts`.
- Role guard middleware in `apps/api/src/middlewares/require-role.ts`.
- Password hashing through `argon2`.
- Refresh token rotation with database persistence.
- Tenant isolation tests.

## Data Models Needed

At minimum:

- `User`
  - `id`
  - `email`
  - `passwordHash`
  - `firstName`
  - `lastName`
  - `imageUrl`
  - `createdAt`
  - `updatedAt`
- `Organization`
  - `id`
  - `name`
  - `slug`
  - `imageUrl`
  - `createdAt`
  - `updatedAt`
- `OrganizationMember`
  - `id`
  - `userId`
  - `organizationId`
  - `role`
  - `createdAt`
  - `updatedAt`
- `RefreshToken`
  - `id`
  - `userId`
  - `tokenHash`
  - `familyId`
  - `expiresAt`
  - `revokedAt`
  - `replacedByTokenId`
  - `createdAt`
- `AuditLog`
  - `id`
  - `organizationId`
  - `userId`
  - `action`
  - `details`
  - `createdAt`

## Detailed Tasks

### 1. Define Auth Contract

- Add request/response schemas in `packages/shared`.
- Standardize response shape:
  - success: `{ data: ... }`
  - error: `{ error: { code, message, details? } }`
- Add schemas for:
  - register
  - login
  - refresh
  - logout
  - current user
  - organization creation
  - organization membership update

### 2. Implement Password Auth

- Add `argon2`.
- Registration flow:
  - normalize email to lowercase
  - validate password minimum policy
  - hash password using `argon2id`
  - create user
  - create first organization if request includes organization name
  - create owner/admin membership
  - write audit log
  - issue access and refresh tokens
- Login flow:
  - lookup user by normalized email
  - verify password
  - reject deleted/disabled users if such fields are added
  - issue access and refresh tokens
  - include available organizations and active organization candidate

### 3. Implement JWTs

- Access token:
  - short TTL, recommended 15 minutes
  - signed with `JWT_ACCESS_SECRET`
  - includes `sub`, `email`, and optionally active organization id
- Refresh token:
  - long TTL, recommended 7 to 30 days
  - signed or random opaque token
  - store only hash in database
  - rotate on every refresh
  - revoke token family on reuse detection
- Add helpers in `packages/core/auth`.

### 4. Implement Auth Middleware

- Read `Authorization: Bearer <token>`.
- Verify access token signature and expiry.
- Load user from database.
- Attach `req.user`.
- Never trust organization id from token alone for authorization decisions. Validate membership against database when selecting organization context.

### 5. Implement Organization Context

- Accept active org from one of:
  - `X-Organization-Id` header
  - route parameter where appropriate
  - user default organization if explicitly implemented
- Validate membership exists.
- Attach `req.organization` and `req.membership`.
- Reject missing org on tenant-scoped routes with HTTP `400` or `403`, not silent fallback.

### 6. Implement RBAC

- Define roles:
  - `owner`
  - `admin`
  - `operator`
  - optional `viewer`
- Map current Clerk roles:
  - `org:admin` becomes `admin` or `owner`
  - `org:member` becomes `operator`
- Add role guards:
  - owner/admin can manage billing, WhatsApp integration, Bot Studio, knowledge sources, members
  - operator can operate inbox and send replies
  - viewer can read dashboard state only if added
- Add a single authorization helper that every module uses.

### 7. Implement Organization APIs

- `GET /me`
- `GET /organizations`
- `POST /organizations`
- `GET /organizations/:organizationId/members`
- `PATCH /organizations/:organizationId/members/:memberId`
- Optional:
  - `DELETE /organizations/:organizationId/members/:memberId`
  - `POST /organizations/:organizationId/invitations`

### 8. Audit Logging

- Port the current audit concept.
- Log:
  - user registered
  - organization created
  - membership role changed
  - login failed only if useful for security monitoring
  - refresh token reuse detected
- Never log raw passwords, tokens, or secrets.

## Automated Checks

Run:

```bash
pnpm --filter @wabrix/api test
pnpm --filter @wabrix/api typecheck
pnpm --filter @wabrix/core test
pnpm --filter @wabrix/shared typecheck
pnpm lint
```

Recommended test cases:

- Register creates user, organization, owner/admin membership.
- Register rejects duplicate email.
- Login rejects invalid password.
- Login returns access and refresh tokens.
- Refresh rotates refresh token.
- Reusing an old refresh token revokes the token family.
- Auth middleware rejects missing, expired, and malformed tokens.
- Org middleware rejects access to organizations where the user is not a member.
- Role guard rejects operator access to admin-only endpoints.

## Manual Checkup And DoD

### Registration Check

1. Start Postgres, Redis, and API.
2. Register a user:

   ```bash
   curl -s -X POST http://localhost:4000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"owner@example.com","password":"StrongPassword123!","organizationName":"Demo Org"}'
   ```

3. Inspect response.

Expected result:

- Response includes access token, refresh token, user data, and one organization.
- Response does not include `passwordHash`.
- Database has one user, one organization, one membership, and one audit log.

### Login Check

1. Login:

   ```bash
   curl -s -X POST http://localhost:4000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"owner@example.com","password":"StrongPassword123!"}'
   ```

2. Save the access token:

   ```bash
   export ACCESS_TOKEN="paste-token-here"
   export ORG_ID="paste-org-id-here"
   ```

Expected result:

- Login succeeds with correct password.
- Login fails with incorrect password.
- Tokens are different between login attempts.

### Current User Check

Run:

```bash
curl -i http://localhost:4000/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID"
```

Expected result:

- HTTP `200`.
- Response includes active organization and membership role.
- No secrets are returned.

### Tenant Isolation Check

1. Register a second user and org.
2. Use first user's token with second org id:

   ```bash
   curl -i http://localhost:4000/me \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "X-Organization-Id: second-org-id"
   ```

Expected result:

- HTTP `403`.
- Response says membership is missing or forbidden.
- No data from the second organization is returned.

### Refresh Rotation Check

1. Call refresh with the current refresh token.
2. Call refresh again with the old refresh token.

Expected result:

- First refresh succeeds and returns a new refresh token.
- Second refresh with the old token fails.
- Token family is revoked if reuse detection is implemented.

### Phase Exit Criteria

- Clerk is no longer needed for new API authorization.
- Every tenant-scoped route has authenticated user and verified organization context.
- Role guards are reusable and tested.
- Auth responses never leak password hashes or token hashes.
- Migration can proceed without building feature modules on top of Clerk assumptions.

