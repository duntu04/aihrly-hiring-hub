import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

const recoLabels = {
  advance: "Advance to Interview",
  hold: "Put on Hold",
  reject: "Not a Fit",
} as const;

export function AnalysisPanel({ result }: { result: AnalysisResult }) {
  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="rounded-xl border border-border bg-card shadow-card border-l-4 border-l-primary p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-display text-lg font-semibold">AI Analysis</h3>
          <StatusBadge variant={result.recommendation}>{recoLabels[result.recommendation]}</StatusBadge>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">Summary</h4>
          <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <h4 className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">Strengths</h4>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[color:var(--success)]" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">Concerns</h4>
            <ul className="space-y-2">
              {result.concerns.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[color:var(--warning)]" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
