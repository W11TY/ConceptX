import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatNumber } from "@/lib/format";
import AppHeader from "@/components/AppHeader";
import InvestmentModal from "@/components/InvestmentModal";
import GuideModal from "@/components/GuideModal";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import RiskBadge from "@/components/RiskBadge";
import MetricCard from "@/components/MetricCard";
import { useStartupMetrics } from "@/hooks/useStartupMetrics";
import { Handshake, ThumbsUp, Play } from "lucide-react";

const StartupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { startups, user, toggleEndorsement } = useApp();
  const navigate = useNavigate();
  const [showInvest, setShowInvest] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isPlayingPitch, setIsPlayingPitch] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startup = startups.find((s) => s.id === id);
  const { allocationPercent, remaining } = useStartupMetrics(startup);

  if (!startup || !user) {
    navigate("/");
    return null;
  }

  const hasEndorsed = user ? startup.endorsements.includes(user.name) : false;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="screen-container pt-8">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-accent mb-8 flex items-center gap-2 transition-colors animate-fade-in w-fit">
          &larr; Back to Discover
        </button>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10 animate-fade-in border-b border-border pb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-accent">{startup.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-3xl font-bold tracking-tight">{startup.name}</h1>
                <RiskBadge risk={startup.riskLevel} />
              </div>
              <p className="text-muted-foreground">{startup.sector} · {startup.stage}</p>
            </div>
          </div>
          {user.role === "investor" && (
            <div className="flex items-stretch gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={() => toggleEndorsement(startup.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${hasEndorsed ? 'border-accent text-accent bg-accent/5' : 'border-border bg-card hover:bg-secondary text-foreground'}`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasEndorsed ? 'fill-accent' : ''}`} />
                <span className="hidden sm:inline">{hasEndorsed ? "Endorsed" : "Endorse"}</span>
                {startup.endorsements.length > 0 && <span className="sm:ml-1">({startup.endorsements.length})</span>}
              </button>
              <button 
                onClick={() => setShowGuide(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-sm font-medium transition-colors"
              >
                <Handshake className="w-4 h-4" />
                <span className="hidden sm:inline">Guide</span>
              </button>
              <button onClick={() => setShowInvest(true)} className="btn-primary flex-1 md:flex-none">
                Commit Capital
              </button>
            </div>
          )}
        </div>

        <div className="card-surface mb-8 border-l-4 border-l-accent animate-fade-in">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">Investment Thesis</p>
          <p className="text-lg leading-relaxed text-foreground/90">{startup.thesis}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <MetricCard label="Revenue" value={formatCurrency(startup.metrics.revenue)} />
          <MetricCard label="Growth" value={`+${startup.metrics.revenueGrowth}%`} valueColor="text-success" />
          <MetricCard label="Users" value={formatNumber(startup.metrics.users)} />
          <MetricCard label="Runway" value={`${startup.metrics.runway}mo`} />
        </div>

        <div className="card-surface mb-8 animate-fade-in">
          <div className="metric-label mb-6">Revenue Traction</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={startup.tractionHistory}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(270 70% 50%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(270 70% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'hsl(0 0% 50%)', fontSize: 12 }} dy={10} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} tick={{ fill: 'hsl(0 0% 50%)', fontSize: 12 }} dx={-10} width={60} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  contentStyle={{
                    background: 'hsl(0 0% 10%)',
                    border: '1px solid hsl(0 0% 20%)',
                    borderRadius: 8,
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(270 70% 50%)" strokeWidth={2} fill="url(#chartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface mb-8 animate-fade-in">
          <div className="metric-label mb-6">Founder Pitch</div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/80 border border-border group">
            <video 
              ref={videoRef}
              src="https://www.w3schools.com/html/mov_bbb.mp4" 
              className="w-full h-full object-cover"
              controls={isPlayingPitch}
              onPause={() => setIsPlayingPitch(false)}
              onPlay={() => setIsPlayingPitch(true)}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9' fill='%23000'%3E%3C/svg%3E"
            >
              <track kind="captions" />
              Your browser does not support HTML video.
            </video>
            
            {!isPlayingPitch && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-500 hover:bg-accent/10"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play();
                    setIsPlayingPitch(true);
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/5 opacity-50" />
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background/80 flex items-center justify-center backdrop-blur-md border border-border group-hover:scale-110 group-hover:border-accent/50 group-hover:shadow-[0_0_30px_-5px_rgba(150,50,255,0.3)] transition-all duration-300 z-10">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-accent fill-accent ml-1.5 opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          <div className="card-surface">
            <div className="metric-label mb-6">Founder</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <span className="font-bold text-accent">{startup.founder.name.charAt(0)}</span>
              </div>
              <div className="text-lg font-semibold">{startup.founder.name}</div>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{startup.founder.experience}</p>
              <p>{startup.founder.pastVentures}</p>
            </div>
          </div>

          <div className="card-surface">
            <div className="metric-label mb-6">Risk Factors</div>
            <div className="space-y-5">
              <div>
                <div className="text-sm font-semibold mb-1 border-l-2 border-accent pl-3">Market Risk</div>
                <div className="text-sm text-muted-foreground pl-3">{startup.risks.market}</div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1 border-l-2 border-accent pl-3">Execution Risk</div>
                <div className="text-sm text-muted-foreground pl-3">{startup.risks.execution}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="card-surface">
            <div className="metric-label mb-6">Deal Terms</div>
            <div className="space-y-4">
              {[
                { label: "Ask", value: formatCurrency(startup.askAmount) },
                { label: "Equity", value: `${startup.equityOffered}%` },
                { label: "Minimum", value: formatCurrency(startup.minimumInvestment) },
                { label: "Remaining", value: formatCurrency(remaining) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface">
            <div className="metric-label mb-6">Investor Activity</div>
            <div className="space-y-4">
              {[
                { label: "Total Committed", value: formatCurrency(startup.totalCommitted) },
                { label: "Investors", value: String(startup.investorCount) },
                { label: "Allocation", value: `${allocationPercent}%` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-secondary rounded-full mt-6 overflow-hidden">
              <div className="h-2 bg-accent rounded-full transition-all duration-500" style={{ width: `${allocationPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {showInvest && <InvestmentModal startup={startup} onClose={() => setShowInvest(false)} />}
      {showGuide && <GuideModal startup={startup} onClose={() => setShowGuide(false)} />}
    </div>
  );
};

export default StartupDetailPage;
