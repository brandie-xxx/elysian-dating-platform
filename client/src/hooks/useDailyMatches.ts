import { useQuery } from "@tanstack/react-query";

export type Match = {
  id: string;
  name: string;
  age?: number;
  bio?: string;
  avatarUrl?: string;
};

export type DailyMatchesResponse = {
  matchesShown: number;
  maxMatches: number;
  matches: Match[];
  message?: string;
};

export function useDailyMatches() {
  return useQuery<DailyMatchesResponse, Error>({
    queryKey: ["dailyMatches"],
    queryFn: async () => {
      const res = await fetch("/api/daily-matches");
      if (!res.ok) throw new Error("Failed to fetch daily matches");
      return res.json();
    },
  });
}

export default useDailyMatches;
