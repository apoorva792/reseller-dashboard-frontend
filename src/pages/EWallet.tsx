import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, Download, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

// Sample transaction history data
const transactionData = [
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
  },
  {
    date: '2025-05-01 22:14:41',
    type: 'Order',
    amount: '-Rs.572.03',
    balance: 'Rs.735,869.29',
    details: 'Detail'
  },
  {
    date: '2025-05-01 22:14:41',
    type: 'Order',
    amount: '-Rs.575.07',
    balance: 'Rs.735,294.22',
    details: 'Detail'
  },
  {
    date: '2025-05-01 22:14:41',
    type: 'Order',
    amount: '-Rs.566.61',
    balance: 'Rs.734,727.61',
    details: 'Detail'
  },
  {
    date: '2025-05-01 22:14:41',
    type: 'Order',
    amount: '-Rs.1,364.64',
    balance: 'Rs.733,362.97',
    details: 'Detail'
  },
  {
    date: '2025-05-01 22:14:41',
    type: 'Order',
    amount: '-Rs.2,808.44',
    balance: 'Rs.730,554.53',
    details: 'Detail'
  }
];

const EWallet = () => {
  const [autopayEnabled, setAutopayEnabled] = useState(true);
  const { toast } = useToast();

  const handleRecharge = () => {
    toast({
      title: "Recharge initiated",
      description: "You'll be redirected to the payment gateway",
    });
  };

  const handleDownloadInvoice = (txnId: string) => {
    toast({
      title: "Downloading invoice",
      description: `Invoice ${txnId} will be downloaded shortly`,
    });
  };

  const handleAutopayChange = (checked: boolean) => {
    setAutopayEnabled(checked);
    toast({
      title: `Autopay ${checked ? 'enabled' : 'disabled'}`,
      description: checked 
        ? "Your wallet balance will be used for future orders." 
        : "You'll need to manually pay for future orders.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold">E-Wallet</h1>
      
      {/* Wallet Balance Card */}
      <Card className="card-neumorph">
        <CardHeader>
          <CardTitle className="text-xl">Wallet Balance</CardTitle>
          <CardDescription>
            Manage your wallet funds and recharge when needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold mt-1">₹370,001.00</p>
            </div>
            <Button 
              onClick={handleRecharge}
              className="bg-gold hover:bg-gold-600 text-navy"
            >
              <ArrowUp className="mr-1 h-4 w-4" /> Recharge Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Autopay Section */}
      <Card className="card-neumorph">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Autopay Settings</CardTitle>
            <Switch 
              checked={autopayEnabled}
              onCheckedChange={handleAutopayChange}
              id="autopay-mode"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {autopayEnabled 
                ? "Automatic payments are enabled. Your wallet balance will be used for future orders."
                : "Automatic payments are disabled. You'll need to manually pay for future orders."}
            </p>
          </div>
          <div className="p-3 bg-muted rounded-md mt-3">
            <p className="text-sm">
              Keep your wallet recharged to ensure uninterrupted order processing. A minimum balance of ₹500 is recommended.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction History */}
      <Card className="card-neumorph">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recharges">Recharges</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
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
                    {transactionData.map(transaction => (
                      <TableRow key={transaction.date} className="hover:bg-gray-50">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="recharges" className="mt-0">
              <div className="rounded-md border">
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
                    {transactionData
                      .filter(t => t.type === 'Recharge')
                      .map(transaction => (
                        <TableRow key={transaction.date} className="hover:bg-gray-50">
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell className="text-green-600 font-medium">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-0">
              <div className="rounded-md border">
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
                    {transactionData
                      .filter(t => t.type === 'Order')
                      .map(transaction => (
                        <TableRow key={transaction.date} className="hover:bg-gray-50">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="refunds" className="mt-0">
              <div className="rounded-md border">
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
                    {transactionData
                      .filter(t => t.type === 'Refund')
                      .map(transaction => (
                        <TableRow key={transaction.date} className="hover:bg-gray-50">
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell className="text-green-600 font-medium">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EWallet;
