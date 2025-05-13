import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';

// Icons
import { ShoppingBag, Home, Shirt, Gem, Map, Truck, Cat, UtensilsCrossed } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  selected: boolean;
  onClick: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, selected, onClick }) => {
  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Sports':
        return <ShoppingBag className="h-8 w-8" />;
      case 'Home Decor':
        return <Home className="h-8 w-8" />;
      case 'Clothes':
        return <Shirt className="h-8 w-8" />;
      case 'Jewellery':
        return <Gem className="h-8 w-8" />;
      case 'Outdoor Activities':
        return <Map className="h-8 w-8" />;
      case 'Toys':
        return <Truck className="h-8 w-8" />;
      case 'Pet Care':
        return <Cat className="h-8 w-8" />;
      case 'Kitchen':
        return <UtensilsCrossed className="h-8 w-8" />;
      default:
        return <ShoppingBag className="h-8 w-8" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(category)}
      className={`
        relative p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4
        ${selected 
          ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md' 
          : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'}
      `}
    >
      <div className={`p-3 rounded-full ${selected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
        {getCategoryIcon(category)}
      </div>
      <h3 className={`text-lg font-medium ${selected ? 'text-indigo-700' : 'text-gray-800'}`}>
        {category}
      </h3>
      
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryCard;
