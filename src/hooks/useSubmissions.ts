import { useLocalStorage } from "./useLocalStorage";
import type { Submission } from "@/types";

const KEY = "aihrly_submissions";

export function useSubmissions() {
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>(KEY, []);

  const addSubmission = (s: Submission) => setSubmissions((prev) => [...prev, s]);
  const getForJob = (jobId: string) => submissions.filter((s) => s.jobId === jobId);
  const getById = (id: string) => submissions.find((s) => s.id === id);

  return { submissions, addSubmission, getForJob, getById };
}
