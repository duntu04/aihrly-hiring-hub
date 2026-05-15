import type { Question } from "@/types";

const mk = (text: string, responseType: Question["responseType"] = "text"): Omit<Question, "id"> => ({
  text,
  responseType,
  isCustom: false,
});

const templates: Record<string, Omit<Question, "id">[]> = {
  "job-001": [
    mk("Walk us through a recent Next.js project you shipped — what role did you play and what trade-offs did you make?"),
    mk("How do you approach component decomposition when a UI grows past a few hundred lines?"),
    mk("Describe a time you had to debate a design or product decision with a stakeholder. How did it land?", "audio"),
    mk("What's your strategy for keeping a TypeScript codebase strict without slowing the team down?"),
    mk("How would you architect state for a multi-step form with cross-step validation?"),
    mk("Why are you interested in working with Remotown specifically, and what do you hope to learn during the NSS year?", "audio"),
  ],
  "job-002": [
    mk("Describe a Node.js service you built end-to-end — what was the scale and what would you change today?"),
    mk("Walk us through how you'd design a queue-based job processing system for 100k events per hour.", "audio"),
    mk("How do you decide between PostgreSQL and Redis for a given piece of data?"),
    mk("Tell us about a production incident you owned — root cause, mitigation, and what changed afterwards."),
    mk("How do you approach API versioning when you have mobile clients you can't force-update?"),
    mk("What's your testing philosophy for backend services — unit, integration, contract, end-to-end?", "audio"),
  ],
  "job-003": [
    mk("Walk us through your design process from a vague problem statement to a shipped feature.", "audio"),
    mk("Show or describe a recent project where research meaningfully changed the design direction."),
    mk("How do you approach creating or evolving a design system inside a small product team?"),
    mk("Tell us about a time you had to push back on engineering or product. How did you make your case?"),
    mk("What's your relationship with motion and micro-interactions — when do they help, when do they hurt?"),
    mk("Why design for an outstaffing company specifically? What about Remotown's mission resonates with you?", "audio"),
  ],
  "job-004": [
    mk("What's your current familiarity with Docker and Kubernetes — be honest about what you've actually built vs. read about."),
    mk("Walk us through what happens when you push to main on a project with a CI/CD pipeline you set up."),
    mk("Tell us about a time you broke something in a shared environment. What did you learn?", "audio"),
    mk("Why DevOps and not, say, backend or platform engineering? What draws you to the role?"),
    mk("How do you currently keep up with infrastructure tooling — blogs, courses, side projects?"),
    mk("Where do you want to be skill-wise at the end of a 6-month internship with us?", "audio"),
  ],
};

const defaultQuestions: Omit<Question, "id">[] = [
  mk("Tell us a bit about yourself and what you're looking for in your next role.", "audio"),
  mk("What recent project are you most proud of, and why?"),
  mk("Describe a challenging situation at work and how you handled it."),
  mk("Where do you see your career heading over the next two to three years?"),
  mk("Why are you interested in joining Remotown specifically?", "audio"),
];

let counter = 0;
const idFor = (jobId: string, i: number) => `q-${jobId}-${i}-${++counter}`;

export function getQuestionsForJob(jobId: string): Question[] {
  const tpl = templates[jobId] ?? defaultQuestions;
  return tpl.map((q, i) => ({ ...q, id: idFor(jobId, i) }));
}
