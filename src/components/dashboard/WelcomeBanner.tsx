
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const WelcomeBanner = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  
  let greeting = "Good morning";
  if (hours >= 12 && hours < 18) {
    greeting = "Good afternoon";
  } else if (hours >= 18) {
    greeting = "Good evening";
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-navy to-navy-700 text-white animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{greeting}, John!</h1>
            <p className="text-white/80 mt-1">
              Welcome back to your Shopperr reseller dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span>Active Premium Membership</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
