## Stack note

Your spec calls for Next.js 14 App Router, but this Lovable project runs on **TanStack Start** (React 19 + Vite + file-based routing under `src/routes/`). TanStack Start is the only supported stack here — Next.js is not. I'll build the exact same app, design system, data models, and behavior, just translated to TanStack Start conventions:

- `src/app/jobs/page.tsx` → `src/routes/jobs/index.tsx`
- `src/app/jobs/[jobId]/page.tsx` → `src/routes/jobs/$jobId/index.tsx`
- `src/app/jobs/[jobId]/applicants/[applicantId]/page.tsx` → `src/routes/jobs/$jobId/applicants/$applicantId.tsx`
- `src/app/screening/[jobId]/page.tsx` → `src/routes/screening/$jobId.tsx`
- `src/app/jobs/new/page.tsx` → `src/routes/jobs/new.tsx`
- Root layout with sidebar/topbar lives in `src/routes/__root.tsx` (or a `_app` layout route wrapping recruiter pages so the candidate `/screening/$jobId` page can opt out of the shell)
- No `'use client'` directives needed — TanStack Start client components are the default
- Tailwind v4 tokens defined in `src/styles.css` via `@theme` (oklch + hex both supported); spec's hex palette ported verbatim
- Toasts via `sonner` (already available)

Everything else — design system, components, data models, localStorage schema, motion specs, routes, validation — built exactly as specified.

## What I'll build

**Design system (`src/styles.css`)**
- Port full Remotown palette (electric blue #1B6EF3, navy #0A1628, sky #E8F1FF, etc.) as CSS custom properties + Tailwind tokens
- Typography: DM Sans (display), Inter (body), JetBrains Mono — loaded via Google Fonts in `__root.tsx` head
- Card radius 12px, subtle shadows, shimmer keyframes, status chip styles
- Light + dark mode tokens (bonus)

**Shared UI primitives (`src/components/ui/`)**
- `StatusBadge`, `StepIndicator`, `CopyLinkButton`, `SkeletonCard`, `EmptyState`
- Reuse existing shadcn components (Dialog, Select, Input, Textarea, Badge, etc.)

**Layout (`src/components/layout/`)**
- `Sidebar` (dark navy, Lucide icons, active blue left-border, collapses to bottom tab bar on mobile)
- `TopBar` (breadcrumbs, theme toggle, primary CTA slot)
- `AppShell` wrapping recruiter pages

**Data layer**
- `src/data/jobs.ts` — 4 hardcoded jobs from spec
- `src/data/questions.ts` — 6 tailored questions per job + 5 generic defaults
- `src/types/index.ts` — all interfaces from spec
- `src/hooks/useLocalStorage.ts`, `useScreenings.ts`, `useSubmissions.ts`, `useStatuses.ts`

**Pages**
1. `/` → redirect to `/jobs`
2. `/jobs` — sidebar shell, job grid (3/2/1 col), search filter, employment-type chips, applicant counts from localStorage, empty state
3. `/jobs/new` — 3-step Create Screening flow with `StepIndicator`, generate-questions fake delay (600ms) + staggered slide-in, inline edit, drag-to-reorder via `@dnd-kit/core`, response-type toggle, save → redirect
4. `/jobs/$jobId` — job header card, shareable link panel with copy button, applicants table (avatar initials, relative dates, status chips), empty state
5. `/jobs/$jobId/applicants/$applicantId` — applicant header, numbered Q&A cards, audio-placeholder with fake waveform, "Analyze Response" → 1500ms delay → AnalysisPanel slides down (3 mock variants by index), status management dropdown
6. `/screening/$jobId` — no shell, branded candidate page, state machine (welcome → questions → complete), email regex validation, progress bar, char counter, AnimatePresence question transitions, CSS confetti on complete, persists Submission to localStorage

**Motion**
- Framer Motion (`motion` package) for page enter, list stagger, modal entry, question slide transitions
- `react-beautiful-dnd` is dead — using `@dnd-kit/core` per spec bonus

**Bonus features included**
- Drag-and-drop question reordering (@dnd-kit)
- Light/dark mode toggle persisted in localStorage
- Edit-in-place question text
- Search + filter on jobs page
- Live applicant counts on job cards
- Applicant status management (Advance/Hold/Reject) persisted under `aihrly_statuses`

**Quality bar**
- Strict TypeScript, no `any`
- Every component <200 lines, decomposed
- All icon-only buttons have `aria-label`
- Focus-visible rings, keyboard nav
- Semantic Tailwind tokens only — no raw hex in JSX
- Skeleton shimmer for loading states

**README.md** with run instructions, approach, feature checklist, trade-offs, assumptions.

## Dependencies to add

`motion` (Framer Motion successor), `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`. Sonner, Lucide, shadcn primitives already present.

## What I'll skip / adjust

- **Next.js App Router** → TanStack Start file-based routing (functionally equivalent, framework-imposed)
- **No backend / no auth** — matches spec
- **Audio recording** — UI placeholder only, matches spec
- **AI** — mocked with fake delays, matches spec

Ready to build on your approval.