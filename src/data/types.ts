export type Stage = "Pre-Seed" | "Seed" | "Series A" | "Series B";
export type Sector = "AI" | "SaaS" | "Fintech" | "Climate Tech" | "Healthcare" | "E-commerce";
export type RiskLevel = "Low" | "Medium" | "High";
export type InvestmentStatus = "Active" | "Committed" | "Exited";

export interface Startup {
  id: string;
  name: string;
  sector: Sector;
  stage: Stage;
  thesis: string;
  askAmount: number;
  equityOffered: number;
  minimumInvestment: number;
  totalCommitted: number;
  investorCount: number;
  riskLevel: RiskLevel;
  recentActivity: string;
  metrics: {
    revenue: number;
    revenueGrowth: number;
    users: number;
    runway: number;
  };
  founder: {
    name: string;
    experience: string;
    pastVentures: string;
  };
  risks: {
    market: string;
    execution: string;
  };
  tractionHistory: { month: string; revenue: number }[];
  endorsements: string[];
  guideRequests: { userId: string; userName: string; message: string; createdAt: string }[];
}

export interface Investment {
  id: string;
  startupId: string;
  startupName: string;
  sector: Sector;
  amountInvested: number;
  ownershipPercent: number;
  status: InvestmentStatus;
  updates: string[];
  investedAt: string;
}

export interface UserProfile {
  role: "investor" | "founder";
  name: string;
  // Investor fields
  accreditationStatus?: string;
  investmentRangeMin?: number;
  investmentRangeMax?: number;
  availableCapital?: number;
  // Founder fields
  startupName?: string;
  sector?: Sector;
  stage?: Stage;
  fundingAsk?: number;
  equityOffered?: number;
}
