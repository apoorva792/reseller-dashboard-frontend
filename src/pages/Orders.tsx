import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Upload, Calendar, ChevronDown, FileInput } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Order status badge variants
const statusVariants = {
  shipped: { variant: "default", label: "Shipped" },
  processing: { variant: "secondary", label: "Processing" },
  delivered: { variant: "default", label: "Delivered" },
  pending: { variant: "outline", label: "Pending" },
  paid: { variant: "secondary", label: "Paid" },
  cancelled: { variant: "destructive", label: "Cancelled" },
  'awaiting-payment': { variant: "outline", label: "Awaiting Payment" },
  ticketed: { variant: "secondary", label: "Ticketed" },
  abnormal: { variant: "destructive", label: "Abnormal" },
};

// Sample order data for all tabs
const allOrders = [
  {
    shopperrOrderId: "SP-12345", 
    marketplaceOrderId: "AM-98765",
    amount: 136.99,
    marketplace: "Amazon",
    status: "shipped",
    orderDate: "Apr 15, 2023",
    paidDate: "Apr 15, 2023",
    shippedDate: "Apr 17, 2023",
    trackingNumber: "1Z999AA10123456784",
    returnStatus: "None",
    recipient: "Jane Smith"
  },
  {
    shopperrOrderId: "SP-12346", 
    marketplaceOrderId: "FL-76543",
    amount: 89.50,
    marketplace: "Flipkart",
    status: "processing",
    orderDate: "Apr 12, 2023",
    paidDate: "Apr 12, 2023",
    shippedDate: "-",
    trackingNumber: "-",
    returnStatus: "None",
    recipient: "John Davis"
  },
  {
    shopperrOrderId: "SP-12347", 
    marketplaceOrderId: "MS-54321",
    amount: 212.30,
    marketplace: "Meesho",
    status: "delivered",
    orderDate: "Apr 10, 2023",
    paidDate: "Apr 10, 2023",
    shippedDate: "Apr 11, 2023",
    trackingNumber: "FEDEX4832947329",
    returnStatus: "None",
    recipient: "Maria Rodriguez"
  },
];

const abnormalOrders = [
  {
    marketplaceOrderId: "AM-54321",
    recipient: "Mike Johnson",
    marketplace: "Amazon",
    date: "Apr 18, 2023",
    issueTag: "Missing Address",
  },
  {
    marketplaceOrderId: "FL-12345",
    recipient: "Sarah Williams",
    marketplace: "Flipkart",
    date: "Apr 17, 2023",
    issueTag: "Invalid Phone",
  }
];

const awaitingPaymentOrders = [
  {
    marketplaceOrderId: "MS-67890",
    recipient: "David Brown",
    marketplace: "Meesho",
    amount: 145.99,
    walletStatus: "Insufficient",
  },
  {
    marketplaceOrderId: "AM-45678",
    recipient: "Lisa Garcia",
    marketplace: "Amazon",
    amount: 78.50,
    walletStatus: "OK",
  }
];

const processingOrders = [
  {
    shopperrOrderId: "SP-23456",
    quantity: 3,
    totalPrice: 67.99,
    recipient: "Robert Wilson",
    marketplace: "Flipkart",
    orderDate: "Apr 19, 2023",
  },
  {
    shopperrOrderId: "SP-34567",
    quantity: 1,
    totalPrice: 99.99,
    recipient: "Jennifer Lee",
    marketplace: "Amazon",
    orderDate: "Apr 18, 2023",
  }
];

const shippedOrders = [
  {
    orderId: "SP-12345",
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    shipmentDate: "Apr 17, 2023",
    deliveryETA: "Apr 21, 2023",
  },
  {
    orderId: "SP-23451",
    trackingNumber: "FEDEX9876543210",
    carrier: "FedEx",
    shipmentDate: "Apr 16, 2023",
    deliveryETA: "Apr 19, 2023",
  }
];

const ticketedOrders = [
  {
    orderId: "SP-34512",
    ticketId: "TK-12345",
    issueSummary: "Wrong item received",
    lastUpdated: "Apr 18, 2023",
    status: "open",
  },
  {
    orderId: "SP-45123",
    ticketId: "TK-23456",
    issueSummary: "Package damaged",
    lastUpdated: "Apr 17, 2023",
    status: "in-progress",
  }
];

