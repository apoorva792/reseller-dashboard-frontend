export type Category = 
  | 'Sports'
  | 'Home Decor'
  | 'Clothes'
  | 'Jewellery'
  | 'Outdoor Activities'
  | 'Toys'
  | 'Pet Care'
  | 'Kitchen';

export type PriceRange = {
  min: number;
  max: number;
  label: string;
};

export type Product = {
  title: string;
  category: string;
  price: number;
  price_formatted: string;
  keywords: string[];
  image_cdn_url: string;
  product_url: string;
  inWishlist?: boolean;
};

export type OnboardingState = {
  selectedCategory: Category | null;
  selectedPriceRanges: PriceRange[];
  selectedProducts: Product[];
  onboardingCompleted: boolean;
  isNewUser: boolean;
}; 