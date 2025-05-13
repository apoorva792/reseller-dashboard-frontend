import React, { useState, useEffect } from 'react';
import { ArrowUp, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// API client for wallet operations
const walletApi = {
  getBalance: async () => {
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
    return response.json();
  },
  
  updateBalance: async (amount: number, transactionType: string, description?: string) => {
    const response = await fetch('/api/wallet/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount, transaction_type: transactionType, description })
    });
    if (!response.ok) {
      throw new Error('Failed to update wallet balance');
    }
    return response.json();
  },
  
  getTransactions: async (transactionType?: string, page: number = 1, pageSize: number = 20) => {
    let url = `/api/wallet/transactions?page=${page}&page_size=${pageSize}`;
    if (transactionType) {
      url += `&transaction_type=${transactionType}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch wallet transactions');
    }
    return response.json();
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Transaction type label
const getTransactionTypeLabel = (type: string) => {
  switch (type) {
    case 'add':
      return 'Recharge';
    case 'subtract':
      return 'Payment';
    default:
      return type;
  }
};

const Wallet = () => {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number>(370001.00);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [autopayEnabled, setAutopayEnabled] = useState<boolean>(true);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState<boolean>(false);
  const [rechargeAmount, setRechargeAmount] = useState<string>('');
  
  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      // Comment out actual API call for demo
      // const response = await walletApi.getBalance();
      // if (response.success && response.data) {
      //   setWalletBalance(response.data.currencies_balance);
      // }
      
      // Always set to fixed balance for demo
      setWalletBalance(370001.00);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error('Failed to load wallet balance');
      
      // On error, still set the fixed balance
      setWalletBalance(370001.00);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch transactions
  const fetchTransactions = async (tab: string = 'all') => {
    try {
      setIsLoading(true);
      const transactionType = tab === 'all' ? undefined : tab === 'recharges' ? 'add' : tab === 'payments' ? 'subtract' : undefined;
      
      // Mock transaction data instead of API call
      const mockTransactions = [
        {
          date: '2025-05-01 22:14:41',
          type: 'Order',
          amount: '-Rs.1,189.72',
          balance: 'Rs.742,962.19',
          details: 'Detail'
        },
        {
          date: '2025-05-01 22:14:41',
          type: 'Order',
          amount: '-Rs.2,322.49',
          balance: 'Rs.740,639.70',
          details: 'Detail'
        },
        {
          date: '2025-05-01 22:14:41',
          type: 'Order',
          amount: '-Rs.2,974.63',
          balance: 'Rs.737,665.07',
          details: 'Detail'
        },
        {
          date: '2025-05-01 22:14:41',
          type: 'Order',
          amount: '-Rs.508.28',
          balance: 'Rs.737,156.79',
          details: 'Detail'
        },
        {
          date: '2025-05-01 22:14:41',
          type: 'Order',
          amount: '-Rs.715.47',
          balance: 'Rs.736,441.32',
          details: 'Detail'
        }
      ];
      
      setTransactions(mockTransactions);
      
      // Uncomment to use API when ready
      // const response = await walletApi.getTransactions(transactionType);
      // if (response.success && response.data) {
      //   setTransactions(response.data.transactions || []);
      // }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    fetchTransactions(tab);
  };
  
  // Handle autopay toggle
  const handleAutopayToggle = (enabled: boolean) => {
    setAutopayEnabled(enabled);
    toast.success(`Autopay ${enabled ? 'enabled' : 'disabled'}`);
    // TODO: Update autopay setting in backend
  };
  
  // Handle recharge wallet
  const handleRechargeWallet = async () => {
    if (!rechargeAmount || isNaN(parseFloat(rechargeAmount)) || parseFloat(rechargeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      setIsLoading(true);
      const amount = parseFloat(rechargeAmount);
      const response = await walletApi.updateBalance(amount, 'add', 'Wallet recharge');
      
      if (response.success) {
        toast.success('Wallet recharged successfully');
        setRechargeDialogOpen(false);
        setRechargeAmount('');
        fetchWalletBalance();
        fetchTransactions(selectedTab);
      }
    } catch (error) {
      console.error('Error recharging wallet:', error);
      toast.error('Failed to recharge wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, []);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">E-Wallet</h1>
      
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Wallet Balance</h2>
            <p className="text-muted-foreground">Manage your wallet funds and recharge when needed</p>
            
            <div className="mt-4">
              <div className="text-sm text-muted-foreground">Available Balance</div>
              <div className="text-3xl font-bold mt-1">₹{walletBalance.toFixed(2)}</div>
            </div>
            
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium" 
              onClick={() => setRechargeDialogOpen(true)}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Recharge Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="pt-6 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Autopay Settings</h2>
          </div>
          <Switch 
            checked={autopayEnabled} 
            onCheckedChange={handleAutopayToggle} 
          />
        </CardContent>
      </Card>
      
      <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 p-4 rounded-md">
        <Info size={16} className="text-blue-500" />
        <p>Automatic payments are enabled. Your wallet balance will be used for future orders.</p>
      </div>
      
      <div className="bg-gray-50 border border-gray-100 p-3 rounded-md text-sm">
        Keep your wallet recharged to ensure uninterrupted order processing. A minimum balance of ₹500 is recommended.
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Billing History</h2>
        
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recharges">Recharges</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {transaction.amount}
                        </TableCell>
                        <TableCell>{transaction.balance}</TableCell>
                        <TableCell>
                          <Button 
                            variant="link" 
                            size="sm"
                            className="text-blue-600 p-0 h-auto font-medium"
                          >
                            {transaction.details}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Recharge Dialog */}
      <Dialog open={rechargeDialogOpen} onOpenChange={setRechargeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recharge Wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRechargeDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRechargeWallet}
              disabled={isLoading || !rechargeAmount}
            >
              {isLoading ? 'Processing...' : 'Recharge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet; 