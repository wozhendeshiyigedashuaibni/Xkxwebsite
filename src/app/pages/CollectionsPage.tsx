import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useSEO } from '@/hooks/useSEO';
import { api, Product } from '@/lib/api';

interface BannerData {
  title: string;
  subtitle: string;
  images: string[];
}

interface CategoryItem {
  name: string;
  subcategories?: string[];
}

export function CollectionsPage() {
  const { t } = useTranslation();
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Dresses']);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 设置SEO（根据category动态变化）
  useSEO();

  // Update selected category when route param changes
  useEffect(() => {
    if (category) {
      // Decode URL slug back to category name
      const decoded = decodeURIComponent(category).replace(/-/g, ' ');
      // Capitalize each word to match our category names
      const categoryName = decoded
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setSelectedCategory(categoryName);
    }
  }, [category]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params: { category?: string; featured?: boolean } = {};
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        
        const data = await api.getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

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

  const handleProductClick = (product: Product) => {
    // Navigate using product slug or id
    navigate(`/product/${product.slug || product.id}`);
  };

  // Category-specific banners
  const categoryBanners: Record<string, BannerData> = {
    'All': {
      title: 'Complete Collection',
      subtitle: 'Your Manufacturing Partner',
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
      images: [
        'https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VpdCUyMGJsYXplciUyMHdvbWVufGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvb3JkJTIwc2V0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNhcmdvJTIwcGFudHN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNob3J0cyUyMHnoaXJ0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    'Skirts': {
      title: 'Skirt Collection',
      subtitle: 'Classic to Contemporary',
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
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHdpZGUlMjBsZWclMjBwYW50c3xlbnwxfHx8fDE3NzAxMDE5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1624623278313-a930126a11c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNhcmdvJTIwcGFudHN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN0cmFpZ2h0JTIwamVhbnN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
  };

  const currentBanner = categoryBanners[selectedCategory] || categoryBanners['All'];

  // Filter products based on subcategory if selected
  const displayedProducts = selectedSubcategory
    ? products.filter(p => p.subcategory === selectedSubcategory)
    : products;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[400px] bg-gradient-to-r from-neutral-900 to-neutral-800 overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 grid grid-cols-4 gap-0.5">
          {currentBanner.images.map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              <ImageWithFallback
                src={image}
                alt={`${selectedCategory} ${index + 1}`}
                className="w-full h-full object-cover opacity-30"
              />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <div className="text-center max-w-3xl">
            <div className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80">
              {t('nav.collections')}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {currentBanner.title}
            </h1>
            <p className="text-xl opacity-90">
              {t('collections.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Category Filter */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-bold mb-4 text-lg">{t('footer.categories')}</h3>
                <nav className="space-y-2">
                  {categoryStructure.map((categoryItem) => (
                    <div key={categoryItem.name}>
                      <div
                        className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                          selectedCategory === categoryItem.name
                            ? 'bg-black text-white font-medium'
                            : 'hover:bg-neutral-100'
                        }`}
                        onClick={() => handleCategoryClick(categoryItem.name)}
                        onMouseEnter={() => handleCategoryHover(categoryItem.name)}
                        onMouseLeave={() => handleCategoryLeave(categoryItem.name)}
                      >
                        <span>{categoryItem.name}</span>
                        {categoryItem.subcategories && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(categoryItem.name);
                            }}
                            className="p-1"
                          >
                            {expandedCategories.includes(categoryItem.name) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Subcategories */}
                      {categoryItem.subcategories && expandedCategories.includes(categoryItem.name) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {categoryItem.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => handleSubcategoryClick(categoryItem.name, sub)}
                              className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-all ${
                                selectedSubcategory === sub
                                  ? 'bg-neutral-200 font-medium'
                                  : 'hover:bg-neutral-50'
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading products...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
                  <div className="font-medium">Error loading products</div>
                  <div className="text-sm">{error}</div>
                </div>
              )}

              {!loading && !error && displayedProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-neutral-600 text-lg">{t('collections.noitems')}</p>
                </div>
              )}

              {!loading && !error && displayedProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="group cursor-pointer bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* Product Image */}
                      <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                        <ImageWithFallback
                          src={product.mainImage}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                          {product.category}
                        </div>
                        <h3 className="font-medium mb-2 group-hover:text-neutral-600 transition-colors">
                          {product.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
                          <span>{t('collections.moq')}: {product.moq}</span>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <button className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                          {t('collections.viewdetails')}
                          <ArrowRight className="w-4 h-4 transition-all" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('collections.cta.title')}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {t('collections.cta.subtitle')}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-neutral-100 transition-colors inline-flex items-center gap-2"
          >
            {t('collections.cta.button')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}