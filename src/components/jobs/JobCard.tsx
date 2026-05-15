import Link from "next/link";
import { motion } from "motion/react";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, MapPin, Users } from "lucide-react";
import type { Job } from "@/types";
import { EmploymentTypeBadge } from "./EmploymentTypeBadge";

export function JobCard({
  job,
  applicantCount,
  hasScreening,
}: {
  job: Job;
  applicantCount: number;
  hasScreening: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/jobs/${job.id}`}
        className="group relative block rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30 overflow-hidden"
      >
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[1.05rem] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
          </div>
          <EmploymentTypeBadge type={job.employmentType} />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-3">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </div>

        <div className="flex items-start gap-1.5 text-sm text-text-secondary mb-4">
          <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <p className="line-clamp-2 leading-relaxed">{job.description}</p>
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Users className="h-3.5 w-3.5" />
            {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"} screened
          </div>

          <div className="flex items-center gap-2">
            {hasScreening ? (
              <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-[color:var(--success)]">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-[color:var(--warning)]">
                <AlertCircle className="h-3 w-3" />
                No screening
              </span>
            )}
            <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
