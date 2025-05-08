
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart as RechartsBarChart, 
  LineChart as RechartsLineChart, 
  PieChart as RechartsPieChart,
  Bar, 
  Line, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  ResponsiveContainer
} from 'recharts';

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
          <Tabs value={chartTab} className="h-full">
            <TabsContent value="bar" className="mt-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={dummyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} units`, 'Sales']} />
                  <Legend />
                  <Bar dataKey="value" fill="#0A174E" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="line" className="mt-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                  <Legend />
                  <Line type="monotone" dataKey="Earnings" stroke="#0A174E" activeDot={{ r: 8 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pie" className="mt-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={dummyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dummyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} units`} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default BestSellingChart;
