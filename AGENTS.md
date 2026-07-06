# AGENTS.md - Wuxify

Wuxify is a hobby Next.js project for tracking new Chinese donghua/manhua releases. It is a metadata directory only: titles, covers, status, dates, short public descriptions, and links to source pages.

It must never become a watch/read/streaming site.

## First Principles

When rules conflict, use this order:

1. Correctness and safety: type-safety, error handling, caching, and avoiding AniList rate-limit waste.
2. Scope boundary: no watching, reading, streaming, embedded trailers, previews, or pirated-source links.
3. Practical usefulness for a small friend group.
4. Performance, SEO, accessibility, and visual quality.
5. Nice-to-have process: Sentry, full CI, bundle analysis, decision logs.

## Hard Constraints

- Do not implement features for watching videos, streaming videos, reading chapters, embedding trailers, or previewing story content.
- Do not link to piracy/watch/read sites. External links should go to AniList or official sources only.
- Do not use `any`.
- Do not read `process.env` outside `/lib/env.ts`.
- Do not create an API Route or Server Action for AniList reads.
- Do not use REST endpoints for AniList. Use only `POST https://graphql.anilist.co`.
- Do not fetch AniList with `cache: "no-store"`.
- Do not expose raw AniList response shapes to UI components.
- Do not edit `/components/ui/*` directly. Add or update shadcn components through the shadcn workflow.
- Do not hardcode colors outside the project color tokens.
- Do not use `<img>` for images. Use `next/image`.
- Do not mix icon libraries. Use Phosphor Icons only.

If a user request approaches the content-consumption boundary, stop and ask before coding.

## Tech Stack

Use the actual installed versions in `package.json` as the source of truth. Intended stack:

- Framework: Next.js App Router, TypeScript strict mode, Tailwind CSS
- UI: shadcn/ui plus custom components
- Icons: Phosphor Icons
- Animation: Framer Motion
- Forms: React Hook Form + Zod
- Theme: next-themes
- Deploy target: Vercel
- External data: AniList GraphQL API

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Type-check: `npm run type-check`
- Test: `npm run test`
- Lint: `npm run lint`

Before committing, `npm run lint` must pass. For risky changes, also run type-check and relevant tests.

## Project Layout

Use this structure as the target shape:

- `/app` - App Router pages, layouts, loading/error boundaries, metadata
- `/components/ui` - shadcn components only; do not hand-edit
- `/components` - app-owned UI components
- `/hooks` - custom hooks such as `useDebounce` and `useWatchlist`
- `/lib/api` - AniList GraphQL client, especially `anilistFetch(query, variables)`
- `/lib/api/queries` - GraphQL query strings
- `/lib/env.ts` - Zod-validated environment exports
- `/lib/schemas` - Zod schemas for env, AniList response shapes, forms
- `/lib/mappers` - raw AniList Media response to internal app types
- `/types` - shared app types such as `Media`, `MediaPage`, `AiringSchedule`

UI code must depend on internal types, never on raw AniList response shapes.

## Agent Workflow

Start every task by checking the relevant existing files and local patterns. Prefer the repo's current conventions over inventing new structure.

For UI work:

1. Inspect nearby components, `app/globals.css`, and `tailwind.config.ts` if present.
2. Use existing tokens and components first.
3. Keep new client components small and only add `'use client'` when browser APIs, event handlers, animation state, form state, or LocalStorage require it.
4. Verify responsive behavior at 375px, 768px, and 1280px when the UI meaningfully changes.

For AniList/data work:

1. Verify the AniList GraphQL schema before writing or changing query fields, enum values, Zod schemas, or mappers. Do not guess names such as `MediaSort`, `MediaStatus`, `countryOfOrigin`, or sort values.
2. If live schema access is unavailable, do not invent fields. Use only fields already verified in the repo, or ask for approval to proceed with an explicit assumption.
3. Fetch in Server Components or server-side utilities through `/lib/api`.
4. Validate responses with Zod before mapping.
5. Map validated raw data into internal app types before rendering.
6. Request only fields the page renders.
7. Keep caching and revalidation on every AniList request.

For forms:

1. Put validation in Zod schemas.
2. Use React Hook Form with the matching schema.
3. Show client-side error states for failed submit/search flows.

