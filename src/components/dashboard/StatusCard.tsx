
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatusCard = ({ title, value, icon: Icon, trend, className }: StatusCardProps) => {
  return (
    <Card className={cn("card-neumorph-sm hover-card", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}>
                  {trend.isPositive ? "+" : "-"}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs. last month</span>
              </div>
            )}
          </div>
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
