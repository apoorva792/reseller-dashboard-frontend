import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Category } from '../types';
import { useOnboarding } from '../context/OnboardingContext';
import OnboardingLayout from '../layouts/OnboardingLayout';
import CategoryCard from '../components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const categories: Category[] = [
  'Sports',
  'Home Decor',
  'Clothes',
  'Jewellery',
  'Outdoor Activities',
  'Toys',
  'Pet Care',
  'Kitchen'
];

const InterestsPage: React.FC = () => {
  console.log('InterestsPage rendering');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  try {
    const { state, setSelectedCategory } = useOnboarding();
    console.log('useOnboarding successful, state:', state);
    
    const userName = user?.customer_firstname || 'Reseller';

    const handleSelectCategory = (category: Category) => {
      setSelectedCategory(category);
    };

    const handleNextClick = () => {
      if (state.selectedCategory) {
        navigate('/onboarding/price-range');
      }
    };

    useEffect(() => {
      // If the user has already completed onboarding, redirect to dashboard
      if (state.onboardingCompleted) {
        navigate('/');
      }
    }, [state.onboardingCompleted, navigate]);

    return (
      <OnboardingLayout step={1} totalSteps={3} title="Subscribe to Products">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            What category are you most interested in selling, {userName}?
          </h1>
          <p className="text-gray-600 mb-8">
            Select a product category you're most interested in subscribing to for your store.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              <CategoryCard
                key={category}
                category={category}
                selected={state.selectedCategory === category}
                onClick={handleSelectCategory}
              />
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={handleNextClick}
              disabled={!state.selectedCategory}
              className="flex items-center gap-2 px-6"
              size="lg"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </OnboardingLayout>
    );
  } catch (error) {
    console.error('Error in InterestsPage:', error);
    return <div>Error loading page. See console for details.</div>;
  }
};

export default InterestsPage; 