const cancelledOrders = [
  {
    orderId: "SP-51234",
    cancellationReason: "Out of stock",
    cancelledBy: "SFC",
    timestamp: "Apr 16, 2023",
  },
  {
    orderId: "SP-61235",
    cancellationReason: "Customer request",
    cancelledBy: "User",
    timestamp: "Apr 15, 2023",
  }
];

const marketplaces = ["All", "Amazon", "Flipkart", "Meesho", "Shopify", "Others"];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [marketplace, setMarketplace] = useState("All");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Row hover actions
  const OrderActions = ({ orderId }: { orderId: string }) => (
    <div className="flex items-center space-x-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={`/orders/${orderId}`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">View Details</span>
              <Search className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>View Details</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Download Invoice</span>
            <Download className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download Invoice</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Raise Ticket</span>
            <Calendar className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Raise Ticket</TooltipContent>
      </Tooltip>
    </div>
  );
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Here you would implement the actual file upload logic
    console.log("Uploading file:", selectedFile);
    // After successful upload:
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      {/* Search & Filters Panel */}
      <div className="card-neumorph-sm sticky top-4 z-10 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by order ID or recipient..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Date Range</span>
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-4" align="start">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium" htmlFor="from">From</label>
                        <Input 
                          id="from"
                          type="date"
                          value={dateRange.from}
                          onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium" htmlFor="to">To</label>
                        <Input 
                          id="to"
                          type="date"
                          value={dateRange.to}
                          onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Apply Range</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="md:col-span-2">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger>
                <SelectValue placeholder="Marketplace" />
              </SelectTrigger>
              <SelectContent>
                {marketplaces.map(market => (
                  <SelectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="mr-1 h-4 w-4" /> CSV
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="mr-1 h-4 w-4" /> Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Orders</DialogTitle>
            <DialogDescription>
              Upload your orders in CSV or TXT format.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                Select File
              </label>
              <div className="flex items-center gap-2">
                <div className="grid w-full items-center gap-1.5">
                  <label
                    htmlFor="file-upload"
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-background px-3 py-2 text-center hover:bg-accent/50"
                  >
                    <FileInput className="mb-2 h-10 w-10 text-muted-foreground" />
                    <div className="text-sm font-medium">
                      {selectedFile ? selectedFile.name : "Choose a file or drag and drop"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      CSV, TXT (max 5MB)
                    </div>
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tabs */}
      <div className="card-neumorph">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="abnormal">Abnormal</TabsTrigger>
            <TabsTrigger value="awaiting">Awaiting Payment</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="ticketed">Ticketed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          {/* All Orders Tab */}
          <TabsContent value="all" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shopperr Order ID</TableHead>
                    <TableHead>Marketplace Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Shipped Date</TableHead>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Return Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allOrders.map((order) => (
                    <TableRow key={order.shopperrOrderId} className="group/row">
                      <TableCell>
                        <Link to={`/orders/${order.shopperrOrderId}`} className="text-primary hover:underline">
                          {order.shopperrOrderId}
                        </Link>
                      </TableCell>
                      <TableCell>{order.marketplaceOrderId}</TableCell>
                      <TableCell>${order.amount.toFixed(2)}</TableCell>
                      <TableCell>{order.marketplace}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[order.status as keyof typeof statusVariants].variant as any}>
                          {statusVariants[order.status as keyof typeof statusVariants].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.paidDate}</TableCell>
                      <TableCell>{order.shippedDate}</TableCell>
                      <TableCell>{order.trackingNumber}</TableCell>
                      <TableCell>{order.returnStatus}</TableCell>
                      <TableCell>
                        <OrderActions orderId={order.shopperrOrderId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Abnormal Orders Tab */}
          <TabsContent value="abnormal" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marketplace Order ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Issue Tag</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abnormalOrders.map((order) => (
                    <TableRow key={order.marketplaceOrderId} className="group/row">
                      <TableCell>{order.marketplaceOrderId}</TableCell>
                      <TableCell>{order.recipient}</TableCell>
                      <TableCell>{order.marketplace}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {order.issueTag}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm">Fix</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Awaiting Payment Tab */}
          <TabsContent value="awaiting" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marketplace Order ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Wallet Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {awaitingPaymentOrders.map((order) => (
                    <TableRow key={order.marketplaceOrderId} className="group/row">
                      <TableCell>{order.marketplaceOrderId}</TableCell>
                      <TableCell>{order.recipient}</TableCell>
                      <TableCell>{order.marketplace}</TableCell>
                      <TableCell>${order.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={order.walletStatus === "OK" ? "secondary" : "destructive"}>
                          {order.walletStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Processing Tab */}
          <TabsContent value="processing" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shopperr Order ID</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processingOrders.map((order) => (
                    <TableRow key={order.shopperrOrderId} className="group/row">
                      <TableCell>
                        <Link to={`/orders/${order.shopperrOrderId}`} className="text-primary hover:underline">
                          {order.shopperrOrderId}
                        </Link>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>{order.recipient}</TableCell>
                      <TableCell>{order.marketplace}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>
                        <OrderActions orderId={order.shopperrOrderId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Shipped Tab */}
          <TabsContent value="shipped" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Shipment Date</TableHead>
                    <TableHead>Delivery ETA</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shippedOrders.map((order) => (
                    <TableRow key={order.orderId} className="group/row">
                      <TableCell>
                        <Link to={`/orders/${order.orderId}`} className="text-primary hover:underline">
                          {order.orderId}
                        </Link>
                      </TableCell>
                      <TableCell>{order.trackingNumber}</TableCell>
                      <TableCell>{order.carrier}</TableCell>
                      <TableCell>{order.shipmentDate}</TableCell>
                      <TableCell>{order.deliveryETA}</TableCell>
                      <TableCell>
                        <OrderActions orderId={order.orderId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Ticketed Tab */}
          <TabsContent value="ticketed" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Issue Summary</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketedOrders.map((order) => (
                    <TableRow key={order.orderId} className="group/row">
                      <TableCell>
                        <Link to={`/orders/${order.orderId}`} className="text-primary hover:underline">
                          {order.orderId}
                        </Link>
                      </TableCell>
                      <TableCell>{order.ticketId}</TableCell>
                      <TableCell>{order.issueSummary}</TableCell>
                      <TableCell>{order.lastUpdated}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "open" ? "outline" : "secondary"}>
                          {order.status === "open" ? "Open" : "In Progress"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <OrderActions orderId={order.orderId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Cancelled Tab */}
          <TabsContent value="cancelled" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Cancellation Reason</TableHead>
                    <TableHead>Cancelled By</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancelledOrders.map((order) => (
                    <TableRow key={order.orderId} className="group/row">
                      <TableCell>
                        <Link to={`/orders/${order.orderId}`} className="text-primary hover:underline">
                          {order.orderId}
                        </Link>
                      </TableCell>
                      <TableCell>{order.cancellationReason}</TableCell>
                      <TableCell>{order.cancelledBy}</TableCell>
                      <TableCell>{order.timestamp}</TableCell>
                      <TableCell>
                        <OrderActions orderId={order.orderId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing 1-{activeTab === "all" ? allOrders.length : 
                       activeTab === "abnormal" ? abnormalOrders.length : 
                       activeTab === "awaiting" ? awaitingPaymentOrders.length :
                       activeTab === "processing" ? processingOrders.length :
                       activeTab === "shipped" ? shippedOrders.length :
                       activeTab === "ticketed" ? ticketedOrders.length :
                       cancelledOrders.length} of {activeTab === "all" ? allOrders.length : 
                       activeTab === "abnormal" ? abnormalOrders.length : 
                       activeTab === "awaiting" ? awaitingPaymentOrders.length :
                       activeTab === "processing" ? processingOrders.length :
                       activeTab === "shipped" ? shippedOrders.length :
                       activeTab === "ticketed" ? ticketedOrders.length :
                       cancelledOrders.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={true} // Would be conditionally disabled based on total pages
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
