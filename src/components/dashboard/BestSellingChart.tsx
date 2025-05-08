
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';

const dummyData = [
  { name: 'Wireless Earbuds', value: 1200, color: '#0A174E' },
  { name: 'Smart Watch', value: 900, color: '#16389e' },
  { name: 'Bluetooth Speaker', value: 850, color: '#1e45b3' },
  { name: 'Phone Case', value: 700, color: '#2e59d1' },
  { name: 'Power Bank', value: 600, color: '#5277db' },
];

const monthlyData = [
  { month: 'Jan', Earnings: 1000 },
  { month: 'Feb', Earnings: 1500 },
  { month: 'Mar', Earnings: 1200 },
  { month: 'Apr', Earnings: 1800 },
  { month: 'May', Earnings: 2000 },
  { month: 'Jun', Earnings: 2400 },
];

const BestSellingChart = () => {
  const [chartTab, setChartTab] = useState('bar');

  return (
    <Card className="card-neumorph">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg font-medium">Best-Selling Products</CardTitle>
          <Tabs value={chartTab} onValueChange={setChartTab} className="w-auto">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="bar" className="text-xs">Bar</TabsTrigger>
              <TabsTrigger value="line" className="text-xs">Line</TabsTrigger>
              <TabsTrigger value="pie" className="text-xs">Pie</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <TabsContent value="bar" className="mt-0 h-full">
            <BarChart 
              data={dummyData} 
              index="name"
              categories={['value']}
              colors={['#0A174E']}
              valueFormatter={(value) => `${value} units`}
              yAxisWidth={48}
            />
          </TabsContent>
          <TabsContent value="line" className="mt-0 h-full">
            <LineChart 
              data={monthlyData} 
              index="month"
              categories={['Earnings']}
              colors={['#0A174E']}
              valueFormatter={(value) => `$${value}`}
              yAxisWidth={48}
            />
          </TabsContent>
          <TabsContent value="pie" className="mt-0 h-full">
            <PieChart 
              data={dummyData} 
              index="name"
              category="value"
              colors={dummyData.map(item => item.color)}
              valueFormatter={(value) => `${value} units`}
              className="h-full mx-auto"
            />
          </TabsContent>
        </div>
      </CardContent>
    </Card>
  );
};

export default BestSellingChart;
