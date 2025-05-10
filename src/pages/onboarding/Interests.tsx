
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

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
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-500 to-navy-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Hey {userName}, what are some categories you're most interested in selling?
          </h1>
          <p className="text-lg text-white/70">
            This helps us personalize your dashboard and recommendations
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`p-6 cursor-pointer hover-card flex flex-col items-center justify-center aspect-square transition-all ${
                selectedCategories.includes(category.id) 
                  ? 'bg-accent text-accent-foreground border-2 border-accent' 
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              <div className={`mb-3 ${selectedCategories.includes(category.id) ? 'text-accent-foreground' : 'text-white'}`}>
                {category.icon}
              </div>
              <h3 className="font-medium text-lg">{category.name}</h3>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            className="text-lg py-6 px-8 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Let's Begin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Interests;
