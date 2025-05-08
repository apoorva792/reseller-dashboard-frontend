
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Topbar />
        <div className={cn(
          "flex-1 p-6 overflow-auto",
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
