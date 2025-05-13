import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Auth pages
import SignUp from '@/pages/auth/SignUp';
import Login from '@/pages/auth/Login';
import Verify from '@/pages/auth/Verify';
import ResetPassword from '@/pages/auth/ResetPassword';

// Dashboard pages
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import SubscribedProducts from '@/pages/SubscribedProducts';
import MarketplaceAPI from '@/pages/MarketplaceAPI';
import Wallet from '@/pages/Wallet';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

// Onboarding pages
import InterestsPage from '@/onboarding-flow/pages/InterestsPage';
import PriceRangePage from '@/onboarding-flow/pages/PriceRangePage';
import ProductsPage from '@/onboarding-flow/pages/ProductsPage';
import { OnboardingProvider } from '@/onboarding-flow/context/OnboardingContext';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

// Layout wrappers
const AuthLayoutWrapper = () => (
  <AuthLayout>
    <Outlet />
  </AuthLayout>
);

const DashboardLayoutWrapper = () => (
  <ProtectedRoute>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  </ProtectedRoute>
);

// Onboarding routes wrapper (protected but no layout)
const OnboardingWrapper = () => (
  <ProtectedRoute>
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  </ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes - full screen layout */}
      <Route element={<AuthLayoutWrapper />}>
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify" element={<Verify />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Onboarding routes - protected but custom layout */}
      <Route path="/onboarding" element={<OnboardingWrapper />}>
        <Route index element={<Navigate to="/onboarding/interests" />} />
        <Route path="interests" element={<InterestsPage />} />
        <Route path="price-range" element={<PriceRangePage />} />
        <Route path="products" element={<ProductsPage />} />
      </Route>

      {/* Redirect from /dashboard to / */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      {/* Protected dashboard routes */}
      <Route element={<DashboardLayoutWrapper />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/products" element={<SubscribedProducts />} />
        <Route path="/marketplace" element={<MarketplaceAPI />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 