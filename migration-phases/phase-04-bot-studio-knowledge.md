# Phase 04: Bot Studio, AI Runtime, And Knowledge Base

## Goal

Port Bot Studio, provider configuration, AI preview, knowledge ingestion, chunking, embedding, and retrieval from Convex into the new Express/Prisma/worker architecture.

## Current References

- `packages/backend/convex/configuration.ts`
- `packages/backend/convex/ai.ts`
- `packages/backend/convex/knowledge.ts`
- `packages/backend/convex/knowledgeActions.ts`
- `packages/backend/convex/lib/knowledge.ts`
- `packages/backend/convex/lib/guardrails.ts`
- `packages/backend/convex/lib/aiCost.ts`
- `packages/backend/convex/lib/crypto.ts`
- `apps/web/app/[locale]/dashboard/bot-studio/bot-studio-client.tsx`
- `apps/web/app/[locale]/dashboard/knowledge-base/knowledge-base-client.tsx`

## Target Deliverables

- Bot Studio REST endpoints.
- Provider settings stored with encrypted API keys.
- Prompt versions and AI run logs.
- AI preview endpoint with RAG context support.
- Knowledge source CRUD.
- Inline source ingestion.
- Website source ingestion.
- Optional file ingestion path if storage is available.
- `pgvector` retrieval.
- Tests for guardrails, knowledge chunking, tenant scoping, and preview behavior.

## API Contract

### Bot Studio

- `GET /bot-studio/state`
- `PUT /bot-studio/state`
- `POST /bot-studio/preview-reply`

### Knowledge

- `GET /knowledge/sources`
- `POST /knowledge/sources/inline`
- `POST /knowledge/sources/website`
- `POST /knowledge/sources/upload-url`
- `POST /knowledge/sources/document`
- `DELETE /knowledge/sources/:sourceId`
- `GET /knowledge/usage`

## Detailed Tasks

### 1. Port Shared AI And Guardrail Helpers

- Move prompt injection detection from `packages/backend/convex/lib/guardrails.ts` into `packages/core`.
- Move language detection into `packages/core`.
- Move AI cost estimation into `packages/core`.
- Keep helpers pure and unit tested.
- Do not depend on Express or Prisma in these helpers.

### 2. Port Secret Handling

- Move encryption, decryption, hash, and redaction semantics from Convex helper into `packages/core/security`.
- Use Node `crypto` APIs.
- Require `ENCRYPTION_SECRET`.
- Store:
  - provider API keys encrypted
  - WhatsApp access/app secrets encrypted later in Phase 05
  - verify tokens hashed later in Phase 05
- Ensure frontend responses expose only booleans like `apiKeyConfigured`.

### 3. Implement Bot Studio State

- `GET /bot-studio/state`:
  - requires authenticated organization context
  - returns current bot profile
  - returns active model provider setting
  - returns whether API key is configured
  - returns `canManage` based on role
- `PUT /bot-studio/state`:
  - requires admin role
  - validates bot name, system prompt, model ID, temperature, max tokens
  - validates custom endpoint URL for OpenAI-compatible providers
  - creates or updates bot profile
  - creates or updates active provider setting
  - writes prompt version when prompt content changes
  - writes audit log
  - invalidates Redis runtime cache

### 4. Implement AI Provider Adapter

- Create adapter interface:
  - `generateText(input)`
  - `embedTexts(input)`
- Implement Google provider.
- Implement OpenAI-compatible provider for DigitalOcean/reference endpoint.
- Keep provider timeout and retry policy explicit.
- Do not allow provider calls from controllers directly; go through service methods.

### 5. Implement Preview Reply

- `POST /bot-studio/preview-reply`:
  - requires organization context
  - loads runtime state
  - checks usage limits if Phase 08 is already available; otherwise add a temporary no-op usage guard with TODO
  - applies prompt injection guard
  - retrieves relevant knowledge chunks
  - calls AI adapter
  - logs AI run
  - logs knowledge usage if chunks matched
  - returns content, model, provider, RAG metadata, usage, guardrail result

### 6. Port Knowledge Utilities

- Move these from `packages/backend/convex/lib/knowledge.ts`:
  - markdown normalization
  - document title derivation
  - token estimation
  - markdown chunking
  - HTML to Markdown conversion
  - private/internal URL blocking
  - website fetch logic
  - embedding generation
  - cosine similarity fallback
- Replace Convex storage assumptions with explicit storage adapter interface.
- Keep SSRF protection strict:
  - block localhost
  - block private IPs
  - block link-local IPs
  - block internal hostnames if resolvable
  - require `http` or `https`

### 7. Implement Knowledge Source APIs

- `GET /knowledge/sources`:
  - returns tenant-scoped sources
  - includes recent usage logs
  - includes `botConfigured`
  - includes `canManage`
