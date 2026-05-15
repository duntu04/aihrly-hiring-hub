import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Clock, Loader2, Mail, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AudioPlayerPlaceholder } from "@/components/applicants/AudioPlayerPlaceholder";
import { AnalysisPanel } from "@/components/applicants/AnalysisPanel";
import { getJobById } from "@/data/jobs";
import { getMockAnalysis } from "@/data/analysis";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useStatuses } from "@/hooks/useStatuses";
import { colorFromString, formatLongDate, getInitials } from "@/lib/utils";
import type { Recommendation } from "@/types";

export const Route = createFileRoute("/jobs/$jobId/applicants/$applicantId")({
  loader: ({ params }) => {
    const job = getJobById(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Response — ${loaderData?.job.title ?? "Applicant"} — Aihrly` }],
  }),
  component: ApplicantDetailPage,
});

function ApplicantDetailPage() {
  const { job } = Route.useLoaderData();
  const { jobId, applicantId } = Route.useParams();
  const { getById } = useSubmissions();
  const { getScreeningForJob } = useScreenings();
  const { getStatus, setStatus } = useStatuses();

  const submission = getById(applicantId);
  const screening = getScreeningForJob(jobId);

  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const analysis = useMemo(() => (submission ? getMockAnalysis(submission.id) : null), [submission]);

  if (!submission) {
    return (
      <AppShell crumbs={[{ label: "Jobs", to: "/jobs" }, { label: job.title, to: "/jobs/$jobId" }, { label: "Not found" }]}>
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-10 text-center">
          <h2 className="font-display text-xl font-semibold">Applicant not found</h2>
          <p className="mt-2 text-sm text-text-secondary">This response may have been removed.</p>
          <Link to="/jobs/$jobId" params={{ jobId }} className="inline-block mt-4">
            <Button variant="outline" className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to applicants</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const status = getStatus(submission.id);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setShowAnalysis(false);
    setTimeout(() => {
      setAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  const setReco = (r: Recommendation) => {
    setStatus(submission.id, r);
  };

  return (
    <AppShell
      crumbs={[
        { label: "Jobs", to: "/jobs" },
        { label: job.title, to: "/jobs/$jobId" },
        { label: submission.candidateName },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <Link
          to="/jobs/$jobId"
          params={{ jobId }}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to {job.title}
        </Link>

        {/* Applicant header */}
        <section className="rounded-xl border border-border bg-card shadow-card p-6 sm:p-8">
          <div className="flex items-start gap-4 flex-wrap">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white font-semibold text-lg"
              style={{ background: colorFromString(submission.candidateName) }}
            >
              {getInitials(submission.candidateName)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold leading-tight">{submission.candidateName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {submission.candidateEmail}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Submitted on {formatLongDate(submission.submittedAt)}
                </span>
              </div>
              <div className="mt-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" aria-label="Change status" className="inline-flex">
                      <StatusBadge variant={status === "submitted" ? "submitted" : status} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setReco("advance")}>Advance</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReco("hold")}>On hold</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReco("reject")}>Not a fit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div>
              <Button onClick={handleAnalyze} disabled={analyzing} className="gap-1.5">
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {analyzing ? "Analyzing..." : showAnalysis ? "Re-analyze" : "Analyze Response"}
              </Button>
            </div>
          </div>
        </section>

        {/* Analysis */}
        <AnimatePresence>{showAnalysis && analysis && <AnalysisPanel result={analysis} />}</AnimatePresence>

        {/* Responses */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold px-1">Screening Responses</h2>
          {submission.answers.map((a, i) => {
            const q = screening?.questions.find((qq) => qq.id === a.questionId);
            return (
              <article key={a.questionId} className="rounded-xl border border-border bg-card shadow-card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-7 px-2 shrink-0 items-center justify-center rounded-md bg-brand-sky text-brand-deep text-xs font-semibold font-mono">
                    Q{i + 1}
                  </div>
                  <p className="text-sm font-medium text-text-secondary leading-relaxed">
                    {q?.text ?? "Question no longer available"}
                  </p>
                </div>
                {a.responseType === "audio" ? (
                  <AudioPlayerPlaceholder fallbackText={a.value} />
                ) : (
                  <div className="rounded-lg bg-surface-2/50 border border-border p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {a.value}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </motion.div>
    </AppShell>
  );
}
