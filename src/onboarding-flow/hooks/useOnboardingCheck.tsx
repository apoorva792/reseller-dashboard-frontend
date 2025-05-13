import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

/**
 * Hook to check if the user needs to go through the onboarding flow
 * Will redirect to onboarding if the user is new or hasn't completed onboarding
 */
export const useOnboardingCheck = () => {
  console.log('useOnboardingCheck running');
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('useOnboardingCheck effect running, user:', user);
    
    if (!user) {
      console.log('No user found, skipping onboarding check');
      setIsChecking(false);
      return;
    }

    // If the user is already on an onboarding page, don't redirect
    if (location.pathname.startsWith('/onboarding')) {
      console.log('Already on onboarding page, skipping redirect');
      setIsChecking(false);
      return;
    }

    try {
      // Check localStorage to see if the user has completed onboarding
      const onboardingState = localStorage.getItem('onboarding_state');
      console.log('Onboarding state from localStorage:', onboardingState);
      
      if (onboardingState) {
        const state = JSON.parse(onboardingState);
        
        // If user hasn't completed onboarding, redirect to the first step
        if (!state.onboardingCompleted) {
          console.log('Onboarding not completed, redirecting to interests page');
          navigate('/onboarding/interests');
        } else {
          console.log('Onboarding already completed');
        }
      } else {
        // No onboarding state found, user is new, redirect to onboarding
        console.log('No onboarding state found, redirecting to interests page');
        navigate('/onboarding/interests');
      }
    } catch (error) {
      console.error('Error in useOnboardingCheck:', error);
    } finally {
      setIsChecking(false);
    }
  }, [user, navigate, location.pathname]);

  return isChecking;
}; 