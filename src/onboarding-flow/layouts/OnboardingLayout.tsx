import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  title?: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ 
  children, 
  step, 
  totalSteps,
  title = "Subscribe" 
}) => {
  const { user, isLoading } = useAuth();
  const progressPercentage = (step / totalSteps) * 100;
  
  // If not loading and no user, redirect to login
  if (!isLoading && !user) {
    return <Navigate to="/auth/login" />;
  }
  
  // Show a loading indicator while checking auth
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">{title}</h2>
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500 text-right">
            Step {step} of {totalSteps}
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default OnboardingLayout; 