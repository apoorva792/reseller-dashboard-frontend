
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart2, 
  Box, 
  CreditCard, 
  Home, 
  Package, 
  Settings, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  title: string;
  isCollapsed: boolean;
  isActive: boolean;
};

const NavItem = ({ to, icon: Icon, title, isCollapsed, isActive }: NavItemProps) => (
  <Link 
    to={to} 
    className={cn(
      'sidebar-item',
      isActive && 'active'
    )}
  >
    <Icon size={20} />
    {!isCollapsed && <span>{title}</span>}
  </Link>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { to: '/', icon: Home, title: 'Dashboard' },
    { to: '/orders', icon: ShoppingCart, title: 'Orders' },
    { to: '/products', icon: Package, title: 'Products' },
    { to: '/marketplace', icon: Box, title: 'Marketplace' },
    { to: '/wallet', icon: CreditCard, title: 'E-Wallet' },
    { to: '/settings', icon: Settings, title: 'Settings' },
  ];

  return (
    <aside className={cn(
      'bg-navy min-h-screen flex-shrink-0 flex flex-col transition-all duration-300',
      collapsed ? 'w-[72px]' : 'w-[240px]'
    )}>
      <div className="p-4 flex items-center justify-between">
        <div className={cn(
          "flex items-center gap-2 text-white",
          collapsed && "hidden"
        )}>
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center text-navy font-bold">
            S
          </div>
          <span className="font-bold text-xl">Shopperr</span>
        </div>
        <button
          onClick={toggleCollapse}
          className="text-white rounded-md p-1 hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-grow mt-4 px-2 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.title}
            to={item.to}
            icon={item.icon}
            title={item.title}
            isCollapsed={collapsed}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
      
      <div className={cn(
        'p-3 m-2 mt-auto rounded-lg bg-sidebar-accent flex items-center gap-3 text-white',
        collapsed && 'justify-center'
      )}>
        <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center font-medium text-white">
          JD
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs opacity-70">Premium Reseller</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
