
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, MessageSquare } from 'lucide-react';

// Sample order details - in a real app, this would come from an API
const orderData = {
  id: "SP-12345",
  status: "shipped",
  trackingNumber: "1Z999AA10123456784",
  shippingMethod: "Standard Delivery",
  subtotal: 124.99,
  shippingFee: 12.00,
  total: 136.99,
  timeline: [
    { stage: "ordered", date: "Apr 15, 2023", completed: true },
    { stage: "paid", date: "Apr 15, 2023", completed: true },
    { stage: "shipped", date: "Apr 17, 2023", completed: true },
    { stage: "delivered", date: "Apr 20, 2023", completed: false }
  ],
  recipient: {
    name: "Jane Smith",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Apt 4B, New York, NY 10001, USA"
  },
  items: [
    {
      id: 1,
      image: "/placeholder.svg",
      name: "Premium Wireless Earbuds",
      price: 59.99,
      quantity: 1,
      amount: 59.99
    },
    {
      id: 2,
      image: "/placeholder.svg",
      name: "Smart Fitness Tracker",
      price: 65.00,
      quantity: 1,
      amount: 65.00
    }
  ]
};

// Status badge variant mapping
const statusVariants: Record<string, { variant: "default" | "outline" | "secondary" | "destructive", label: string }> = {
  pending: { variant: "outline", label: "Pending" },
  paid: { variant: "secondary", label: "Paid" },
  shipped: { variant: "default", label: "Shipped" },
  delivered: { variant: "default", label: "Delivered" },
  cancelled: { variant: "destructive", label: "Cancelled" }
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  // In a real app, we'd fetch the order data based on the orderId
  // For now, we'll just check if the orderId matches our sample data
  const isValidOrder = orderId === "SP-12345";
  
  // If invalid order ID, show error state
  if (!isValidOrder) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link to="/orders">
            <Button variant="outline" size="sm" className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </Link>
        </div>
        
        <Card className="card-neumorph">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The order ID "{orderId}" doesn't exist or you don't have permission to view it.
            </p>
            <Link to="/orders">
              <Button>View All Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link to="/orders">
          <Button variant="outline" size="sm" className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Order {orderData.id}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Summary Panel */}
        <div className="lg:col-span-1">
          <Card className="card-neumorph h-full">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Shipping */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusVariants[orderData.status].variant}>
                    {statusVariants[orderData.status].label}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping Method</span>
                  <span className="font-medium">{orderData.shippingMethod}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tracking Number</span>
                  <span className="font-medium">{orderData.trackingNumber}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span className="font-medium">${orderData.shippingFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${orderData.total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <MessageSquare className="mr-2 h-4 w-4" /> Open a Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <Card className="card-neumorph-sm">
            <CardContent className="pt-6">
              <div className="relative">
                {/* Timeline track */}
                <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -translate-y-1/2" />
                
                {/* Timeline nodes */}
                <div className="flex justify-between relative">
                  {orderData.timeline.map((step, index) => (
                    <div key={step.stage} className="flex flex-col items-center relative z-10">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        step.completed ? 'bg-primary border-primary' : 'bg-white border-muted'
                      } mb-2`} />
                      <div className="text-sm font-medium">{step.stage.charAt(0).toUpperCase() + step.stage.slice(1)}</div>
                      <div className="text-xs text-muted-foreground">{step.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Information */}
          <Card className="card-neumorph-sm">
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">Order ID</h3>
                <p className="text-muted-foreground">{orderData.id}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Recipient</h3>
                <p className="text-muted-foreground">{orderData.recipient.name}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Phone Number</h3>
                <p className="text-muted-foreground">{orderData.recipient.phone}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Shipping Address</h3>
                <p className="text-muted-foreground">{orderData.recipient.address}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Products Table */}
          <Card className="card-neumorph-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-12 w-12 rounded object-cover"
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${item.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
