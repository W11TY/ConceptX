import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Startup } from "@/data/types";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

interface Props {
  startup: Startup;
  onClose: () => void;
}

const presets = [10000, 50000, 100000, 500000];

const InvestmentModal = ({ startup, onClose }: Props) => {
  const { user, commitInvestment } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [customInput, setCustomInput] = useState("");

  if (!user) return null;

  const remaining = startup.askAmount - startup.totalCommitted;
  const maxInvestable = Math.min(remaining, user.availableCapital || Infinity);
  const ownershipPercent = amount > 0 ? ((amount / startup.askAmount) * startup.equityOffered) : 0;
  const isValid = amount >= startup.minimumInvestment && amount <= maxInvestable;

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustomInput("");
  };

  const handleCustom = (val: string) => {
    setCustomInput(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) setAmount(num);
    else setAmount(0);
  };

  const handleCommit = () => {
    if (!isValid) return;
    const success = commitInvestment(startup.id, amount);
    if (success) {
      toast.success(`${formatCurrency(amount)} committed to ${startup.name}`);
      onClose();
    } else {
      toast.error("Investment failed. Check allocation limits.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-slide-up shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <span className="text-sm font-bold text-accent">{startup.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-base font-semibold">{startup.name}</h3>
              <p className="text-xs text-muted-foreground">{startup.sector} · {startup.stage}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">✕</button>
        </div>

        {/* Available */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary rounded-xl mb-5">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Available Capital</span>
          <span className="text-sm font-bold text-foreground">{formatCurrency(user.availableCapital || 0)}</span>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presets.map((val) => (
            <button
              key={val}
              onClick={() => handlePreset(val)}
              disabled={val > maxInvestable}
              className={`py-3 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 ${
                amount === val
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-secondary text-foreground hover:border-accent/40 disabled:opacity-20 disabled:hover:border-border"
              }`}
            >
              {formatCurrency(val)}
            </button>
          ))}
        </div>

        {/* Custom */}
        <div className="mb-5">
          <input
            type="number"
            value={customInput}
            onChange={(e) => handleCustom(e.target.value)}
            placeholder="Custom amount (₹)"
            className="input-field"
          />
        </div>

        {/* Calculation */}
        {amount > 0 && (
          <div className="bg-secondary rounded-xl p-4 mb-5 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Commitment</span>
              <span className="font-semibold">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ownership</span>
              <span className="font-semibold text-accent">{ownershipPercent.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-semibold">{formatCurrency(remaining - amount)}</span>
            </div>
            <div className="pt-2.5 border-t border-border">
              <p className="text-xs text-muted-foreground">
                You are committing {formatCurrency(amount)} for {ownershipPercent.toFixed(2)}% equity
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">
                This is a long-term illiquid position
              </p>
            </div>
          </div>
        )}

        {/* Validation */}
        {amount > 0 && amount < startup.minimumInvestment && (
          <p className="text-xs text-destructive mb-3">Minimum investment: {formatCurrency(startup.minimumInvestment)}</p>
        )}
        {amount > maxInvestable && (
          <p className="text-xs text-destructive mb-3">Exceeds available allocation</p>
        )}

        <button onClick={handleCommit} disabled={!isValid} className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed">
          Commit Capital
        </button>
      </div>
    </div>
  );
};

export default InvestmentModal;
