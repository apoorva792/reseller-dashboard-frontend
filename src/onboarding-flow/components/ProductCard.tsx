import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { Heart, ExternalLink, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  inWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  inWishlist, 
  onToggleWishlist 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.image_cdn_url);
  const [tryFallback, setTryFallback] = useState(false);

  // Extract ASIN from Amazon product URL
  useEffect(() => {
    if (product.product_url && product.product_url.includes('amazon')) {
      try {
        // Extract ASIN using regex - typically the last segment after /dp/ in Amazon URLs
        const asinMatch = product.product_url.match(/\/dp\/([A-Z0-9]{10})/);
        if (asinMatch && asinMatch[1]) {
          const asin = asinMatch[1];
          // First try this format
          if (!tryFallback) {
            setImageUrl(`https://m.media-amazon.com/images/P/${asin}._AC_SL500_.jpg`);
          } else {
            // If first URL fails, try this alternative format which often works as well
            setImageUrl(`https://images-na.ssl-images-amazon.com/images/I/${asin}.jpg`);
          }
        }
      } catch (error) {
        console.error('Error extracting ASIN:', error);
      }
    }
  }, [product.product_url, tryFallback]);

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    
    // Try the alternative Amazon image format if this is the first error
    if (imageUrl !== product.image_cdn_url && !tryFallback) {
      setTryFallback(true);
    } 
    // If both Amazon image formats fail, fall back to the placeholder
    else if (imageUrl !== product.image_cdn_url && tryFallback) {
      setImageUrl(product.image_cdn_url);
    } 
    // If the placeholder also fails, show error state
    else {
      setImageError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-square bg-gray-100">
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ImageOff className="h-10 w-10 mx-auto text-gray-400" />
              <p className="text-xs text-gray-500 mt-2">Image unavailable</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => onToggleWishlist(product)}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 min-h-[3rem]">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-semibold text-indigo-700">{product.price_formatted}</p>
          <a 
            href={product.product_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-500 flex items-center hover:text-indigo-600"
          >
            <ExternalLink className="h-3 w-3 mr-1" /> View
          </a>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {product.keywords.slice(0, 3).map((keyword, idx) => (
            <Badge key={idx} variant="outline" className="bg-gray-50">
              {keyword}
            </Badge>
          ))}
          {product.keywords.length > 3 && (
            <Badge variant="outline" className="bg-gray-50">
              +{product.keywords.length - 3}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <Button 
          onClick={() => onToggleWishlist(product)}
          variant={inWishlist ? "outline" : "default"}
          size="sm"
          className="w-full"
        >
          {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 