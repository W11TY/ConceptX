import { useApp } from "@/context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { formatCurrency } from "@/lib/format";

const AppHeader = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const navItems = user.role === "investor"
    ? [
        { label: "Discover", path: "/discover" },
        { label: "Portfolio", path: "/portfolio" },
      ]
    : [
        { label: "Dashboard", path: "/founder-dashboard" },
      ];

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <img src="/logo.png" alt="ConceptX Logo" className="h-6 sm:h-7 w-auto object-contain py-1 opacity-80 transition-opacity hover:opacity-100" />
          </button>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user.role === "investor" && user.availableCapital && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Capital</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(user.availableCapital)}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-accent">{user.name.charAt(0)}</span>
            </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
