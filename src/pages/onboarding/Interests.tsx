
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Import necessary icons
import { 
  Package, 
  Home,
  ShoppingCart,
  CircleDollarSign,
  Tent,
  Gamepad2,
  Cat
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 'sports', name: 'Sports', icon: <Package size={32} /> },
  { id: 'home-decor', name: 'Home Decor', icon: <Home size={32} /> },
  { id: 'clothes', name: 'Clothes', icon: <ShoppingCart size={32} /> },
  { id: 'jewellery', name: 'Jewellery', icon: <CircleDollarSign size={32} /> },
  { id: 'outdoor', name: 'Outdoor Activities', icon: <Tent size={32} /> },
  { id: 'toys', name: 'Toys', icon: <Gamepad2 size={32} /> },
  { id: 'pet-care', name: 'Pet Care', icon: <Cat size={32} /> },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Interests = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const userName = "John"; // This would come from auth context in a real app
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleSubmit = () => {
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }
    
    console.log("Selected categories:", selectedCategories);
    toast.success("Preferences saved successfully!");
    
    // Animate before navigation
    setTimeout(() => {
      navigate("/");
    }, 600);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Hey {userName}, what are some categories you're most interested in selling?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/70"
          >
            This helps us personalize your dashboard and recommendations
          </motion.p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div key={category.id} variants={item} custom={index}>
              <Card 
                className={`p-6 cursor-pointer hover-card flex flex-col items-center justify-center aspect-square transition-all ${
                  selectedCategories.includes(category.id) 
                    ? 'bg-accent text-accent-foreground border-2 border-accent shadow-lg transform scale-105' 
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                <motion.div 
                  animate={{ 
                    scale: selectedCategories.includes(category.id) ? [1, 1.2, 1] : 1,
                    rotate: selectedCategories.includes(category.id) ? [0, 5, 0, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                  className={`mb-3 ${selectedCategories.includes(category.id) ? 'text-accent-foreground' : 'text-white'}`}
                >
                  {category.icon}
                </motion.div>
                <h3 className="font-medium text-lg text-center">{category.name}</h3>
                
                {/* Selection indicator */}
                {selectedCategories.includes(category.id) && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 bg-accent-foreground rounded-full"
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            className="text-lg py-6 px-8 bg-accent hover:bg-accent/90 text-accent-foreground relative overflow-hidden group"
          >
            <span className="relative z-10">Let's Begin</span>
            <span className="absolute inset-0 bg-accent-foreground opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Interests;
