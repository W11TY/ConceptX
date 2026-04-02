import React from "react";
import { useNavigate } from "react-router-dom";
import { Investment } from "@/data/types";
import { formatCurrency } from "@/lib/format";
import MetricCard from "./MetricCard";

interface InvestmentCardProps {
  inv: Investment;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ inv }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card-surface-hover cursor-pointer animate-fade-in group"
      onClick={() => navigate(`/startup/${inv.startupId}`)}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-accent">{inv.startupName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">{inv.startupName}</h3>
            <p className="text-xs text-muted-foreground">{inv.sector} · {inv.investedAt}</p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 bg-success/10 text-success rounded">
          {inv.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <MetricCard label="Invested" value={formatCurrency(inv.amountInvested)} className="!p-3 border-none bg-secondary/30" />
        <MetricCard label="Ownership" value={`${inv.ownershipPercent}%`} valueColor="text-accent" className="!p-3 border-none bg-secondary/30" />
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        {inv.updates.map((update, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-1.5 shrink-0" />
            <span className="text-xs text-muted-foreground leading-relaxed">{update}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentCard;
