import React, { createContext, useContext, useState, useCallback } from "react";
import { Startup, Investment, UserProfile } from "@/data/types";
import { mockStartups } from "@/data/mockData";

interface AppState {
  user: UserProfile | null;
  startups: Startup[];
  investments: Investment[];
  setUser: (user: UserProfile) => void;
  logout: () => void;
  commitInvestment: (startupId: string, amount: number) => boolean;
  toggleEndorsement: (startupId: string) => void;
  submitGuideRequest: (startupId: string, message: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const setUser = useCallback((u: UserProfile) => setUserState(u), []);
  const logout = useCallback(() => {
    setUserState(null);
    setInvestments([]);
  }, []);

  const commitInvestment = useCallback((startupId: string, amount: number): boolean => {
    const startup = startups.find((s) => s.id === startupId);
    if (!startup || !user) return false;

    const remaining = startup.askAmount - startup.totalCommitted;
    if (amount > remaining) return false;
    if (amount < startup.minimumInvestment) return false;
    if (user.availableCapital && amount > user.availableCapital) return false;

    const ownershipPercent = (amount / startup.askAmount) * startup.equityOffered;

    setStartups((prev) =>
      prev.map((s) =>
        s.id === startupId
          ? { ...s, totalCommitted: s.totalCommitted + amount, investorCount: s.investorCount + 1 }
          : s
      )
    );

    const newInvestment: Investment = {
      id: `inv-${Date.now()}`,
      startupId,
      startupName: startup.name,
      sector: startup.sector,
      amountInvested: amount,
      ownershipPercent: Math.round(ownershipPercent * 100) / 100,
      status: "Active",
      updates: [
        `Revenue +${startup.metrics.revenueGrowth}% this quarter`,
        `Runway at ${startup.metrics.runway} months`,
        "New strategic hire onboarded",
      ],
      investedAt: new Date().toISOString().split("T")[0],
    };

    setInvestments((prev) => [...prev, newInvestment]);

    if (user.availableCapital) {
      setUserState((prev) => prev ? { ...prev, availableCapital: (prev.availableCapital || 0) - amount } : null);
    }

    return true;
  }, [startups, user]);

  const toggleEndorsement = useCallback((startupId: string) => {
    if (!user) return;
    setStartups((prev) => prev.map((s) => {
      if (s.id !== startupId) return s;
      const hasEndorsed = s.endorsements.includes(user.name);
      return {
        ...s,
        endorsements: hasEndorsed 
          ? s.endorsements.filter(n => n !== user.name)
          : [...s.endorsements, user.name]
      };
    }));
  }, [user]);

  const submitGuideRequest = useCallback((startupId: string, message: string) => {
    if (!user) return;
    setStartups((prev) => prev.map((s) => {
      if (s.id !== startupId) return s;
      return {
        ...s,
        guideRequests: [...s.guideRequests, {
          userId: `u-${Date.now()}`,
          userName: user.name,
          message,
          createdAt: new Date().toISOString()
        }]
      };
    }));
  }, [user]);

  return (
    <AppContext.Provider value={{ user, startups, investments, setUser, logout, commitInvestment, toggleEndorsement, submitGuideRequest }}>
      {children}
    </AppContext.Provider>
  );
};
