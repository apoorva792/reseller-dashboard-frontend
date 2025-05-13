import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

// API client for wallet operations
const fetchWalletBalance = async () => {
  try {
    const response = await fetch('/api/wallet/balance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wallet balance');
    }
    
    const data = await response.json();
    if (data.success && data.data) {
      return data.data.currencies_balance;
    }
    return 370001.00; // Fixed balance for demo
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    toast.error('Failed to load wallet balance');
    return 370001.00; // Return fixed balance even on error
  }
};

const WalletBalance: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState<number>(370001.00);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadBalance = async () => {
      setIsLoading(true);
      // Uncomment to fetch real balance from API
      // const balance = await fetchWalletBalance();
      // setWalletBalance(balance);
      
      // For demo, always set to fixed balance
      setWalletBalance(370001.00);
      setIsLoading(false);
    };
    
    loadBalance();
  }, []);
  
  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Wallet Balance</h2>
          <p className="text-muted-foreground">Available for orders & subscriptions</p>
          
          <div className="mt-4">
            <div className="text-3xl font-bold mt-1">
              {isLoading ? "Loading..." : `₹${walletBalance.toFixed(2)}`}
            </div>
          </div>
          
          <Button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium" 
            onClick={() => toast.info("Recharge functionality coming soon!")}
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Recharge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance; 