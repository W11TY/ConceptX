import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import AuthPage from "./pages/AuthPage";
import DiscoverPage from "./pages/DiscoverPage";
import StartupDetailPage from "./pages/StartupDetailPage";
import PortfolioPage from "./pages/PortfolioPage";
import FounderDashboard from "./pages/FounderDashboard";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const AppContent = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/startup/:id" element={<StartupDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/founder-dashboard" element={<FounderDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
