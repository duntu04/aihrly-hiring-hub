import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Briefcase, PlusCircle, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { jobs } from "@/data/jobs";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Open Positions — Aihrly" },
      { name: "description", content: "Browse all open positions at Remotown GmbH and manage candidate screenings." },
    ],
  }),
  component: JobsIndex,
});

function JobsIndex() {
  const [query, setQuery] = useState("");
  const { screenings } = useScreenings();
  const { submissions } = useSubmissions();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q));
  }, [query]);

  return (
    <AppShell
      crumbs={[{ label: "Jobs" }]}
      action={
        <Link to="/jobs/new">
          <Button className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Create Screening</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </Link>
      }
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="font-display text-[2rem] font-bold leading-tight">Open Positions</h1>
            <p className="text-text-secondary text-sm mt-1">
              {jobs.length} active {jobs.length === 1 ? "role" : "roles"} at Remotown GmbH
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or location..."
              className="pl-9"
              aria-label="Search jobs"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-card">
            <EmptyState
              icon={<Briefcase className="h-9 w-9" />}
              title={query ? "No matching positions" : "No open positions"}
              description={
                query
                  ? "Try a different search term or clear the filter."
                  : "Add your first job to start screening candidates."
              }
              action={
                query
                  ? { label: "Clear search", onClick: () => setQuery("") }
                  : { label: "Create Screening", onClick: () => navigate({ to: "/jobs/new" }), icon: <PlusCircle className="h-4 w-4" /> }
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applicantCount={submissions.filter((s) => s.jobId === job.id).length}
                hasScreening={!!screenings.find((s) => s.jobId === job.id)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}
