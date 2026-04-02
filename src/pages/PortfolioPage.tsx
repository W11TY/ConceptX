import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/format";
import AppHeader from "@/components/AppHeader";
import InvestmentCard from "@/components/InvestmentCard";

const PortfolioPage = () => {
  const { user, investments } = useApp();
  const navigate = useNavigate();

  if (!user || user.role !== "investor") {
    navigate("/");
    return null;
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0);
  const totalOwnership = investments.reduce((sum, inv) => sum + inv.ownershipPercent, 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="screen-container pt-12">
        <div className="mb-12 animate-fade-in border-b border-border pb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mb-2">Portfolio Value</p>
          <p className="text-5xl font-bold tracking-tight mb-2">{formatCurrency(totalInvested)}</p>
          <p className="text-muted-foreground">{investments.length} positions · {totalOwnership.toFixed(2)}% ownership</p>
        </div>

        {investments.length === 0 ? (
          <div className="card-surface text-center py-24 animate-fade-in border-dashed">
            <p className="text-lg font-medium mb-2">No active positions</p>
            <p className="text-muted-foreground mb-8">Deploy capital to start building your portfolio.</p>
            <button onClick={() => navigate("/discover")} className="btn-primary">
              Explore Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investments.map((inv) => (
              <InvestmentCard key={inv.id} inv={inv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
