# Aihrly — Phone Screening Platform

Internal hiring tool for **Remotown GmbH**. Recruiters create tailored phone screenings, share a link with candidates, review responses, and get an AI-style analysis to help with hiring decisions.

> **Tagline:** *Screen smarter. Hire faster.*

## Run locally

```bash
bun install
bun run dev
```

The app boots at the URL printed in the terminal. Open `/jobs` to start as a recruiter, or `/screening/<jobId>` after creating a screening to experience the candidate flow.

## Approach

- **Stack note** — the original spec asked for Next.js 14 App Router. This Lovable project ships on **TanStack Start** (React 19 + Vite + file-based routing), which is the only supported stack here. I ported the spec verbatim — same design system, components, data models, localStorage schema, motion specs, and behavior — and translated the routing layer to TanStack Start conventions (`src/routes/jobs/$jobId/...` instead of `app/jobs/[jobId]/...`).
- **State** — entirely client-side. Recruiter and candidate flows communicate through `localStorage` under three keys: `aihrly_screenings`, `aihrly_submissions`, and `aihrly_statuses`.
- **Design system** — Remotown's electric blue + navy palette, ported verbatim into `src/styles.css` as CSS custom properties + Tailwind v4 `@theme` tokens. DM Sans for display, Inter for body, JetBrains Mono for codes/IDs. All semantic — no hex in JSX.
- **shadcn/ui** for primitives (Button, Input, Select, Dialog, DropdownMenu, Textarea), customized via the design tokens.
- **Motion** for page enter, list stagger, modal entry, and question slide transitions.
- **`@dnd-kit/core`** for drag-and-drop question reordering (react-beautiful-dnd is unmaintained).
- **`sonner`** for toasts.

## What was built

Recruiter flow
- [x] Sidebar shell with dark navy nav, blue active accent, mobile bottom tab bar
- [x] Theme toggle (light/dark) persisted in `localStorage`
- [x] `/jobs` — job grid (3/2/1), search filter, employment-type chips, live applicant counts, hover lift + blue accent
- [x] `/jobs/new` — 3-step Create Screening flow with `StepIndicator`
- [x] Generate Questions with 600 ms fake delay + staggered slide-in
- [x] Inline editable question text, Text/Audio response toggle, drag-to-reorder, custom question add
- [x] `/jobs/$jobId` — job header, shareable link with copy-to-clipboard, applicants table with avatar initials, relative dates, status chips, empty state
- [x] `/jobs/$jobId/applicants/$applicantId` — applicant header with avatar, status dropdown, numbered Q&A cards, audio waveform placeholder, "Analyze Response" → 1.5 s delay → AnalysisPanel slides down with 3 mock variants by submission seed
- [x] Status management (Submitted / Advance / Hold / Reject) persisted in `aihrly_statuses`

Candidate flow
- [x] `/screening/$jobId` — branded candidate page (no sidebar), state machine (`welcome → questions → complete`)
- [x] Email regex + name validation with inline errors
- [x] Progress bar, question counter, char counter, 10-char minimum
- [x] AnimatePresence slide transitions between questions
- [x] Audio placeholder with disabled mic + text fallback
- [x] CSS confetti burst on completion (no dependency)
- [x] Friendly "screening no longer active" state when no screening exists

Quality
- [x] Strict TypeScript — no `any`
- [x] All icon-only buttons have `aria-label`
- [x] `focus-visible:ring` on all interactive elements via shadcn defaults
- [x] No raw hex colors in JSX
- [x] Components decomposed (each <200 lines)
- [x] SEO `head()` per route, `noindex` on candidate page
- [x] 404 + error boundaries

## What was skipped and why

- **Next.js App Router** — replaced with TanStack Start file-based routing (functionally equivalent; the platform doesn't support Next.js).
- **Real audio recording** — UI placeholder only, matches spec. Adding real recording would require `MediaRecorder` plumbing, upload to a storage backend, and a player. Spec calls this out as out of scope.
- **Real AI** — both "Generate Questions" and "Analyze Response" return seeded mock data with realistic latency. Spec calls this out as out of scope.
- **Backend / auth** — entirely client-side per spec. Recruiter pages assume "logged in".
- **Future tabs** (Applicants, Settings in the sidebar) — rendered as disabled "coming soon" entries to preserve the IA without shipping empty pages.

## Assumptions

- Jobs are hardcoded (`src/data/jobs.ts`); they're not editable from the UI.
- One screening per job — creating a new screening for the same job overwrites the previous one.
- Custom questions saved with empty text are rejected at save time with a toast.
- Submission timestamps display in the user's locale.
- The shareable screening link uses `window.location.origin` — works in dev and prod. Recruiters and candidates need to be on the same origin to share state via `localStorage`.

## Time spent

Roughly 2 hours end-to-end: 30 min on design tokens + shell + types/data, 60 min on recruiter pages + screening creation flow, 30 min on the candidate flow + polish (motion, confetti, validation states).

## Project structure

```
src/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx                                  → redirect to /jobs
│   ├── jobs/
│   │   ├── index.tsx                              → /jobs
│   │   ├── new.tsx                                → /jobs/new (3-step create)
│   │   └── $jobId/
│   │       ├── index.tsx                          → /jobs/:jobId
│   │       └── applicants/$applicantId.tsx        → /jobs/:jobId/applicants/:applicantId
│   └── screening/$jobId.tsx                       → /screening/:jobId (candidate)
├── components/
│   ├── brand/Logo.tsx
│   ├── layout/{Sidebar,TopBar,AppShell}.tsx
│   ├── jobs/{JobCard,EmploymentTypeBadge}.tsx
│   ├── screening/{QuestionRow,QuestionList}.tsx
│   ├── applicants/{AudioPlayerPlaceholder,AnalysisPanel}.tsx
│   └── ui/{StatusBadge,StepIndicator,CopyLinkButton,EmptyState,SkeletonCard,...shadcn}.tsx
├── data/{jobs,questions,analysis}.ts
├── hooks/{useLocalStorage,useScreenings,useSubmissions,useStatuses,useTheme}.ts
├── lib/utils.ts
├── types/index.ts
└── styles.css                                     → Aihrly design system
```
