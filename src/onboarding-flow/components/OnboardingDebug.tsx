import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';

const OnboardingDebug: React.FC = () => {
  try {
    const onboarding = useOnboarding();
    
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-xs text-xs z-50 overflow-auto max-h-60">
        <h4 className="font-bold mb-2">Onboarding Debug</h4>
        <ul>
          <li>Category: {onboarding.state.selectedCategory || 'None'}</li>
          <li>Price Ranges: {onboarding.state.selectedPriceRanges.length}</li>
          <li>Selected Products: {onboarding.state.selectedProducts.length}</li>
          <li>Completed: {onboarding.state.onboardingCompleted ? 'Yes' : 'No'}</li>
          <li>New User: {onboarding.state.isNewUser ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error in OnboardingDebug:', error);
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-red-800 text-white rounded-lg max-w-xs text-xs z-50">
        <h4 className="font-bold mb-2">Onboarding Context Error</h4>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
};

export default OnboardingDebug; 