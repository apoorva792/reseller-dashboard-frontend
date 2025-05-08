
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricProps {
  title: string;
  value: string;
  target: string;
  progress: number;
  tooltipText: string;
  status: 'good' | 'warning' | 'danger';
}

const Metric = ({ title, value, target, progress, tooltipText, status }: MetricProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'danger':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{title}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>{value}</span>
      </div>
      <Progress value={progress} className="h-1.5" indicatorClassName={getProgressColor()} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Current</span>
        <span>Target: {target}</span>
      </div>
    </div>
  );
};

const AmazonMetrics = () => {
  return (
    <Card className="card-neumorph">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Amazon Performance Metrics</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Metric 
          title="Order Defect Rate (Short Term)" 
          value="0.8%" 
          target="< 1%" 
          progress={80} 
          tooltipText="The percentage of orders with defects in the last 90 days. Keep below 1% to maintain good seller status." 
          status="good" 
        />
        
        <Metric 
          title="Order Defect Rate (Long Term)" 
          value="0.5%" 
          target="< 1%" 
          progress={50} 
          tooltipText="The percentage of orders with defects over your account lifetime. Keep below 1% to maintain good seller status." 
          status="good" 
        />
        
        <Metric 
          title="Late Shipment Rate" 
          value="2.8%" 
          target="< 4%" 
          progress={70} 
          tooltipText="The percentage of orders that were shipped later than the expected ship date. Keep below 4% to avoid account issues." 
          status="warning" 
        />
        
        <Metric 
          title="Valid Tracking Rate" 
          value="96%" 
          target="> 95%" 
          progress={96} 
          tooltipText="The percentage of orders with valid tracking information. Keep above 95% to maintain good account health." 
          status="good" 
        />
      </CardContent>
    </Card>
  );
};

export default AmazonMetrics;
