import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { UserProfile, Sector, Stage } from "@/data/types";

const AuthPage = () => {
  const [step, setStep] = useState<"role" | "investor" | "founder">("role");
  const [selectedRole, setSelectedRole] = useState<"investor" | "founder" | null>(null);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [accreditation, setAccreditation] = useState("Accredited");
  const [investmentRange, setInvestmentRange] = useState("₹25L – ₹1Cr");
  const [startupName, setStartupName] = useState("");
  const [sector, setSector] = useState<Sector>("AI");
  const [stage, setStage] = useState<Stage>("Seed");
  const [fundingAsk, setFundingAsk] = useState("");
  const [equityOffered, setEquityOffered] = useState("");

  const rangeMap: Record<string, [number, number, number]> = {
    "₹5L – ₹25L": [500000, 2500000, 2500000],
    "₹25L – ₹1Cr": [2500000, 10000000, 10000000],
    "₹1Cr – ₹5Cr": [10000000, 50000000, 50000000],
  };

  const handleInvestorSubmit = () => {
    if (!name.trim()) return;
    const [min, max, capital] = rangeMap[investmentRange] || rangeMap["₹25L – ₹1Cr"];
    const profile: UserProfile = {
      role: "investor",
      name: name.trim(),
      accreditationStatus: accreditation,
      investmentRangeMin: min,
      investmentRangeMax: max,
      availableCapital: capital,
    };
    setUser(profile);
    navigate("/discover");
  };

  const handleFounderSubmit = () => {
    if (!name.trim() || !startupName.trim()) return;
    const profile: UserProfile = {
      role: "founder",
      name: name.trim(),
      startupName: startupName.trim(),
      sector,
      stage,
      fundingAsk: Number(fundingAsk) || 5000000,
      equityOffered: Number(equityOffered) || 10,
    };
    setUser(profile);
    navigate("/founder-dashboard");
  };

  if (step === "role") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md px-6 relative z-10 animate-fade-in text-center flex flex-col h-full justify-center">
          <img src="/logo.png" alt="ConceptX Logo" className="h-10 sm:h-12 w-auto object-contain mx-auto mb-10 opacity-80 transition-opacity hover:opacity-100" />
          <p className="text-muted-foreground text-sm mb-10">Private capital allocation</p>
          
          <div className="space-y-4 text-left mb-8">
            <button
              onClick={() => setSelectedRole("investor")}
              className={`w-full p-5 rounded-xl border transition-all text-left ${selectedRole === "investor" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border bg-card hover:border-accent/40"}`}
            >
              <div className="font-semibold text-foreground mb-1">Investor</div>
              <div className="text-sm text-muted-foreground">Allocate capital to opportunities</div>
            </button>
            <button
              onClick={() => setSelectedRole("founder")}
              className={`w-full p-5 rounded-xl border transition-all text-left ${selectedRole === "founder" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border bg-card hover:border-accent/40"}`}
            >
              <div className="font-semibold text-foreground mb-1">Founder</div>
              <div className="text-sm text-muted-foreground">Raise capital from investors</div>
            </button>
          </div>

          <button
            onClick={() => selectedRole && setStep(selectedRole)}
            disabled={!selectedRole}
            className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "investor") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md px-6 animate-fade-in">
          <button onClick={() => setStep("role")} className="text-sm text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2">
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold mb-8">Investor Profile</h2>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Enter your name" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Accreditation</label>
              <select value={accreditation} onChange={(e) => setAccreditation(e.target.value)} className="select-field">
                <option>Accredited</option>
                <option>Qualified Purchaser</option>
                <option>Institutional</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Investment Range</label>
              <select value={investmentRange} onChange={(e) => setInvestmentRange(e.target.value)} className="select-field">
                <option>₹5L – ₹25L</option>
                <option>₹25L – ₹1Cr</option>
                <option>₹1Cr – ₹5Cr</option>
              </select>
            </div>
            <button onClick={handleInvestorSubmit} disabled={!name.trim()} className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed">
              Access Deal Flow
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-10">
      <div className="w-full max-w-md px-6 animate-fade-in">
        <button onClick={() => setStep("role")} className="text-sm text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2">
           &larr; Back
        </button>
        <h2 className="text-2xl font-bold mb-8">Founder Profile</h2>
        <div className="space-y-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Startup Name</label>
            <input value={startupName} onChange={(e) => setStartupName(e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Sector</label>
              <select value={sector} onChange={(e) => setSector(e.target.value as Sector)} className="select-field">
                {(["AI", "SaaS", "Fintech", "Climate Tech", "Healthcare", "E-commerce"] as Sector[]).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} className="select-field">
                {(["Pre-Seed", "Seed", "Series A", "Series B"] as Stage[]).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Ask (₹)</label>
              <input value={fundingAsk} onChange={(e) => setFundingAsk(e.target.value)} className="input-field" type="number" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Equity (%)</label>
              <input value={equityOffered} onChange={(e) => setEquityOffered(e.target.value)} className="input-field" type="number" />
            </div>
          </div>
          <button onClick={handleFounderSubmit} disabled={!name.trim() || !startupName.trim()} className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed mt-4">
            Launch Raise
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
