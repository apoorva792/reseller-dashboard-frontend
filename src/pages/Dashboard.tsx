import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import MembershipCard from '@/components/dashboard/MembershipCard';
import WalletCard from '@/components/dashboard/WalletCard';
import StatusCard from '@/components/dashboard/StatusCard';
import AmazonMetrics from '@/components/dashboard/AmazonMetrics';
import BestSellingChart from '@/components/dashboard/BestSellingChart';
import { ShoppingBag, AlertTriangle, CreditCard, Package, Truck, RotateCcw, XCircle } from 'lucide-react';
import { useOnboardingCheck } from '@/onboarding-flow/hooks/useOnboardingCheck';

const Dashboard = () => {
  console.log('Dashboard rendering');
  
  let isCheckingOnboarding = false;
  
  try {
    isCheckingOnboarding = useOnboardingCheck();
    console.log('useOnboardingCheck successful, isChecking:', isCheckingOnboarding);
  } catch (error) {
    console.error('Error in Dashboard with useOnboardingCheck:', error);
  }
  
  // If still checking onboarding status, show a loading indicator
  if (isCheckingOnboarding) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeBanner />
      
      <div className="grid md:grid-cols-2 gap-6">
        <MembershipCard />
        <WalletCard />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <StatusCard 
          title="All Orders" 
          value="246" 
          icon={ShoppingBag}
          trend={{ value: 12, isPositive: true }}
          className="col-span-1"
        />
        <StatusCard 
          title="Abnormal Orders" 
          value="3" 
          icon={AlertTriangle}
          className="col-span-1"
        />
        <StatusCard 
          title="Awaiting Payment" 
          value="8" 
          icon={CreditCard}
          className="col-span-1"
        />
        <StatusCard 
          title="Processing" 
          value="15" 
          icon={Package}
          className="col-span-1"
        />
        <StatusCard 
          title="Shipped" 
          value="205" 
          icon={Truck}
          className="col-span-1"
        />
        <StatusCard 
          title="Returned/Refunded" 
          value="7" 
          icon={RotateCcw}
          className="col-span-1"
        />
        <StatusCard 
          title="Cancelled" 
          value="8" 
          icon={XCircle}
          className="col-span-1"
        />
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <AmazonMetrics />
        <BestSellingChart />
      </div>
    </div>
  );
};

export default Dashboard;
