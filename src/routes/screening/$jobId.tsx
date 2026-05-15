import { useMemo, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, MapPin, Mic, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/brand/Logo";
import { getJobById } from "@/data/jobs";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";
import { generateId, isValidEmail } from "@/lib/utils";
import type { Answer, Submission } from "@/types";

export const Route = createFileRoute("/screening/$jobId")({
  loader: ({ params }) => {
    const job = getJobById(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Phone Screening — ${loaderData?.job.title ?? ""} — Aihrly` },
      { name: "description", content: "Complete your phone screening with Remotown GmbH." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ScreeningPage,
});

type Step = "welcome" | "questions" | "complete";

function ScreeningPage() {
  const { job } = Route.useLoaderData();
  const { jobId } = Route.useParams();
  const { getScreeningForJob } = useScreenings();
  const { addSubmission } = useSubmissions();

  const screening = getScreeningForJob(jobId);

  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false });
  const [qIndex, setQIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const nameError = touched.name && name.trim().length < 2 ? "Please enter your full name" : "";
  const emailError = touched.email && !isValidEmail(email.trim()) ? "Please enter a valid email" : "";
  const canBegin = name.trim().length >= 2 && isValidEmail(email.trim());

  const total = screening?.questions.length ?? 0;
  const currentQ = screening?.questions[qIndex];
  const currentAnswer = currentQ ? answers[currentQ.id] ?? "" : "";
  const canSubmitAnswer = currentAnswer.trim().length >= 10;

  const submission: Submission | null = useMemo(() => {
    if (!screening) return null;
    const ans: Answer[] = screening.questions.map((q) => ({
      questionId: q.id,
      responseType: q.responseType,
      value: answers[q.id] ?? "",
    }));
    return {
      id: generateId("sub"),
      jobId,
      candidateName: name.trim(),
      candidateEmail: email.trim(),
      answers: ans,
      submittedAt: new Date().toISOString(),
    };
  }, [screening, jobId, name, email, answers]);

  const handleAnswer = (val: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const handleNext = () => {
    if (!canSubmitAnswer) return;
    if (qIndex === total - 1) {
      // submit
      if (submission) addSubmission(submission);
      setStep("complete");
    } else {
      setDirection(1);
      setQIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (qIndex === 0) return;
    setDirection(-1);
    setQIndex((i) => i - 1);
  };

  // ---------- No active screening ----------
  if (!screening) {
    return (
      <CandidateShell>
        <div className="flex flex-col items-center text-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--danger)]/10 text-[color:var(--danger)] mb-5">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">This screening is no longer active</h1>
          <p className="mt-2 text-text-secondary max-w-md">
            The link you used isn't accepting responses right now. Please reach out to your recruiter for an updated link.
          </p>
        </div>
      </CandidateShell>
    );
  }

  // ---------- Welcome ----------
  if (step === "welcome") {
    return (
      <CandidateShell>
        <div className="max-w-xl mx-auto py-10">
          <p className="text-sm font-medium text-text-secondary">You've been invited to screen for:</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-tight">{job.title}</h1>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-text-secondary">
            <MapPin className="h-4 w-4" />
            <span>Remotown GmbH · {job.location}</span>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface-2/40 p-5 text-sm leading-relaxed text-foreground">
            This quick phone screening helps us learn more about you. Answer each question at your own pace —
            there's no time limit. Your responses go directly to the Remotown hiring team.
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setTouched({ name: true, email: true });
              if (canBegin) setStep("questions");
            }}
          >
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1.5">Your full name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Ada Lovelace"
                aria-invalid={!!nameError}
              />
              {nameError && (
                <p className="mt-1.5 text-xs text-[color:var(--danger)] inline-flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {nameError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1.5">Your email address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="ada@example.com"
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-[color:var(--danger)] inline-flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {emailError}
                </p>
              )}
            </div>
            <Button type="submit" disabled={!canBegin} className="w-full h-12 text-base gap-1.5">
              Begin Screening <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-text-muted text-center">{total} questions · approx. {Math.max(5, total * 2)} minutes</p>
          </form>
        </div>
      </CandidateShell>
    );
  }

  // ---------- Complete ----------
  if (step === "complete") {
    const firstName = name.trim().split(/\s+/)[0];
    return (
      <CandidateShell>
        <div className="max-w-xl mx-auto py-12 text-center relative">
          <Confetti />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--success)]/12 text-[color:var(--success)]"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>
          <h1 className="mt-6 font-display text-3xl font-bold">You're all done!</h1>
          <p className="mt-3 text-text-secondary">
            Thank you, {firstName}. Your responses have been submitted to the Remotown team.
          </p>
          <div className="mt-6 inline-block rounded-lg border border-border bg-surface-2/40 px-4 py-3 text-left">
            <div className="text-xs uppercase tracking-wide text-text-muted">Role</div>
            <div className="text-sm font-medium">{job.title}</div>
            <div className="mt-2 text-xs uppercase tracking-wide text-text-muted">Submitted</div>
            <div className="text-sm">{new Date().toLocaleString()}</div>
          </div>
          <p className="mt-6 text-sm text-text-muted">You may now close this tab.</p>
        </div>
      </CandidateShell>
    );
  }

  // ---------- Questions ----------
  if (!currentQ) return null;
  const progress = ((qIndex + (canSubmitAnswer ? 0.5 : 0)) / total) * 100;

  return (
    <CandidateShell>
      <div className="max-w-2xl mx-auto py-6">
        {/* progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span>Question {qIndex + 1} of {total}</span>
            <span>{Math.round(((qIndex + 1) / total) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
            <motion.div
              className="h-full gradient-blue"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-xl border border-border bg-card shadow-card p-6 sm:p-8"
          >
            <h2 className="font-display text-xl sm:text-[1.4rem] font-semibold leading-snug">{currentQ.text}</h2>

            {currentQ.responseType === "audio" && (
              <div className="mt-5 rounded-lg border border-dashed border-border bg-surface-2/40 p-4 flex items-start gap-3">
                <button
                  type="button"
                  disabled
                  aria-label="Record audio (disabled)"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-text-muted cursor-not-allowed"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Audio recording is not available in this demo. Please type your response below.
                </p>
              </div>
            )}

            <div className="mt-5">
              <label htmlFor="answer" className="text-sm font-medium block mb-1.5">
                Your answer
              </label>
              <Textarea
                id="answer"
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value.slice(0, 500))}
                placeholder="Take your time — there's no time limit."
                className="min-h-[140px] resize-y"
                maxLength={500}
              />
              <div className="mt-1.5 flex items-center justify-between text-xs text-text-muted">
                <span>{currentAnswer.length < 10 ? `${10 - currentAnswer.length} more characters needed` : "Looks good"}</span>
                <span className="font-mono">{currentAnswer.length} / 500</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrev}
                disabled={qIndex === 0}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
              <Button type="button" disabled={!canSubmitAnswer} onClick={handleNext} className="gap-1.5">
                {qIndex === total - 1 ? "Submit Screening" : "Next Question"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </CandidateShell>
  );
}

function CandidateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 gradient-blue w-full" />
      <header className="px-5 sm:px-8 py-4 flex items-center justify-between">
        <Logo color="var(--brand-navy)" />
        <span className="text-xs text-text-muted">Powered by Aihrly</span>
      </header>
      <div className="flex-1 px-5 sm:px-8">{children}</div>
      <footer className="px-5 sm:px-8 py-6 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Remotown GmbH
      </footer>
    </div>
  );
}

function Confetti() {
  const colors = ["#1B6EF3", "#0D47C5", "#12B76A", "#F59E0B", "#EC4899", "#8B5CF6"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-0 z-0">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute block h-2 w-2 rounded-sm"
          style={{
            left: `${(i / 18) * 100}%`,
            top: 80,
            background: colors[i % colors.length],
            animation: `float-up ${1.6 + (i % 5) * 0.2}s ease-out ${i * 0.04}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
