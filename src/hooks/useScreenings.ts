import { useLocalStorage } from "./useLocalStorage";
import type { Screening } from "@/types";

const KEY = "aihrly_screenings";

export function useScreenings() {
  const [screenings, setScreenings] = useLocalStorage<Screening[]>(KEY, []);

  const addScreening = (s: Screening) => setScreenings((prev) => [...prev.filter((p) => p.jobId !== s.jobId), s]);
  const getScreeningForJob = (jobId: string) => screenings.find((s) => s.jobId === jobId);
  const removeScreening = (jobId: string) => setScreenings((prev) => prev.filter((s) => s.jobId !== jobId));

  return { screenings, addScreening, getScreeningForJob, removeScreening };
}
