
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import SubscribedProducts from "@/pages/SubscribedProducts";
import MarketplaceAPI from "@/pages/MarketplaceAPI";
import EWallet from "@/pages/EWallet";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/orders" element={
            <DashboardLayout>
              <Orders />
            </DashboardLayout>
          } />
          <Route path="/products" element={
            <DashboardLayout>
              <SubscribedProducts />
            </DashboardLayout>
          } />
          <Route path="/marketplace" element={
            <DashboardLayout>
              <MarketplaceAPI />
            </DashboardLayout>
          } />
          <Route path="/wallet" element={
            <DashboardLayout>
              <EWallet />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
