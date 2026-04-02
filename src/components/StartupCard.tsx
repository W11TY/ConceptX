import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Startup } from "@/data/types";
import { formatCurrency } from "@/lib/format";
import RiskBadge from "./RiskBadge";
import { useStartupMetrics } from "@/hooks/useStartupMetrics";
import { useApp } from "@/context/AppContext";
import { Handshake, ThumbsUp } from "lucide-react";
import GuideModal from "./GuideModal";

interface StartupCardProps {
  startup: Startup;
}

const HIGH_VALUE_INVESTORS = ["Naval Ravikant", "Dr. Devi Shetty", "Balaji Srinivasan", "Sequoia Scout"];

const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  const navigate = useNavigate();
  const { allocationPercent } = useStartupMetrics(startup);
  const { toggleEndorsement, user } = useApp();
  const [showGuide, setShowGuide] = useState(false);

  const hasEndorsed = user ? startup.endorsements.includes(user.name) : false;
  const highValueName = startup.endorsements.find(e => HIGH_VALUE_INVESTORS.includes(e));

  return (
    <>
      <div
        className="card-surface-hover cursor-pointer animate-fade-in group flex flex-col h-full"
        onClick={() => navigate(`/startup/${startup.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-accent">{startup.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{startup.name}</h3>
              <p className="text-xs text-muted-foreground">{startup.sector} · {startup.stage}</p>
            </div>
          </div>
          <RiskBadge risk={startup.riskLevel} />
        </div>

        <div className="h-12 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={startup.tractionHistory}>
              <defs>
                <linearGradient id={`grad-${startup.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(270 70% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(270 70% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="revenue" stroke="hsl(270 70% 50%)" strokeWidth={1.5} fill={`url(#grad-${startup.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ask</div>
            <div className="text-sm font-medium text-foreground">{formatCurrency(startup.askAmount)}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Equity</div>
            <div className="text-sm font-medium text-foreground">{startup.equityOffered}%</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Growth</div>
            <div className="text-sm font-medium text-success">+{startup.metrics.revenueGrowth}%</div>
          </div>
        </div>

        <div className="w-full h-1 bg-secondary rounded-full mb-4">
          <div className="h-1 bg-accent rounded-full transition-all duration-500" style={{ width: `${allocationPercent}%` }} />
        </div>

        {highValueName && (
          <div className="mb-4">
            <span className="text-[10px] text-accent/80 font-medium px-2 py-1 rounded border border-accent/20 bg-accent/5">
              Endorsed by {highValueName}
            </span>
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
          <div className="flex items-center gap-1.5 z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleEndorsement(startup.id); }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${hasEndorsed ? 'text-accent bg-accent/5' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              title="Endorse this startup"
            >
              <ThumbsUp className={`w-[14px] h-[14px] ${hasEndorsed ? 'fill-accent' : ''}`} />
              {startup.endorsements.length > 0 && (
                <span className="text-[11px] font-medium">{startup.endorsements.length}</span>
              )}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowGuide(true); }}
              className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors"
              title="Offer Guidance"
            >
              <Handshake className="w-[14px] h-[14px]" />
              <span className="text-[11px] font-medium">Guide</span>
            </button>
          </div>

          <span className="text-[11px] font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            View Details &rarr;
          </span>
        </div>
      </div>

      {showGuide && <GuideModal startup={startup} onClose={() => setShowGuide(false)} />}
    </>
  );
};

export default StartupCard;
