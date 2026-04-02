import React from "react";
import { RiskLevel } from "@/data/types";

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, className = "" }) => {
  const styles = {
    Low: "bg-risk-low/10 text-risk-low",
    Medium: "bg-risk-medium/10 text-risk-medium",
    High: "bg-risk-high/10 text-risk-high",
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${styles[risk]} ${className}`}>
      {risk} Risk
    </span>
  );
};

export default RiskBadge;
