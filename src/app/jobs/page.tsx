"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Briefcase, PlusCircle, Search, ArrowUpDown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { jobs } from "@/data/jobs";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobsIndex() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "az">("recent");
  const { screenings } = useScreenings();
  const { submissions } = useSubmissions();
  const router = useRouter();

  const filteredAndSorted = useMemo(() => {
    let q = query.trim().toLowerCase();
    let result = jobs;

    if (q) {
      result = jobs.filter((j) => j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q));
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      } else {
        // Sort by recent screening
        const screeningA = screenings.find((s) => s.jobId === a.id);
        const screeningB = screenings.find((s) => s.jobId === b.id);
        
        const dateA = screeningA ? new Date(screeningA.createdAt).getTime() : 0;
        const dateB = screeningB ? new Date(screeningB.createdAt).getTime() : 0;
        
        return dateB - dateA;
      }
    });

    return result;
  }, [query, sortBy, screenings]);

  return (
    <AppShell
      crumbs={[{ label: "Jobs" }]}
      action={
        <Link href="/jobs/new">
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
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                className="pl-9"
                aria-label="Search jobs"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-text-muted" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent Screening</SelectItem>
                  <SelectItem value="az">A-Z (Alphabetical)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredAndSorted.length === 0 ? (
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
                  : { label: "Create Screening", onClick: () => router.push("/jobs/new"), icon: <PlusCircle className="h-4 w-4" /> }
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSorted.map((job) => (
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