- `POST /knowledge/sources/inline`:
  - admin only
  - validate bot exists
  - normalize markdown
  - chunk
  - embed chunks
  - store source and chunks in one transaction
  - write audit log
- `POST /knowledge/sources/website`:
  - admin only
  - validate public URL
  - fetch via Jina/Firecrawl/Cheerio strategy
  - normalize, chunk, embed, store
  - for long-running fetches, enqueue `knowledge.ingest`
- `DELETE /knowledge/sources/:sourceId`:
  - admin only
  - verify source belongs to organization
  - delete chunks and source in transaction
  - write audit log

### 8. Implement Vector Retrieval

- Add repository method:
  - `findRelevantKnowledgeChunks({ organizationId, botId, queryEmbedding, topK, minScore })`
- Use `pgvector` nearest-neighbor search where available.
- Keep a pure cosine-similarity fallback for unit tests only.
- Return source title and chunk text for prompt context.

### 9. Cache Strategy

- Cache bot runtime state:
  - key: `tenant:{organizationId}:runtime`
  - invalidate on Bot Studio save
- Optional cache for embeddings:
  - key: `embedding:{model}:{sha256(text)}`
  - safe because identical text and model should produce reusable embedding
- Do not cache secrets decrypted in plaintext.

## Automated Checks

Run:

```bash
pnpm --filter @wabrix/core test
pnpm --filter @wabrix/api test
pnpm --filter @wabrix/worker test
pnpm --filter @wabrix/api typecheck
pnpm --filter @wabrix/worker typecheck
pnpm lint
```

Recommended tests:

- Admin can save Bot Studio state.
- Operator cannot save Bot Studio state.
- API key is encrypted at rest and redacted in responses.
- Prompt version is created when prompt changes.
- Inline source creates source plus chunks.
- Private URL ingestion is rejected.
- Website source uses fallback strategy when primary fetch fails.
- Retrieval is scoped by organization and bot.
- Preview reply includes RAG metadata when knowledge matches.
- Prompt injection guard sanitizes suspicious input.

## Manual Checkup And DoD

### Bot Studio Save Check

1. Login and export token/org id.
2. Save Bot Studio state:

   ```bash
   curl -s -X PUT http://localhost:4000/bot-studio/state \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "X-Organization-Id: $ORG_ID" \
     -H "Content-Type: application/json" \
     -d '{
       "name":"Customer Assistant",
       "defaultLanguage":"auto",
       "systemPrompt":"You are the WhatsApp assistant for this business.",
       "localizedPromptTemplates":{"en":"Answer clearly.","id":"Jawab dengan jelas."},
       "providerType":"google",
       "modelId":"gemini-2.5-flash",
       "apiKey":"replace-with-local-test-key",
       "temperature":0.4,
       "maxTokens":512,
       "escalationEnabled":true,
       "escalationMessage":"A human operator will follow up."
     }'
   ```

Expected result:

- HTTP `200`.
- Response includes bot id and provider state.
- Response does not include raw API key.
- Database stores encrypted API key, not plaintext.
- Audit log exists.

### Bot Studio Read Check

Run:

```bash
curl -s http://localhost:4000/bot-studio/state \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID"
```

Expected result:

- State matches saved fields.
- `apiKeyConfigured` is true.
- Raw encrypted payload is not returned.

### Inline Knowledge Check

Run:

```bash
curl -s -X POST http://localhost:4000/knowledge/sources/inline \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Business Hours","content":"We are open Monday to Friday from 09:00 to 17:00."}'
```

Expected result:

- Source is created with status `ready`.
- At least one chunk exists.
- Embedding exists in vector column.
- Source appears in `GET /knowledge/sources`.

### Website SSRF Check

Run:

```bash
curl -i -X POST http://localhost:4000/knowledge/sources/website \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{"url":"http://127.0.0.1:4000/health"}'
```

Expected result:

- HTTP `400`.
- Error explains private/internal URLs are blocked.
- No knowledge source is stored.

### Preview Reply Check

Run:

```bash
curl -s -X POST http://localhost:4000/bot-studio/preview-reply \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Organization-Id: $ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{"latestUserMessage":"What time are you open?","history":[]}'
```

Expected result:

- Response contains an AI draft.
- `ragContextUsed` is true if the business-hours source was embedded and matched.
- Knowledge source title appears in metadata.
- `aiRuns` row is created.
- `knowledgeUsageLogs` row is created when RAG matches.

### Phase Exit Criteria

- Bot Studio works without Convex.
- Knowledge ingestion and retrieval work from PostgreSQL.
- Secrets are encrypted and redacted.
- Preview endpoint can produce a grounded response.
- Tenant isolation is enforced on all Bot Studio and Knowledge endpoints.

