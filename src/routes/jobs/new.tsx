import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, PlusCircle, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { EmploymentTypeBadge } from "@/components/jobs/EmploymentTypeBadge";
import { QuestionList } from "@/components/screening/QuestionList";
import { jobs, getJobById } from "@/data/jobs";
import { getQuestionsForJob } from "@/data/questions";
import { useScreenings } from "@/hooks/useScreenings";
import { generateId } from "@/lib/utils";
import type { Question, Screening } from "@/types";

export const Route = createFileRoute("/jobs/new")({
  head: () => ({
    meta: [
      { title: "Create Screening — Aihrly" },
      { name: "description", content: "Generate tailored screening questions for an open role." },
    ],
  }),
  component: NewScreeningPage,
});

const STEPS = [{ label: "Select role" }, { label: "Generate questions" }, { label: "Review & save" }];

function NewScreeningPage() {
  const navigate = useNavigate();
  const { addScreening } = useScreenings();

  const [step, setStep] = useState(0);
  const [jobId, setJobId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [generating, setGenerating] = useState(false);

  const job = jobId ? getJobById(jobId) : undefined;

  const handleGenerate = () => {
    if (!jobId) return;
    setGenerating(true);
    setQuestions([]);
    setTimeout(() => {
      setQuestions(getQuestionsForJob(jobId));
      setGenerating(false);
    }, 600);
  };

  const handleAddCustom = () => {
    setQuestions((prev) => [
      ...prev,
      { id: generateId("q"), text: "", responseType: "text", isCustom: true },
    ]);
  };

  const handleSave = () => {
    if (!jobId) return;
    if (questions.length === 0) {
      toast.error("Add at least one question before saving");
      return;
    }
    if (questions.some((q) => !q.text.trim())) {
      toast.error("Some questions are empty — fill them in or remove them");
      return;
    }
    const screening: Screening = {
      id: generateId("scr"),
      jobId,
      createdAt: new Date().toISOString(),
      questions: questions.map((q) => ({ ...q, text: q.text.trim() })),
    };
    addScreening(screening);
    toast.success("Screening created!");
    navigate({ to: "/jobs/$jobId", params: { jobId } });
  };

  return (
    <AppShell crumbs={[{ label: "Jobs", to: "/jobs" }, { label: "Create Screening" }]}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-[1.75rem] font-bold leading-tight">Create Screening</h1>
          <p className="text-text-secondary text-sm mt-1">
            Set up a phone screening flow that candidates can complete on their own time.
          </p>
        </div>

        <div className="mb-8">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Which role are you screening for?</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Pick one of the open positions below to tailor the screening.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Open role</label>
                <Select value={jobId} onValueChange={setJobId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a position..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {job && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-border bg-surface-2/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-foreground">{job.title}</div>
                      <div className="text-xs text-text-secondary mt-0.5">{job.location}</div>
                    </div>
                    <EmploymentTypeBadge type={job.employmentType} />
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end pt-2">
                <Button disabled={!jobId} onClick={() => setStep(1)} className="gap-1.5">
                  Next: Generate Questions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && job && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Generate screening questions</h2>
                <p className="text-sm text-text-secondary mt-1">
                  We'll create questions tailored to <span className="font-medium">{job.title}</span>. You can edit, remove, or add your own.
                </p>
              </div>

              {questions.length === 0 && !generating && (
                <Button onClick={handleGenerate} className="w-full gap-2 h-12 text-base">
                  <Sparkles className="h-4 w-4" />
                  Generate Questions
                </Button>
              )}

              {generating && (
                <Button disabled className="w-full gap-2 h-12 text-base">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </Button>
              )}

              {questions.length > 0 && !generating && (
                <>
                  <QuestionList questions={questions} onChange={setQuestions} />

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" onClick={handleGenerate} className="gap-1.5">
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" onClick={handleAddCustom} className="gap-1.5">
                      <PlusCircle className="h-4 w-4" />
                      Add Custom Question
                    </Button>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-4 border-t border-border">
                <Button variant="ghost" onClick={() => setStep(0)} className="gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button disabled={questions.length === 0} onClick={() => setStep(2)} className="gap-1.5">
                  Next: Review & Save
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && job && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Review & save</h2>
                <p className="text-sm text-text-secondary mt-1">
                  {questions.length} {questions.length === 1 ? "question" : "questions"} for{" "}
                  <span className="font-medium">{job.title}</span>
                </p>
              </div>

              <ol className="space-y-2.5 list-none">
                {questions.map((q, i) => (
                  <li key={q.id} className="flex gap-3 rounded-lg border border-border bg-surface-2/30 p-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-sky text-brand-deep text-xs font-semibold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{q.text}</p>
                      <span className="inline-block mt-1 text-[0.7rem] text-text-muted uppercase tracking-wide">
                        {q.responseType} response
                      </span>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex justify-between pt-4 border-t border-border">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSave} className="gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Save Screening
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/jobs" className="text-sm text-text-secondary hover:text-foreground">
            ← Cancel and return to Jobs
          </Link>
        </div>
      </motion.div>
    </AppShell>
  );
}
