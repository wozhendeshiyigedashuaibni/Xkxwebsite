import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface CollectionsPageProps {
  onNavigate: (page: string, options?: { category?: string; anchor?: string; productId?: string }) => void;
  category?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  colors: { name: string; hex: string }[];
  moq: string;
  image: string;
  featured?: boolean;
}

interface CategoryBanner {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
}

interface CategoryItem {
  name: string;
  subcategories?: string[];
}

export function CollectionsPage({ onNavigate, category }: CollectionsPageProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Dresses']);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
      setSelectedSubcategory('');
    }
  }, [category]);

  // Category structure with subcategories
  const categoryStructure: CategoryItem[] = [
    { name: 'All' },
    { 
      name: 'Dresses',
      subcategories: ['Evening Dresses', 'Work Dresses', 'Casual Dresses']
    },
    { 
      name: 'Women Sets',
      subcategories: ['Formal Sets', 'Casual Sets', 'Lounge Sets']
    },
    { 
      name: 'Skirts',
      subcategories: ['Mini Skirts', 'Midi Skirts', 'Maxi Skirts']
    },
    { 
      name: 'Hoodies',
      subcategories: ['Oversized Hoodies', 'Cropped Hoodies', 'Zip Hoodies']
    },
    { 
      name: 'T-Shirts',
      subcategories: ['Basic Tees', 'Graphic Tees', 'Tank Tops']
    },
    { 
      name: 'Denim & Bottoms',
      subcategories: ['Jeans', 'Pants', 'Shorts']
    },
  ];

  const toggleCategory = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryName));
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  const handleCategoryHover = (categoryName: string) => {
    const categoryItem = categoryStructure.find(c => c.name === categoryName);
    if (categoryItem?.subcategories && !expandedCategories.includes(categoryName)) {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  const handleCategoryLeave = (categoryName: string) => {
    // Only collapse if this category is not selected
    // This now handles the entire menu item including subcategories
    if (selectedCategory !== categoryName && !selectedSubcategory) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryName));
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory('');
    if (categoryName !== 'All' && categoryStructure.find(c => c.name === categoryName)?.subcategories) {
      if (!expandedCategories.includes(categoryName)) {
        setExpandedCategories([...expandedCategories, categoryName]);
      }
    }
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  };

  // Category-specific banners
  const categoryBanners: Record<string, CategoryBanner> = {
    'All': {
      title: 'Complete Collection',
      subtitle: 'Your Manufacturing Partner',
      description: 'Explore our full range of women\'s apparel manufacturing capabilities. From casual wear to formal attire, we bring your designs to life.',
      images: [
        'https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZWxlZ2FudCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VpdCUyMGJsYXplciUyMHdvbWVufGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    'Dresses': {
      title: 'Dress Collection',
      subtitle: 'Elegant & Versatile',
      description: 'From casual day dresses to elegant evening wear. Premium fabrics, perfect fits, and attention to detail in every piece.',
      images: [
        'https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZWxlZ2FudCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwY2FzdWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZm9ybWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwa25pdHxlbnwxfHx8fDE3NzAxMDE4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    'Women Sets': {
      title: 'Coordinated Sets',
      subtitle: 'Professional & Casual',
      description: 'Two-piece and multi-piece sets that offer versatility and style. Perfect for brands looking for cohesive collections.',
      images: [
        'https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VpdCUyMGJsYXplciUyMHdvbWVufGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvb3JkJTIwc2V0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxvdW5nZXdlYXJ8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNob3J0cyUyMHnoaXJ0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    'Skirts': {
      title: 'Skirt Collection',
      subtitle: 'Classic to Contemporary',
      description: 'Mini, midi, and maxi skirts in various styles. Quality construction and flattering silhouettes for every occasion.',
      images: [
        'https://images.unsplash.com/photo-1592423777039-7be9f340582b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwb3V0Zml0fGVufDF8fHx8MTc3MDEwMTg3NXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwbWlkaXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBlbmNpbCUyMHNraXJ0fGVufDF8fHx8MTc3MDEwMTg3NXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMG1heGklMjBza2lydHxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    'Hoodies': {
      title: 'Hoodie Collection',
      subtitle: 'Streetwear Essential',
      description: 'Premium hoodies with heavyweight fabrics and superior construction. Perfect for streetwear and athleisure brands.',
      images: [
        'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNyb3BwZWQlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHppcCUyMGhvb2RpZXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    'T-Shirts': {
      title: 'T-Shirt Collection',
      subtitle: 'Versatile Basics',
      description: 'Essential tees and tanks in premium fabrics. From basic solids to custom graphics, we manufacture it all.',
      images: [
        'https://images.unsplash.com/photo-1511550521256-8526928a8af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjB0c2hpcnR8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRhbmslMjB0b3B8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxvbmclMjBzbGVldmUlMjB0c2hpcnR8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    'Denim & Bottoms': {
      title: 'Denim & Bottoms',
      subtitle: 'Quality Construction',
      description: 'Jeans, pants, and bottoms with premium denim and fabric options. Expert pattern making and perfect fits.',
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHdpZGUlMjBsZWclMjBwYW50c3xlbnwxfHx8fDE3NzAxMDE5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1624623278313-a930126a11c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNhcmdvJTIwcGFudHN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN0cmFpZ2h0JTIwamVhbnN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
  };

  const currentBanner = categoryBanners[selectedCategory] || categoryBanners['All'];

  const availableColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Blue', hex: '#0000FF' },
  ];

  const moqOptions = ['50 pcs/style', '100 pcs/style', '200 pcs/style'];

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedMOQ('');
  };

  const products: Product[] = [
    // Dresses
    {
      id: 'dress-1',
      name: 'Slip Dress',
      category: 'Dresses',
      subcategory: 'Casual Dresses',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Champagne', hex: '#F7E7CE' },
        { name: 'Navy', hex: '#000080' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZWxlZ2FudCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true,
    },
    {
      id: 'dress-2',
      name: 'Shirt Dress',
      category: 'Dresses',
      subcategory: 'Work Dresses',
      colors: [
        { name: 'Blue', hex: '#0000FF' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Black', hex: '#000000' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwY2FzdWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'dress-3',
      name: 'Maxi Dress',
      category: 'Dresses',
      subcategory: 'Casual Dresses',
      colors: [
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Black', hex: '#000000' },
        { name: 'Emerald', hex: '#50C878' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZm9ybWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'dress-4',
      name: 'Bodycon Dress',
      category: 'Dresses',
      subcategory: 'Evening Dresses',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Nude', hex: '#F2F2F2' },
        { name: 'Red', hex: '#FF0000' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwa25pdHxlbnwxfHx8fDE3NzAxMDE4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    // Women Sets
    {
      id: 'set-1',
      name: 'Blazer & Trouser Set',
      category: 'Women Sets',
      subcategory: 'Formal Sets',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Camel', hex: '#C19A6B' },
        { name: 'Grey', hex: '#808080' },
        { name: 'White', hex: '#FFFFFF' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VpdCUyMGJsYXplciUyMHdvbWVufGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true,
    },
    {
      id: 'set-2',
      name: 'Crop Top & Skirt',
      category: 'Women Sets',
      subcategory: 'Casual Sets',
      colors: [
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Mint', hex: '#98FF98' },
        { name: 'Lavender', hex: '#E6E6FA' },
        { name: 'Peach', hex: '#FFDAB9' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvb3JkJTIwc2V0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'set-3',
      name: 'Loungewear Set',
      category: 'Women Sets',
      subcategory: 'Lounge Sets',
      colors: [
        { name: 'Grey', hex: '#808080' },
        { name: 'Black', hex: '#000000' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Navy', hex: '#000080' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxvdW5nZXdlYXJ8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'set-4',
      name: 'Shirt & Shorts Set',
      category: 'Women Sets',
      subcategory: 'Casual Sets',
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Striped', hex: '#FF0000' },
        { name: 'Beige', hex: '#F5F5DC' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNob3J0cyUyMHnoaXJ0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    // Skirts
    {
      id: 'skirt-1',
      name: 'Pleated Mini Skirt',
      category: 'Skirts',
      subcategory: 'Mini Skirts',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Plaid', hex: '#FF0000' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1592423777039-7be9f340582b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwb3V0Zml0fGVufDF8fHx8MTc3MDEwMTg3NXww&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true,
    },
    {
      id: 'skirt-2',
      name: 'A-line Midi Skirt',
      category: 'Skirts',
      subcategory: 'Midi Skirts',
      colors: [
        { name: 'Camel', hex: '#C19A6B' },
        { name: 'Black', hex: '#000000' },
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Grey', hex: '#808080' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwbWlkaXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'skirt-3',
      name: 'Pencil Skirt',
      category: 'Skirts',
      subcategory: 'Midi Skirts',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Grey', hex: '#808080' },
        { name: 'White', hex: '#FFFFFF' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBlbmNpbCUyMHNraXJ0fGVufDF8fHx8MTc3MDEwMTg3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'skirt-4',
      name: 'Maxi Skirt',
      category: 'Skirts',
      subcategory: 'Maxi Skirts',
      colors: [
        { name: 'Floral', hex: '#FF0000' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Olive', hex: '#808000' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMG1heGklMjBza2lydHxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    // Hoodies
    {
      id: 'hoodie-1',
      name: 'Oversized Hoodie',
      category: 'Hoodies',
      subcategory: 'Oversized Hoodies',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Grey', hex: '#808080' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Navy', hex: '#000080' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true,
    },
    {
      id: 'hoodie-2',
      name: 'Cropped Hoodie',
      category: 'Hoodies',
      subcategory: 'Cropped Hoodies',
      colors: [
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Black', hex: '#000000' },
        { name: 'Lilac', hex: '#C8A2C8' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNyb3BwZWQlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'hoodie-3',
      name: 'Zip-up Hoodie',
      category: 'Hoodies',
      subcategory: 'Zip Hoodies',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Red', hex: '#FF0000' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHppcCUyMGhvb2RpZXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'hoodie-4',
      name: 'Graphic Hoodie',
      category: 'Hoodies',
      subcategory: 'Zip Hoodies',
      colors: [
        { name: 'Custom Print', hex: '#FF0000' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Grey', hex: '#808080' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    // T-Shirts
    {
      id: 'tshirt-1',
      name: 'Basic Tee',
      category: 'T-Shirts',
      subcategory: 'Basic Tees',
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Beige', hex: '#F5F5DC' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1511550521256-8526928a8af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true,
    },
    {
      id: 'tshirt-2',
      name: 'Graphic Tee',
      category: 'T-Shirts',
      subcategory: 'Graphic Tees',
      colors: [
        { name: 'Custom Print', hex: '#FF0000' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjB0c2hpcnR8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'tshirt-3',
      name: 'Tank Top',
      category: 'T-Shirts',
      subcategory: 'Tank Tops',
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Nude', hex: '#F2F2F2' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRhbmslMjB0b3B8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'tshirt-4',
      name: 'Long Sleeve Tee',
      category: 'T-Shirts',
      subcategory: 'Basic Tees',
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Stripe', hex: '#FF0000' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxvbmclMjBzbGVldmUlMjB0c2hpcnR8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    // Denim & Bottoms
    {
      id: 'denim-1',
      name: 'Skinny Jeans',
      category: 'Denim & Bottoms',
      subcategory: 'Jeans',
      colors: [
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Light Wash', hex: '#F0E68C' },
        { name: 'Dark Wash', hex: '#8B4513' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      featured: true,
    },
    {
      id: 'denim-2',
      name: 'Wide Leg Pants',
      category: 'Denim & Bottoms',
      subcategory: 'Pants',
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Camel', hex: '#C19A6B' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Navy', hex: '#000080' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHdpZGUlMjBsZWclMjBwYW50c3xlbnwxfHx8fDE3NzAxMDE5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'denim-3',
      name: 'Cargo Pants',
      category: 'Denim & Bottoms',
      subcategory: 'Pants',
      colors: [
        { name: 'Khaki', hex: '#F0E68C' },
        { name: 'Black', hex: '#000000' },
        { name: 'Olive', hex: '#808000' },
        { name: 'Beige', hex: '#F5F5DC' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1624623278313-a930126a11c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNhcmdvJTIwcGFudHN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'denim-4',
      name: 'Straight Jeans',
      category: 'Denim & Bottoms',
      subcategory: 'Jeans',
      colors: [
        { name: 'Classic Blue', hex: '#0000FF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Vintage Wash', hex: '#8B4513' },
      ],
      moq: 'MOQ: 50 pcs/style',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN0cmFpZ2h0JTIwamVhbnN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory && (!selectedSubcategory || product.subcategory === selectedSubcategory));

  const isSingleCategory = selectedCategory !== 'All';

  return (
    <div className="flex flex-col">
      {/* Category Banner Poster */}
      <section className="relative h-[500px] bg-black overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-1">
          {currentBanner.images.map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              <ImageWithFallback
                src={image}
                alt={`${selectedCategory} ${index + 1}`}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="text-sm uppercase tracking-[0.3em] mb-2 opacity-80">
            {currentBanner.subtitle}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {currentBanner.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            {currentBanner.description}
          </p>
        </div>
      </section>

      {/* Main Content: Sidebar + Products */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar: Categories Only */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-8">
                {/* Categories with Subcategories */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold mb-4 text-lg">Categories</h3>
                  <nav className="space-y-1">
                    {categoryStructure.map((categoryItem) => (
                      <div 
                        key={categoryItem.name}
                        onMouseEnter={() => handleCategoryHover(categoryItem.name)}
                        onMouseLeave={() => handleCategoryLeave(categoryItem.name)}
                      >
                        <button
                          onClick={() => {
                            handleCategoryClick(categoryItem.name);
                            if (categoryItem.subcategories) {
                              toggleCategory(categoryItem.name);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left px-4 py-2.5 rounded-md transition-colors ${
                            selectedCategory === categoryItem.name && !selectedSubcategory
                              ? 'bg-black text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{categoryItem.name}</span>
                          {categoryItem.subcategories && (
                            expandedCategories.includes(categoryItem.name) ? 
                            <ChevronUp className="w-4 h-4 inline-block" /> : 
                            <ChevronDown className="w-4 h-4 inline-block" />
                          )}
                        </button>
                        {/* Subcategories */}
                        {categoryItem.subcategories && expandedCategories.includes(categoryItem.name) && (
                          <div className="ml-2 mt-1 space-y-1">
                            {categoryItem.subcategories.map((subcategory) => (
                              <button
                                key={subcategory}
                                onClick={() => handleSubcategoryClick(categoryItem.name, subcategory)}
                                className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                                  selectedSubcategory === subcategory
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {subcategory}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Right Content: Products Grid (5 columns) */}
            <div className="flex-1">
              {/* Products Grid - 5 columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onNavigate('product-detail', { productId: product.id });
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold mb-2 text-sm">{product.name}</h3>
                      {selectedCategory === 'All' && (
                        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                      )}
                      <div className="flex items-center gap-1.5 mb-2">
                        {product.colors.slice(0, 4).map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-700">{product.moq}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl mb-6">Ready to Start Your Collection?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Share your requirements and we'll provide MOQ, timeline, and pricing.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Get a Quote
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}