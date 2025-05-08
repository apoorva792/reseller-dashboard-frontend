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
    id: 'TXN-12345',
    date: '2025-05-07',
    type: 'Recharge',
    amount: '+₹1,000.00',
    balanceAfter: '₹3,458.50',
    invoice: true,
    status: 'Completed'
  },
  {
    id: 'TXN-12344',
    date: '2025-05-05',
    type: 'Order Payment',
    amount: '-₹580.25',
    balanceAfter: '₹2,458.50',
    invoice: true,
    status: 'Completed'
  },
  {
    id: 'TXN-12343',
    date: '2025-05-03',
    type: 'Order Payment',
    amount: '-₹320.75',
    balanceAfter: '₹3,038.75',
    invoice: true,
    status: 'Completed'
  },
  {
    id: 'TXN-12342',
    date: '2025-05-01',
    type: 'Refund',
    amount: '+₹159.50',
    balanceAfter: '₹3,359.50',
    invoice: true,
    status: 'Completed'
  },
  {
    id: 'TXN-12341',
    date: '2025-04-25',
    type: 'Recharge',
    amount: '+₹2,000.00',
    balanceAfter: '₹3,200.00',
    invoice: true,
    status: 'Completed'
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
        ? "Your wallet will be automatically used for future orders" 
        : "You'll need to manually pay for future orders",
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
              <p className="text-3xl font-bold mt-1">₹2,458.50</p>
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
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'Refund' ? 'secondary' : 
                                        transaction.type === 'Recharge' ? 'default' : 'outline'}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={
                          transaction.amount.startsWith('+') ? 'text-green-600 font-medium' : 
                          transaction.amount.startsWith('-') ? 'text-red-600 font-medium' : ''
                        }>
                          {transaction.amount}
                        </TableCell>
                        <TableCell>{transaction.balanceAfter}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.invoice && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadInvoice(transaction.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
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
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData
                      .filter(t => t.type === 'Recharge')
                      .map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>
                            <Badge variant="default">{transaction.type}</Badge>
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {transaction.amount}
                          </TableCell>
                          <TableCell>{transaction.balanceAfter}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.invoice && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadInvoice(transaction.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-0">
              {/* Filtered for payments */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData
                      .filter(t => t.type === 'Order Payment')
                      .map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.type}</Badge>
                          </TableCell>
                          <TableCell className="text-red-600 font-medium">
                            {transaction.amount}
                          </TableCell>
                          <TableCell>{transaction.balanceAfter}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.invoice && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadInvoice(transaction.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="refunds" className="mt-0">
              {/* Filtered for refunds */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData
                      .filter(t => t.type === 'Refund')
                      .map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{transaction.type}</Badge>
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {transaction.amount}
                          </TableCell>
                          <TableCell>{transaction.balanceAfter}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.invoice && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadInvoice(transaction.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
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
