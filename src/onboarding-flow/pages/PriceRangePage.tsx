import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboarding, defaultPriceRanges } from '../context/OnboardingContext';
import OnboardingLayout from '../layouts/OnboardingLayout';
import PriceRangeCard from '../components/PriceRangeCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, LightbulbIcon } from 'lucide-react';

const PriceRangePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, togglePriceRange } = useOnboarding();
  const { selectedCategory, selectedPriceRanges } = state;

  const handleNextClick = () => {
    if (selectedPriceRanges.length > 0) {
      navigate('/onboarding/products');
    }
  };

  const handleBackClick = () => {
    navigate('/onboarding/interests');
  };

  useEffect(() => {
    // If no category is selected, go back to interests page
    if (!selectedCategory) {
      navigate('/onboarding/interests');
    }
    
    // If the user has already completed onboarding, redirect to dashboard
    if (state.onboardingCompleted) {
      navigate('/');
    }
  }, [selectedCategory, state.onboardingCompleted, navigate]);

  const isMaxSelectionReached = selectedPriceRanges.length >= 4;

  return (
    <OnboardingLayout step={2} totalSteps={3} title="Subscribe to Products">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          What price ranges fit your subscription for {selectedCategory}?
        </h1>
        <p className="text-gray-600 mb-6">
          Select up to 4 price ranges for your product subscription.
        </p>

        <motion.div 
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LightbulbIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Smart Tip</p>
            <p className="text-sm text-amber-700">
              ₹1K–₹5K price bands convert 2× faster for new resellers
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {defaultPriceRanges.map((range) => {
            const isSelected = selectedPriceRanges.some(
              r => r.min === range.min && r.max === range.max
            );
            
            return (
              <PriceRangeCard
                key={range.label}
                priceRange={range}
                selected={isSelected}
                onClick={() => togglePriceRange(range)}
                disabled={isMaxSelectionReached && !isSelected}
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <Button
            onClick={handleNextClick}
            disabled={selectedPriceRanges.length === 0}
            className="flex items-center gap-2 px-6"
            size="lg"
          >
            Find Products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default PriceRangePage; 