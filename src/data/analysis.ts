import type { AnalysisResult } from "@/types";

const MOCK: AnalysisResult[] = [
  {
    summary:
      "Strong candidate with clear, structured communication. Demonstrates real production experience and shows thoughtful trade-off thinking. Several answers reference specific projects with measurable outcomes.",
    strengths: [
      "Concrete examples backed by metrics rather than generalities",
      "Comfortable explaining trade-offs in technical decisions",
      "Strong cultural fit signals — collaborative tone, ownership mindset",
      "Clear written communication with appropriate depth",
    ],
    concerns: [
      "Limited exposure to one of our core stack components",
      "Some answers stayed slightly surface-level around stakeholder management",
    ],
    recommendation: "advance",
  },
  {
    summary:
      "Candidate has solid foundational knowledge but several answers lack the specificity we typically see from senior contributors. Worth a follow-up conversation to probe deeper before committing to a full loop.",
    strengths: [
      "Good attitude and willingness to learn — shows up clearly in tone",
      "Has shipped real features end-to-end on at least one team",
      "Asks clarifying questions naturally",
    ],
    concerns: [
      "Several answers leaned on generic best-practice language without specifics",
      "Unclear depth around production debugging and incident response",
      "No evidence yet of leading a non-trivial technical decision",
    ],
    recommendation: "hold",
  },
  {
    summary:
      "Candidate background does not align well with the role's day-to-day expectations. Communication is fine but the technical responses suggest a meaningful gap relative to where this role needs someone to start.",
    strengths: [
      "Polite, professional, and easy to read",
      "Eager to learn — willing to ramp up on unfamiliar areas",
    ],
    concerns: [
      "Core technical questions answered at a tutorial level rather than from real experience",
      "Limited evidence of independent ownership in past roles",
      "Mismatched expectations around scope and responsibility for this seniority",
    ],
    recommendation: "reject",
  },
];

export function getMockAnalysis(seed: string): AnalysisResult {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return MOCK[Math.abs(hash) % MOCK.length];
}
