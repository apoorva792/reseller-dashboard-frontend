
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import SubscribedProducts from "@/pages/SubscribedProducts";
import MarketplaceAPI from "@/pages/MarketplaceAPI";
import EWallet from "@/pages/EWallet";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Auth pages
import SignUp from "@/pages/auth/SignUp";
import Login from "@/pages/auth/Login";
import Verify from "@/pages/auth/Verify";
import ResetPassword from "@/pages/auth/ResetPassword";

// Onboarding pages
import Interests from "@/pages/onboarding/Interests";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Auth routes - full screen layout */}
          <Route path="/auth/signup" element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          } />
          <Route path="/auth/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          <Route path="/auth/verify" element={
            <AuthLayout>
              <Verify />
            </AuthLayout>
          } />
          <Route path="/auth/reset-password" element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          } />
          
          {/* Onboarding route - full screen */}
          <Route path="/onboarding/interests" element={<Interests />} />
          
          {/* Dashboard routes with sidebar layout */}
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
          <Route path="/orders/:orderId" element={
            <DashboardLayout>
              <OrderDetails />
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
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
