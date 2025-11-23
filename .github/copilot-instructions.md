<!--
Guidance for AI coding agents working on the EnglishFlow / dailyeng repo.
Keep this file concise and actionable — focus on codebase-specific patterns,
workflows, and files to reference when making changes.
-->

# Copilot / AI Agent Instructions (concise)

- Purpose: Help an AI agent be productive quickly. Prioritize understanding the
  App Router layout, MSW mocking, SRS logic, and the UI component patterns.

- Quick start (recommended):
  - Install: `pnpm install` (repo contains `pnpm-lock.yaml`), or `npm install`.
  - Dev server: `pnpm dev` or `npm run dev` (Next.js App Router at `app/`).
  - Run tests: `pnpm test` or `npm run test` (Vitest). See `vitest.config.ts`.

- High-level architecture — what to know first:
  - `app/` contains Next.js 14 App Router routes and layouts. Most pages live
    under `app/<feature>/...` and use React Server Components where appropriate.
  - `components/` contains UI building blocks. `components/ui/` holds shadcn-UI
    wrappers and primitives; other subfolders group feature components
    (e.g. `components/flashcard`, `components/speaking`). Prefer reusing
    `components/ui/*` patterns for consistent UX.
  - `lib/` contains core client logic and services:
    - `lib/api.ts`: type-safe fetch helpers and API patterns.
    - `lib/auth.ts`: mock auth (localStorage) — replace with real provider
      only when intentionally switching off MSW.
    - `lib/srs.ts`: SM-2 spaced repetition algorithm — central to review flows.
    - `lib/store.ts`: Zustand store used across UIs.
  - `types/index.ts`: canonical Zod schemas and TS types — always validate
    shapes against these before changing API contracts.

- Mocking & API: how data flows in development
  - MSW is enabled by default; handlers live in `mocks/handlers.ts` and server
    setup in `mocks/server.ts` / `mocks/browser.ts`. Tests also use MSW.
  - To switch to a real backend, remove MSW bootstrap in `app/layout.ts` and
    adjust `lib/api.ts` for real endpoints. Note: tests and many components
    expect mock data shapes defined in `types/index.ts`.

- Testing & test helpers
  - Tests: Vitest configured (`vitest.config.ts`, `vitest.setup.ts`).
  - Unit tests to inspect for patterns: `lib/srs.test.ts`, `types/index.test.ts`.
  - Use MSW when writing tests that hit API routes; add handlers to
    `mocks/handlers.ts` and include realistic responses matching Zod schemas.

- Conventions and patterns to follow
  - Types-first: Authoritative shapes live in `types/index.ts`. Use Zod for
    validation and infer types where possible.
  - UI composition: Small primitives in `components/ui/*`. For new UI, add
    feature components under `components/<feature>/` and reuse primitives.
  - State: Global/sync state goes in `lib/store.ts` (Zustand); ephemeral UI
    state should live in components or local hooks (see `hooks/`).
  - Files that accept `topicId` or dynamic params use folder route
    conventions in `app/[topicId]/` (App Router). Use `params` and `searchParams`
    from Next.js route handlers consistently.

- Key files to inspect when changing behavior
  - Routing & layout: `app/layout.tsx`, `app/page.tsx`, `app/**/page.tsx`
  - Mocking: `mocks/handlers.ts`, `mocks/server.ts`, `mocks/browser.ts`
  - API helpers: `lib/api.ts`
  - Auth: `lib/auth.ts` (mock localStorage-based flows)
  - SRS logic: `lib/srs.ts` (+ `lib/srs.test.ts`)
  - Types: `types/index.ts` (Zod schemas)
  - State: `lib/store.ts`
  - Component primitives: `components/ui/*` and `components/layout/*`

- PR & developer workflow notes
  - Keep MSW handlers updated when changing endpoints or response shapes.
  - Update or add Zod schemas in `types/index.ts` when changing data shapes.
  - Run `pnpm test` and ensure MSW-backed tests pass locally before PRs.

- Example actionable tasks (how to implement safely)
  - Add new API endpoint (dev-first):
    1. Add handler in `mocks/handlers.ts` with response matching Zod schema.
    2. Add client helper in `lib/api.ts` and types in `types/index.ts`.
    3. Add UI under `app/<feature>/` and component under `components/<feature>/`.
    4. Add unit tests and update MSW handlers for test scenarios.
  - Replace mock auth with real provider:
    1. Remove MSW bootstrap in `app/layout.tsx` (intentional change).
    2. Replace `lib/auth.ts` implementation and adjust `lib/api.ts` auth
       headers accordingly.
    3. Update tests to stub auth or re-enable MSW test helpers.

- When unsure: prefer minimal, reversible changes and reference the files
  listed above. After implementing behavior changes, update `mocks/` and
  `types/index.ts` so mocks, tests, and runtime stay in sync.

---
If anything above is unclear or you want a longer checklist (e.g., where to
run and validate locally on Windows/Powershell), tell me which area to expand.
