
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, Filter, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data for demonstration
const orderData = [
  {
    id: 'SHP-12345',
    marketplaceOrderId: 'AMZ-98765',
    amount: '$129.99',
    marketplace: 'Amazon',
    orderDate: '2025-04-29',
    paidDate: '2025-04-29',
    shippedDate: '2025-04-30',
    trackingNumber: 'UPS-1Z9876543210',
    status: 'Processing'
  },
  {
    id: 'SHP-12346',
    marketplaceOrderId: 'AMZ-98766',
    amount: '$79.50',
    marketplace: 'Amazon',
    orderDate: '2025-04-28',
    paidDate: '2025-04-28',
    shippedDate: '2025-04-30',
    trackingNumber: 'USPS-9400123456789012345678',
    status: 'Shipped'
  },
  {
    id: 'SHP-12347',
    marketplaceOrderId: 'ETS-43210',
    amount: '$45.00',
    marketplace: 'Etsy',
    orderDate: '2025-04-27',
    paidDate: '2025-04-27',
    shippedDate: '',
    trackingNumber: '',
    status: 'Awaiting Payment'
  },
  {
    id: 'SHP-12348',
    marketplaceOrderId: 'EBY-54321',
    amount: '$199.95',
    marketplace: 'eBay',
    orderDate: '2025-04-26',
    paidDate: '2025-04-26',
    shippedDate: '2025-04-28',
    trackingNumber: 'FDX-7890123456',
    status: 'Shipped'
  },
  {
    id: 'SHP-12349',
    marketplaceOrderId: 'AMZ-98767',
    amount: '$25.49',
    marketplace: 'Amazon',
    orderDate: '2025-04-25',
    paidDate: '2025-04-25',
    shippedDate: '',
    trackingNumber: '',
    status: 'Cancelled'
  },
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'abnormal', label: 'Abnormal Orders' },
    { id: 'awaiting', label: 'Awaiting Payment' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'ticketed', label: 'Ticketed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  // Filter orders based on active tab
  const filteredOrders = orderData.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'abnormal') return false; // No abnormal orders in sample data
    if (activeTab === 'awaiting') return order.status === 'Awaiting Payment';
    if (activeTab === 'processing') return order.status === 'Processing';
    if (activeTab === 'shipped') return order.status === 'Shipped';
    if (activeTab === 'ticketed') return order.status === 'Ticketed';
    if (activeTab === 'cancelled') return order.status === 'Cancelled';
    return true;
  }).filter(order => {
    if (!searchTerm) return true;
    return order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           order.marketplaceOrderId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDownload = () => {
    alert('Downloading orders in CSV format');
    // Implementation for CSV download would go here
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Button onClick={handleDownload} className="gap-2">
          <Download size={16} />
          Download Orders
        </Button>
      </div>
      
      <Card className="card-neumorph">
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all your marketplace orders in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <TabsList className="bg-muted/50 overflow-auto w-full md:w-auto flex flex-nowrap whitespace-nowrap">
                {tabs.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id} 
                    className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search order ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-8"
                  />
                </div>
                
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0 pt-0">
                <div className="rounded-md border">
                  {filteredOrders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Shopperr ID</TableHead>
                          <TableHead>Marketplace ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Marketplace</TableHead>
                          <TableHead>Order Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Tracking #</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.marketplaceOrderId}</TableCell>
                            <TableCell>{order.amount}</TableCell>
                            <TableCell>{order.marketplace}</TableCell>
                            <TableCell>{order.orderDate}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'Shipped' ? 'bg-green-100 text-green-800' : 
                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                                order.status === 'Awaiting Payment' ? 'bg-yellow-100 text-yellow-800' : 
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>{order.trackingNumber || '—'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">View</Button>
                                {order.status === 'Processing' && (
                                  <Button variant="outline" size="sm">Ship</Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <p className="text-lg font-medium mb-2">No orders found</p>
                      <p className="text-muted-foreground mb-6">
                        {activeTab === 'all' 
                          ? "You don't have any orders yet." 
                          : `No ${activeTab} orders found.`}
                      </p>
                      {searchTerm && (
                        <Button variant="outline" onClick={() => setSearchTerm('')}>
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {filteredOrders.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredOrders.length} of {orderData.length} orders
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
