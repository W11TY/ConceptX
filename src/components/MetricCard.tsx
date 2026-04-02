import React from "react";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, valueColor, className = "" }) => {
  return (
    <div className={`card-surface ${className}`}>
      <div className="metric-label mb-1">{label}</div>
      <div className={`metric-value ${valueColor || ""}`}>
        {value}
      </div>
    </div>
  );
};

export default MetricCard;
