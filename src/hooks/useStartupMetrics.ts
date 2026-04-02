import { useMemo } from "react";
import { Startup } from "@/data/types";

export function useStartupMetrics(startup: Startup | undefined) {
  return useMemo(() => {
    if (!startup) return { allocationPercent: 0, remaining: 0, totalOpportunities: 0 };
    const allocationPercent = Math.round((startup.totalCommitted / startup.askAmount) * 100);
    const remaining = startup.askAmount - startup.totalCommitted;
    return { allocationPercent, remaining };
  }, [startup]);
}

export function useTotalOpportunities(startups: Startup[]) {
  return useMemo(() => {
    return startups.reduce((sum, s) => sum + (s.askAmount - s.totalCommitted), 0);
  }, [startups]);
}
