import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/format";
import { Sector, Stage, RiskLevel } from "@/data/types";
import AppHeader from "@/components/AppHeader";
import StartupCard from "@/components/StartupCard";
import { useTotalOpportunities } from "@/hooks/useStartupMetrics";

const DiscoverPage = () => {
  const { startups, user } = useApp();
  const navigate = useNavigate();
  const [sectorFilter, setSectorFilter] = useState<Sector | "All">("All");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const totalOpportunities = useTotalOpportunities(startups);

  if (!user || user.role !== "investor") {
    navigate("/");
    return null;
  }

  const filtered = startups.filter((s) => {
    if (sectorFilter !== "All" && s.sector !== sectorFilter) return false;
    if (stageFilter !== "All" && s.stage !== stageFilter) return false;
    if (riskFilter !== "All" && s.riskLevel !== riskFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="screen-container">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6 pt-4 animate-fade-in border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Discover</h1>
            <p className="text-muted-foreground">{formatCurrency(totalOpportunities)} in open opportunities</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { value: sectorFilter, setter: setSectorFilter, options: ["All", "AI", "SaaS", "Fintech", "Climate Tech", "Healthcare", "E-commerce"], label: "Sector" },
              { value: stageFilter, setter: setStageFilter, options: ["All", "Pre-Seed", "Seed", "Series A", "Series B"], label: "Stage" },
              { value: riskFilter, setter: setRiskFilter, options: ["All", "Low", "Medium", "High"], label: "Risk" },
            ].map(({ value, setter, options, label }) => (
              <select key={label} value={value} onChange={(e) => setter(e.target.value as any)} className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent">
                {options.map((o) => <option key={o} value={o}>{o === "All" ? `All ${label}s` : o}</option>)}
              </select>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No startups match your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
