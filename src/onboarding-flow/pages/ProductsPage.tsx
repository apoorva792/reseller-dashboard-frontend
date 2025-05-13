import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboarding } from '../context/OnboardingContext';
import OnboardingLayout from '../layouts/OnboardingLayout';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Download, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Product } from '../types';

// Import product data
import productData from '../data/enriched_product_listings.json';
import keywordsByCategory from '../data/reseller_keywords_by_category.json';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, toggleProductSelection, completeOnboarding, exportSelectedProducts } = useOnboarding();
  const { selectedCategory, selectedPriceRanges } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSimilarKeywords, setShowSimilarKeywords] = useState(false);
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter products based on category and price ranges
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];

    // Type assertion to access product data
    const products = productData as unknown as Product[];
    
    let filtered = products.filter(product => {
      // Match category
      const categoryMatch = product.category === selectedCategory;
      
      // Match price range (if any are selected)
      const priceMatch = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
        return product.price >= range.min && product.price <= range.max;
      });
      
      // Match search term if provided
      const searchMatch = !searchTerm || 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Match active keyword filters if any are selected
      const keywordMatch = activeKeywords.length === 0 || 
        activeKeywords.some(keyword => 
          product.keywords.some(prodKeyword => prodKeyword.toLowerCase().includes(keyword.toLowerCase()))
        );
      
      return categoryMatch && priceMatch && searchMatch && keywordMatch;
    });
    
    return filtered;
  }, [selectedCategory, selectedPriceRanges, searchTerm, activeKeywords]);

  // If no exact matches, show fallback products from same category
  const fallbackProducts = useMemo(() => {
    if (filteredProducts.length > 0) return [];
    
    // Type assertion to access product data
    const products = productData as unknown as Product[];
    
    return products
      .filter(product => product.category === selectedCategory)
      .slice(0, 3);
  }, [filteredProducts, selectedCategory]);

  // Get relevant keywords for the selected category
  const relevantKeywords = useMemo(() => {
    if (!selectedCategory || !showSimilarKeywords) return [];
    
    // Type assertion for keywords data
    const keywordsData = keywordsByCategory as Record<string, string[]>;
    return keywordsData[selectedCategory] || [];
  }, [selectedCategory, showSimilarKeywords]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const productsToShow = filteredProducts.length > 0 ? filteredProducts : fallbackProducts;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return productsToShow.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, fallbackProducts, currentPage]);

  const totalPages = Math.ceil((filteredProducts.length || fallbackProducts.length) / itemsPerPage);

  const handleBackClick = () => {
    navigate('/onboarding/price-range');
  };

  const handleFinishClick = () => {
    completeOnboarding();
    navigate('/');
  };

  const handleToggleKeyword = (keyword: string) => {
    setActiveKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveKeywords([]);
  };

  useEffect(() => {
    // If no category or price ranges are selected, go back
    if (!selectedCategory) {
      navigate('/onboarding/interests');
    } else if (selectedPriceRanges.length === 0) {
      navigate('/onboarding/price-range');
    }
    
    // If the user has already completed onboarding, redirect to dashboard
    if (state.onboardingCompleted) {
      navigate('/');
    }
  }, [selectedCategory, selectedPriceRanges, state.onboardingCompleted, navigate]);

  return (
    <OnboardingLayout step={3} totalSteps={3} title="Subscribe to Products">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Discover {selectedCategory} Products
            </h1>
            <p className="text-gray-600">
              Browse and save products for your subscription.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={exportSelectedProducts}
              variant="outline"
              className="flex items-center gap-2"
              disabled={state.selectedProducts.length === 0}
            >
              <Download className="h-4 w-4" /> Export {state.selectedProducts.length} Products
            </Button>
            
            <Button onClick={handleFinishClick} size="lg">
              Complete Subscription
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Left sidebar with filters */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-medium text-lg mb-4">Filters</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-keywords">Show Similar Keywords</Label>
                  <Switch 
                    id="show-keywords" 
                    checked={showSimilarKeywords}
                    onCheckedChange={setShowSimilarKeywords}
                  />
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Price Ranges</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPriceRanges.map(range => (
                      <Badge key={range.label} variant="secondary">
                        {range.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {activeKeywords.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Active Filters</p>
                      <button 
                        onClick={clearFilters}
                        className="text-xs text-indigo-600 hover:underline flex items-center"
                      >
                        Clear all <X className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeKeywords.map(keyword => (
                        <Badge 
                          key={keyword} 
                          variant="default"
                          className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer"
                          onClick={() => handleToggleKeyword(keyword)}
                        >
                          {keyword} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-medium mb-3">Selected: {state.selectedProducts.length}</h3>
              <p className="text-sm text-gray-500">
                Add at least 5 products to your wishlist to get better recommendations.
              </p>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product name or keyword..."
                  className="pl-10"
                />
              </div>
              
              {showSimilarKeywords && relevantKeywords.length > 0 && (
                <div className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {relevantKeywords.slice(0, 10).map(keyword => (
                      <Badge 
                        key={keyword} 
                        variant={activeKeywords.includes(keyword) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          activeKeywords.includes(keyword) 
                            ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleToggleKeyword(keyword)}
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* No results message */}
            {filteredProducts.length === 0 && fallbackProducts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800">
                  No products matched all your filters, but here are similar items from {selectedCategory}
                </p>
              </div>
            )}
            
            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.product_url}
                  product={product}
                  inWishlist={state.selectedProducts.some(p => p.product_url === product.product_url)}
                  onToggleWishlist={toggleProductSelection}
                />
              ))}
            </div>
            
            {/* Empty state */}
            {paginatedProducts.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8 border-t border-gray-200 pt-6">
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <Button
            onClick={handleFinishClick}
            size="lg"
            className="px-6"
          >
            Complete Subscription
          </Button>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default ProductsPage; 