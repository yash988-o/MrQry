import { ReactNode } from "react";
import Card from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center border border-glass-border text-text-primary">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-text-primary mb-1">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium">
            <span className={trend.isPositive ? "text-accent-green" : "text-accent-red"}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-text-muted">vs last week</span>
          </div>
        )}
      </div>
    </Card>
  );
}