For watchlist:

1. Keep it client-side only.
2. Use `useWatchlist` plus LocalStorage.
3. Do not add a database, Server Action, OAuth, or AniList account sync unless the user explicitly asks for that larger feature.

## Domain Rules

Wuxify tracks public metadata about Chinese donghua/manhua.

Default definition of "new releases" for the homepage:

- Chinese origin: `countryOfOrigin = CN`
- Donghua: `type = ANIME`
- Manhua: `type = MANGA`
- Release state: prefer `RELEASING` and `NOT_YET_RELEASED`
- Default sort: use the most recently updated or most recent start date field verified from the AniList schema

If the exact GraphQL enum or sort name has not been verified, verify it before implementation.

Allowed metadata:

- Title
- Cover image
- Format
- Status
- Genres
- Latest known episode/chapter/date metadata when available from AniList
- Short AniList `description` as public metadata
- AniList link or official-source link

Not allowed:

- Embedded video
- Trailer embed
- Autoplay or muted video preview
- In-app manga/manhua reader
- Chapter pages/images
- Links to unofficial watch/read sites

Filters should be reflected in URL query parameters so friends can share filtered views.

## AniList API Rules

AniList is the only source of truth for title metadata.

- Endpoint: `https://graphql.anilist.co`
- Method: POST only
- Public browse/search does not require API keys or OAuth
- Rate limit: 90 requests per minute
- Check `X-RateLimit-Remaining` when available
- On `429`, honor `Retry-After`; never retry immediately in a loop
- Parse GraphQL `errors` in the JSON body even when HTTP status is 200
- Log network errors separately from GraphQL errors
- Do not expose stack traces or raw API errors to the client

Use GraphQL efficiently: fetch the fields needed for a page in one query instead of making many small requests. Avoid over-fetching relations such as characters or staff unless the page renders them.

Suggested cache policy:

- Stable metadata such as title, cover, format, and genres: revalidate around 1 day
- Freshness data such as status, airing schedule, and latest update dates: shorter revalidate, but still cached

If AniList is down or rate-limited:

- Show stale cached data when the app has it, with an indicator that it may be outdated.
- If no cached data exists, show: `Data temporarily unavailable, please try again later.`

Before public launch, check AniList Terms of Use for attribution requirements such as "Powered by AniList".

## Design System: Jade Broadcast

The visual direction is "Jade Broadcast": cinematic/broadcast graphics with cool Chinese wuxia tones. Keep it sharp, structured, and metadata-focused.

Use only these color tokens, defined in Tailwind/CSS config:

- `void` - `#070D0B`, main dark background
- `ink` - `#0E2420`, card/panel surface
- `mist` - `#EDF3F0`, text on dark mode and light background
- `jade` - `#16C98A`, primary signal/accent
- `glacier` - `#3FE0E0`, secondary accent, used sparingly

Before relying on `jade` or `glacier` for text or focus states, make sure contrast meets WCAG AA on the target background. If a shade must change, keep it in the same cool color family.

Typography:

- Heading/display: Kanit, weight 700-900
- Body: IBM Plex Sans Thai
- Data labels: IBM Plex Mono
- Load fonts through `next/font/google` in `app/layout.tsx`

Shape and interaction:

- Use sharp edges and low radius, usually 0-4px.
- Use thin borders. Reserve `jade` for active, focus, highlight, and primary CTA states.
- The only glow/pulse signature element is the small `jade` "Signal dot" on new/airing cover cards.
- Cover-card hover may reveal metadata with Framer Motion opacity/scale. It must not show video or story content previews.
- Filter grid reflow should use Framer Motion layout animation around 300ms and never above 400ms.
- Scroll accents may animate opacity or background color only, not layout properties.

Dark mode is the primary/default theme. Light mode is optional and must be handled with next-themes.

## UI Conventions

