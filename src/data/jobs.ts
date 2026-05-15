import type { Job } from "@/types";

export const jobs: Job[] = [
  {
    id: "job-001",
    title: "Frontend-Focused Full Stack Developer (NSS)",
    location: "Remote, Ghana",
    employmentType: "NSS",
    description:
      "Build delightful interfaces in Next.js for Remotown's internal tooling. You will work closely with the product team to design and implement recruiter-facing and candidate-facing screens, ensuring a seamless hiring experience.",
  },
  {
    id: "job-002",
    title: "Backend Engineer — Node.js",
    location: "Remote, Africa",
    employmentType: "Full-time",
    description:
      "Design and maintain RESTful APIs, microservices, and data pipelines for Remotown's platform. Experience with PostgreSQL, Redis, and cloud deployments on AWS or GCP is required.",
  },
  {
    id: "job-003",
    title: "Product Designer (UI/UX)",
    location: "Remote, Europe or Africa",
    employmentType: "Full-time",
    description:
      "Own the end-to-end product design process — from user research to high-fidelity Figma prototypes. You will define the visual language and interaction patterns for all Remotown products.",
  },
  {
    id: "job-004",
    title: "DevOps Engineer (Internship)",
    location: "Remote, Germany",
    employmentType: "Internship",
    description:
      "Support our infrastructure team with CI/CD pipelines, container orchestration via Kubernetes, and cloud resource management. Ideal for candidates pursuing a degree in Computer Science or related fields.",
  },
];

export function getJobById(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}
