import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, PriceRange, Product, OnboardingState } from '../types';

type OnboardingContextType = {
  state: OnboardingState;
  setSelectedCategory: (category: Category) => void;
  togglePriceRange: (priceRange: PriceRange) => void;
  toggleProductSelection: (product: Product) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  exportSelectedProducts: () => void;
};

const defaultPriceRanges: PriceRange[] = [
  { min: 100, max: 999, label: '₹100–₹999' },
  { min: 1000, max: 1999, label: '₹1,000–₹1,999' },
  { min: 2000, max: 4999, label: '₹2,000–₹4,999' },
  { min: 5000, max: 9999, label: '₹5,000–₹9,999' },
  { min: 10000, max: 30000, label: '₹10,000–₹30,000' },
];

const initialState: OnboardingState = {
  selectedCategory: null,
  selectedPriceRanges: [],
  selectedProducts: [],
  onboardingCompleted: false,
  isNewUser: true,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem('onboarding_state');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('onboarding_state', JSON.stringify(state));
  }, [state]);

  const setSelectedCategory = (category: Category) => {
    setState(prev => ({
      ...prev,
      selectedCategory: category
    }));
  };

  const togglePriceRange = (priceRange: PriceRange) => {
    setState(prev => {
      const isSelected = prev.selectedPriceRanges.some(
        range => range.min === priceRange.min && range.max === priceRange.max
      );

      let newRanges: PriceRange[];
      if (isSelected) {
        newRanges = prev.selectedPriceRanges.filter(
          range => !(range.min === priceRange.min && range.max === priceRange.max)
        );
      } else {
        // Check if adding would exceed 4 selections
        if (prev.selectedPriceRanges.length >= 4) {
          return prev;
        }
        newRanges = [...prev.selectedPriceRanges, priceRange];
      }

      return {
        ...prev,
        selectedPriceRanges: newRanges
      };
    });
  };

  const toggleProductSelection = (product: Product) => {
    setState(prev => {
      const isSelected = prev.selectedProducts.some(p => p.product_url === product.product_url);
      
      if (isSelected) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter(p => p.product_url !== product.product_url)
        };
      } else {
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, {...product, inWishlist: true}]
        };
      }
    });
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      onboardingCompleted: true
    }));
  };

  const resetOnboarding = () => {
    setState(initialState);
  };

  const exportSelectedProducts = () => {
    const selectedProducts = state.selectedProducts;
    if (!selectedProducts.length) return;

    const csvData = [
      ['Title', 'Price', 'Keywords', 'Product URL', 'Image URL'].join(','),
      ...selectedProducts.map(product => [
        `"${product.title.replace(/"/g, '""')}"`,
        product.price_formatted,
        `"${product.keywords.join(', ').replace(/"/g, '""')}"`,
        `"${product.product_url}"`,
        `"${product.image_cdn_url}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `selected-products-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const value = {
    state,
    setSelectedCategory,
    togglePriceRange,
    toggleProductSelection,
    completeOnboarding,
    resetOnboarding,
    exportSelectedProducts
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export { defaultPriceRanges }; 