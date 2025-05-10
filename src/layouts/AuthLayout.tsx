
import React from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-md bg-gold flex items-center justify-center text-navy font-bold">
            S
          </div>
          <span className="font-bold text-2xl">Shopperr</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