- Components: named function exports, PascalCase filenames.
- Internal navigation: `next/link`.
- External links: `target="_blank"` and `rel="noopener noreferrer"`.
- Icon-only buttons need `aria-label`.
- Active navigation must be keyboard accessible.
- Use semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>`.
- Search pages should use `<form role="search" aria-label="Search titles">`.
- Detail pages should use `<article aria-labelledby="...">`.
- Cover images need alt text containing the real title, not generic text.
- Use Framer Motion for non-trivial animation. CSS transitions are fine for simple button/link hover, active, and focus states.

## Data Fetching And State

Default to Server Components.

Use Client Components only for:

- React state/effects
- Event handlers
- Framer Motion interactions that need the browser
- Forms
- LocalStorage/watchlist
- Theme toggles

AniList reads:

- Use `fetch()` through `/lib/api`.
- Use POST GraphQL.
- Use cache/revalidate.
- Do not create API Routes or Server Actions for read-only AniList calls.

Client-side fetching should be rare. If truly needed for live search, use SWR and still respect caching/rate-limit behavior.

## Loading, Error, And Empty States

Async routes need `loading.tsx` and `error.tsx` where appropriate.

Empty state copy:

- Search has no results: `No titles found.`
- New releases has no results: `No new releases right now.`
- Watchlist is empty: `Your watchlist is empty.`
- AniList unavailable with no cache: `Data temporarily unavailable, please try again later.`

Never render a blank page for an empty array.

## Testing

Use Vitest and React Testing Library.

Prioritize tests in this order:

1. `/lib/mappers` - important because they isolate raw AniList shapes from UI.
2. `/lib/schemas` - response and form validation.
3. `/lib/api/queries` - query variable names and required fields.
4. Components with logic - at least a smoke test.
5. Pure presentational components - test when behavior, accessibility, or regressions warrant it.

Prefer co-located tests:

- `MediaCard.tsx`
- `MediaCard.test.tsx`

## Accessibility And SEO

Target WCAG AA.

- Every interactive element must be keyboard accessible.
- Visible focus states are required.
- Form inputs need labels.
- Color contrast must meet WCAG AA.
- Export metadata for every page.
- Use `generateMetadata()` for dynamic detail pages.
- Add canonical URLs.
- Structured data for titles should use schema.org `CreativeWork` or a close fit, not `Product`.
- OG images may use AniList cover images only after attribution/license requirements are checked.

## Environment And Secrets

- Validate environment variables with Zod in `/lib/env.ts`.
- Export only validated values.
- Never commit `.env` or `.env.local`.
- Public AniList browse/search needs no key or OAuth.
- If future AniList account sync is requested, add OAuth only then and store tokens through validated env/config paths.

## TypeScript And Imports

- Keep `"strict": true`.
- Never use `any`; prefer precise types, `unknown` with narrowing, or Zod validation.
- Use TypeScript built-in utility types before creating custom ones.
- Use the `@/` alias for app imports.
- Avoid deep relative imports such as `../../../`.

Import order:

1. React / Next
2. Third-party libraries
3. `@/components`
4. `@/lib`
5. `@/types`
6. Relative imports

## Performance

- Use `next/image` for all images.
- Add AniList image domains such as `s4.anilist.co` to `next.config` before rendering covers.
- Avoid full-bundle imports when only a few functions/icons are needed.
- Animate transform and opacity. Avoid layout-heavy animation.
- Fonts must be loaded through `next/font`, not direct Google Fonts CDN links.
- Soft targets before major release: Lighthouse mobile Performance 90+, initial JS under 150KB gzip, initial CSS under 30KB gzip.

## Git And Review

Commit format:

- `[scope] Thai or English description`
- Example: `[ui] add new-release card hover animation`

Before declaring work complete, review:

- No `any`
- No direct `process.env` outside `/lib/env.ts`
- No hardcoded credentials
- No content viewing/reading/streaming feature
- No video embed or preview
- No hardcoded non-token colors
- No direct `<img>`
- AniList queries are schema-verified and not over-fetching
- AniList calls are cached/revalidated
- UI is keyboard accessible
- Responsive behavior is acceptable for changed screens
- Relevant tests/type-check/lint were run or clearly reported as not run

## Nice-To-Have Only

These are not blockers unless the user asks for them:

- Sentry or Logtail
- Full CI/CD
- Vercel preview gates
- Bundle analyzer enforcement
- `DECISIONS.md`

Use `DECISIONS.md` only for hard-to-reverse choices such as changing the definition of "new releases", adding a database, or changing the data source.
