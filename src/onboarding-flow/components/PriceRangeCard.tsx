import React from 'react';
import { motion } from 'framer-motion';
import { PriceRange } from '../types';
import { Check } from 'lucide-react';

interface PriceRangeCardProps {
  priceRange: PriceRange;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const PriceRangeCard: React.FC<PriceRangeCardProps> = ({ 
  priceRange, 
  selected, 
  onClick,
  disabled
}) => {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={disabled ? undefined : onClick}
      className={`
        relative p-5 rounded-xl cursor-pointer transition-all duration-300
        ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : ''}
        ${selected 
          ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md' 
          : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-medium ${selected ? 'text-indigo-700' : 'text-gray-800'}`}>
            {priceRange.label}
          </h3>
        </div>
        
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-500 text-white rounded-full p-1"
          >
            <Check className="h-4 w-4" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PriceRangeCard;
