import { useLocalStorage } from "./useLocalStorage";
import type { Recommendation } from "@/types";

const KEY = "aihrly_statuses";
type Map = Record<string, Recommendation | "submitted">;

export function useStatuses() {
  const [map, setMap] = useLocalStorage<Map>(KEY, {});
  const setStatus = (id: string, status: Recommendation | "submitted") =>
    setMap((prev) => ({ ...prev, [id]: status }));
  const getStatus = (id: string) => map[id] ?? "submitted";
  return { setStatus, getStatus };
}
