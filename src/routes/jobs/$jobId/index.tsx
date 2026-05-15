import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Inbox,
  Mail,
  MapPin,
  PlusCircle,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { EmploymentTypeBadge } from "@/components/jobs/EmploymentTypeBadge";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getJobById } from "@/data/jobs";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useStatuses } from "@/hooks/useStatuses";
import { colorFromString, formatRelativeTime, getInitials } from "@/lib/utils";

export const Route = createFileRoute("/jobs/$jobId/")({
  loader: ({ params }) => {
    const job = getJobById(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.job.title ?? "Job"} — Aihrly` },
      { name: "description", content: loaderData?.job.description ?? "Job detail" },
    ],
  }),
  component: JobDetailPage,
  notFoundComponent: () => (
    <AppShell crumbs={[{ label: "Jobs", to: "/jobs" }, { label: "Not found" }]}>
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <h2 className="font-display text-xl font-semibold">Job not found</h2>
        <p className="mt-2 text-sm text-text-secondary">This position no longer exists.</p>
        <Link to="/jobs" className="inline-block mt-4">
          <Button variant="outline" className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to Jobs</Button>
        </Link>
      </div>
    </AppShell>
  ),
});

function JobDetailPage() {
  const { job } = Route.useLoaderData();
  const { getScreeningForJob } = useScreenings();
  const { getForJob } = useSubmissions();
  const { getStatus } = useStatuses();

  const screening = getScreeningForJob(job.id);
  const submissions = getForJob(job.id).slice().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const screeningUrl = `${origin}/screening/${job.id}`;

  return (
    <AppShell crumbs={[{ label: "Jobs", to: "/jobs" }, { label: job.title }]}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
        </Link>

        {/* Job header card */}
        <section className="rounded-xl border border-border bg-card shadow-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
            <h1 className="font-display text-[1.75rem] font-bold leading-tight">{job.title}</h1>
            <EmploymentTypeBadge type={job.employmentType} />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-4">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          <p className="text-[0.9375rem] leading-relaxed text-foreground">{job.description}</p>

          <div className="mt-5 pt-5 border-t border-border flex items-center gap-3 flex-wrap">
            {screening ? (
              <>
                <StatusBadge variant="success">
                  <CheckCircle2 className="h-3 w-3" /> Screening Active
                </StatusBadge>
                <span className="text-xs text-text-muted">
                  Created {formatRelativeTime(screening.createdAt)} · {screening.questions.length} questions
                </span>
              </>
            ) : (
              <>
                <StatusBadge variant="warning">
                  <AlertCircle className="h-3 w-3" /> No screening created
                </StatusBadge>
                <Link to="/jobs/new">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <PlusCircle className="h-3.5 w-3.5" /> Create Screening
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Shareable link */}
        {screening && (
          <section className="rounded-xl border border-border bg-card shadow-card p-6">
            <h2 className="font-display text-base font-semibold mb-1">Candidate Screening Link</h2>
            <p className="text-sm text-text-secondary mb-4">
              Share this link with candidates to begin their phone screening.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <code className="flex-1 rounded-md border border-border bg-surface-2/50 px-3 py-2 text-sm font-mono text-foreground truncate">
                {screeningUrl}
              </code>
              <CopyLinkButton value={screeningUrl} />
            </div>
          </section>
        )}

        {/* Applicants */}
        <section className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold">Applicants</h2>
              <span className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 h-5 rounded-full bg-brand-sky text-brand-deep text-xs font-semibold">
                {submissions.length}
              </span>
            </div>
          </div>

          {submissions.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-9 w-9" />}
              title="No applications yet"
              description={
                screening
                  ? "Once candidates complete the screening, they'll appear here."
                  : "Create a screening first, then share the link with candidates."
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium hidden sm:table-cell">Email</th>
                    <th className="px-6 py-3 font-medium hidden md:table-cell">Submitted</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => {
                    const status = getStatus(s.id);
                    return (
                      <tr key={s.id} className="border-t border-border hover:bg-brand-sky/40 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold shrink-0"
                              style={{ background: colorFromString(s.candidateName) }}
                            >
                              {getInitials(s.candidateName)}
                            </div>
                            <span className="font-medium text-foreground">{s.candidateName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1.5 text-text-secondary">
                            <Mail className="h-3.5 w-3.5" />
                            {s.candidateEmail}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-text-secondary hidden md:table-cell">
                          {formatRelativeTime(s.submittedAt)}
                        </td>
                        <td className="px-6 py-3.5">
                          <StatusBadge variant={status === "submitted" ? "submitted" : status} />
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link
                            to="/jobs/$jobId/applicants/$applicantId"
                            params={{ jobId: job.id, applicantId: s.id }}
                          >
                            <Button variant="ghost" size="sm" className="text-primary">
                              View Responses
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-dashed border-border bg-transparent p-5 flex items-center gap-3">
          <Users className="h-4 w-4 text-text-muted" />
          <p className="text-sm text-text-secondary">
            Recruiters can change a candidate's status from the response detail page.
          </p>
        </section>
      </motion.div>
    </AppShell>
  );
}
