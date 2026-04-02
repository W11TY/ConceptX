import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import AppHeader from "@/components/AppHeader";
import MetricCard from "@/components/MetricCard";
import { formatCurrency } from "@/lib/format";

const FounderDashboard = () => {
  const { user, startups } = useApp();
  const navigate = useNavigate();

  if (!user || user.role !== "founder") {
    navigate("/");
    return null;
  }

  const userStartup = startups.find(s => s.name === user.startupName);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="screen-container pt-12 pb-20">
        <div className="mb-12 animate-fade-in border-b border-border pb-8">
          <p className="text-sm opacity-80 mb-2 uppercase tracking-wider font-medium text-muted-foreground">Your Raise</p>
          <p className="text-5xl font-bold tracking-tight mb-2">{user.startupName}</p>
          <p className="text-muted-foreground">{user.sector} · {user.stage}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <MetricCard label="Funding Ask" value={formatCurrency(user.fundingAsk || 0)} />
          <MetricCard label="Equity" value={`${user.equityOffered}%`} />
          <MetricCard label="Stage" value={user.stage || ""} />
          <MetricCard label="Sector" value={user.sector || ""} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 tracking-tight">Mentorship Offers</h2>
            {userStartup && userStartup.guideRequests && userStartup.guideRequests.length > 0 ? (
              <div className="space-y-3">
                {userStartup.guideRequests.map(req => (
                  <div key={req.userId} className="card-surface p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-accent">{req.userName.charAt(0)}</span>
                        </div>
                        <span className="font-semibold text-sm">{req.userName}</span>
                      </div>
                      <span className="text-[10px] uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-accent/40 pl-3">
                      "{req.message || "I'd like to offer my guidance and support for your journey."}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-surface text-center py-16 border-dashed">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 opacity-50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <p className="text-sm font-medium mb-1">No offers yet</p>
                <p className="text-xs text-muted-foreground">Mentorship requests from investors will appear here.</p>
              </div>
            )}
          </div>

          <div className="card-surface h-fit border-l-4 border-l-success bg-success/5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Raise is Live</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Qualified investors can now discover and commit capital to {user.startupName}. Updates on capital committed will appear in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;
