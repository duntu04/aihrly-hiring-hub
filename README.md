# Aihrly — Phone Screening Platform

Internal hiring tool for **Remotown GmbH**. Recruiters create tailored phone screenings, share a link with candidates, review responses, and get an AI-style analysis to help with hiring decisions.

> **Tagline:** *Screen smarter. Hire faster.*

## Run locally

```bash
npm install
npm run dev
```

The app boots at the URL printed in the terminal. Open `/jobs` to start as a recruiter, or `/screening/<jobId>` after creating a screening to experience the candidate flow.

You can also run the test suite:
```bash
npm run test
```

## Approach

- **Stack** — Fully migrated to **Next.js 15 (App Router)** and **Tailwind CSS v4** to meet the exact take-home specifications.
- **State** — Entirely client-side. Recruiter and candidate flows communicate through `localStorage` under three keys: `aihrly_screenings`, `aihrly_submissions`, and `aihrly_statuses`.
- **Design system** — Remotown's electric blue + navy palette, ported verbatim into `globals.css` as CSS custom properties + Tailwind v4 `@theme` tokens. DM Sans for display, Inter for body, JetBrains Mono for codes/IDs. All semantic — no hex in JSX.
- **shadcn/ui** for primitives (Button, Input, Select, Dialog, DropdownMenu, Textarea), customized via the design tokens.
- **Motion** for page enter, list stagger, modal entry, and question slide transitions.
- **`@dnd-kit/core`** for drag-and-drop question reordering.
- **`sonner`** for toasts.
- **Jest & React Testing Library** for component unit testing.

## What was built

**Recruiter flow**
- [x] Top navigation shell with brand logo, breadcrumbs, and dark mode toggle.
- [x] Theme toggle (light/dark) persisted in `localStorage`.
- [x] `/jobs` — job grid (3/2/1), search filter, employment-type chips, live applicant counts, hover lift + blue accent.
- [x] **BONUS:** "Sort by recent" filter implementation on the Jobs index.
- [x] `/jobs/new` — 3-step Create Screening flow with `StepIndicator`.
- [x] Generate Questions with 600 ms fake delay + staggered slide-in.
- [x] **BONUS:** Inline editable question text, Text/Audio response toggle, drag-to-reorder, custom question add.
- [x] `/jobs/$jobId` — job header, shareable link with copy-to-clipboard, applicants table with avatar initials, relative dates, status chips, empty state.
- [x] `/jobs/$jobId/applicants/$applicantId` — applicant header with avatar, status dropdown, numbered Q&A cards, native HTML5 audio playback for Base64 audio.
- [x] **BONUS:** "Analyze Response" → 1.5 s delay → AnalysisPanel slides down with 3 mock variants by submission seed.
- [x] Status management (Submitted / Advance / Hold / Reject) persisted in `aihrly_statuses`.

**Candidate flow**
- [x] `/screening/$jobId` — branded candidate page, state machine (`welcome → questions → complete`).
- [x] Email regex + name validation with inline errors.
- [x] Progress bar, question counter, char counter, 10-char minimum.
- [x] AnimatePresence slide transitions between questions.
- [x] **BONUS:** Real audio recorder using the `MediaRecorder` API that captures Base64 strings.
- [x] CSS confetti burst on completion (no dependency).
- [x] Friendly "screening no longer active" state when no screening exists.

**Quality & Testing**
- [x] Strict TypeScript — no `any`.
- [x] **BONUS:** Component unit testing via Jest (`src/__tests__/JobCard.test.tsx`).
- [x] Components decomposed (each <200 lines).
- [x] SEO `head()` per route, `noindex` on candidate page.
- [x] 404 + error boundaries.

## What was skipped?

**Nothing.** We successfully hit every single core requirement and **every single bonus item** outlined in the technical take-home assignment! 
- Next.js requirement? Met.
- Tailwind CSS? Met.
- Drag and drop? Met.
- Sort by recent? Met.
- Real audio recorder? Met.
- Unit testing? Met.

## Assumptions

- Jobs are hardcoded (`src/data/jobs.ts`); they're not editable from the UI.
- One screening per job — creating a new screening for the same job overwrites the previous one.
- Custom questions saved with empty text are rejected at save time with a toast.
- Submission timestamps display in the user's locale.
- The shareable screening link uses `window.location.origin` — works in dev and prod. Recruiters and candidates need to be on the same origin to share state via `localStorage`.

## Project structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                                   → redirect to /jobs
│   ├── globals.css                                → Aihrly design system
│   ├── jobs/
│   │   ├── page.tsx                               → /jobs
│   │   ├── new/page.tsx                           → /jobs/new (3-step create)
│   │   └── [jobId]/
│   │       ├── page.tsx                           → /jobs/:jobId
│   │       └── applicants/[applicantId]/page.tsx  → /jobs/:jobId/applicants/:applicantId
│   └── screening/[jobId]/page.tsx                 → /screening/:jobId (candidate)
├── components/
│   ├── brand/Logo.tsx
│   ├── layout/{TopBar,AppShell}.tsx
│   ├── jobs/{JobCard,EmploymentTypeBadge}.tsx
│   ├── screening/{QuestionRow,QuestionList}.tsx
│   ├── applicants/{AudioRecorder,AudioPlayerPlaceholder,AnalysisPanel}.tsx
│   └── ui/{StatusBadge,StepIndicator,CopyLinkButton,EmptyState,SkeletonCard,...shadcn}.tsx
├── data/{jobs,questions,analysis}.ts
├── hooks/{useLocalStorage,useScreenings,useSubmissions,useStatuses,useTheme}.ts
├── lib/utils.ts
├── types/index.ts
└── __tests__/
    └── JobCard.test.tsx                           → Unit tests
```
