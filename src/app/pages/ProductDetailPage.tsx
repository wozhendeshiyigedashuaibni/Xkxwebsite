import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, Play, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProductDetailPageProps {
  onNavigate: (page: string, options?: { category?: string; productId?: string }) => void;
  productId?: string;
}

interface MediaItem {
  type: 'video' | 'image';
  url: string;
  thumbnail?: string;
}

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
}

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  breadcrumb: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  moq: string;
  sampleTime: string;
  bulkTime: string;
  media: MediaItem[];
  description: string;
  specifications: { label: string; value: string }[];
  detailImages: string[];
}

export function ProductDetailPage({ onNavigate, productId }: ProductDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [customizationExpanded, setCustomizationExpanded] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [recommendedIndex, setRecommendedIndex] = useState(0);

  // Customization options state
  const [customizations, setCustomizations] = useState<Record<string, { quantity: number; file: File | null }>>({
    mainLabel: { quantity: 0, file: null },
    packaging: { quantity: 0, file: null },
    careLabel: { quantity: 0, file: null },
  });

  // Mock product data
  const product: ProductDetail = {
    id: productId || 'hoodie-1',
    name: 'Oversized Hoodie',
    category: 'Hoodies',
    breadcrumb: ['Home', 'Collections', 'Hoodies', 'Oversized Hoodie'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    moq: '50 pcs/style',
    sampleTime: '7-12 days',
    bulkTime: '15-40 days',
    media: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      { type: 'image', url: 'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNyb3BwZWQlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHppcCUyMGhvb2RpZXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
    description: 'Our premium oversized hoodie combines comfort with contemporary streetwear aesthetics. Designed for brands seeking quality casual wear with superior construction and fabric choices. Perfect for building your streetwear or athleisure collection with customizable options for your brand identity.',
    specifications: [
      { label: 'Fabric Weight', value: '280-320 GSM' },
      { label: 'Fabric Type', value: 'Cotton Fleece / French Terry' },
      { label: 'Fit Type', value: 'Oversized / Relaxed' },
      { label: 'Closure Type', value: 'Pullover' },
      { label: 'Pattern', value: 'Solid / Custom Print' },
      { label: 'Season', value: 'Fall / Winter / Spring' },
    ],
    detailImages: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNyb3BwZWQlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHppcCUyMGhvb2RpZXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  };

  const customizationOptions: CustomizationOption[] = [
    { id: 'mainLabel', name: 'Main Label', description: 'Your brand\'s main woven or printed label' },
    { id: 'packaging', name: 'Packaging Bag', description: 'Custom poly bags or garment bags with your logo' },
    { id: 'careLabel', name: 'Care Label', description: 'Washing instruction labels with your branding' },
  ];

  const recommendedProducts = [
    {
      id: 'hoodie-2',
      name: 'Cropped Hoodie',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNyb3BwZWQlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      moq: '50 pcs/style',
    },
    {
      id: 'hoodie-3',
      name: 'Graphic Hoodie',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      moq: '50 pcs/style',
    },
    {
      id: 'hoodie-4',
      name: 'Zip-Up Hoodie',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHppcCUyMGhvb2RpZXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      moq: '50 pcs/style',
    },
    {
      id: 'tshirt-1',
      name: 'Basic Tee',
      category: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1511550521256-8526928a8af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      moq: '100 pcs/style',
    },
    {
      id: 'dress-1',
      name: 'Evening Dress',
      category: 'Dresses',
      image: 'https://images.unsplash.com/photo-1513804742077-e1f5a4b8d51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZvcm1hbCUyMGRyZXNzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzAxMDE5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      moq: '50 pcs/style',
    },
  ];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? product.media.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === product.media.length - 1 ? 0 : prev + 1));
  };

  const handleProductClick = (id: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate('product-detail', { productId: id });
  };

  const handleCustomizationChange = (id: string, field: 'quantity' | 'file', value: number | File | null) => {
    setCustomizations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleCustomizationChange(id, 'file', file);
  };

  const scrollRecommended = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setRecommendedIndex((prev) => Math.max(0, prev - 1));
    } else {
      setRecommendedIndex((prev) => Math.min(recommendedProducts.length - 4, prev + 1));
    }
  };

  return (
    <div className="bg-white">
      {/* Product Categories Navigation - Always visible */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {[
              'Dresses',
              'Hoodies', 
              'T-Shirts',
              'Suits',
              'Pants',
              'Skirts',
              'Jackets',
              'Blouses',
              'Sweaters',
              'Activewear'
            ].map((category) => (
              <button
                key={category}
                onClick={() => onNavigate('collections', { category })}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  product.category === category
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Product Images (Larger) */}
            <div className="lg:w-[58%] flex-shrink-0">
              <div className="max-w-3xl mx-auto">
                <div className="relative group">
                  <div className="flex gap-4">
                    {/* Current Image */}
                    <div className="flex-1 relative bg-gray-100 rounded-xl overflow-hidden aspect-[3/4.5]">
                      {product.media[selectedImageIndex].type === 'video' ? (
                        <video key={product.media[selectedImageIndex].url} controls autoPlay loop muted className="w-full h-full object-cover">
                          <source src={product.media[selectedImageIndex].url} type="video/mp4" />
                        </video>
                      ) : (
                        <ImageWithFallback src={product.media[selectedImageIndex].url} alt={product.name} className="w-full h-full object-cover" />
                      )}
                      {product.media[selectedImageIndex].type === 'video' && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">VIDEO</div>
                      )}
                      
                      {/* Left Navigation Area - Semi-transparent brown */}
                      <button 
                        onClick={handlePrevImage}
                        className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-3 z-10"
                      >
                        <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
                      </button>
                    </div>

                    {/* Next Image Preview */}
                    <div className="flex-1 relative bg-gray-100 rounded-xl overflow-hidden aspect-[3/4.5]">
                      {product.media[(selectedImageIndex + 1) % product.media.length].type === 'video' ? (
                        <div className="relative w-full h-full">
                          <ImageWithFallback
                            src={product.media[(selectedImageIndex + 1) % product.media.length].thumbnail || product.media[(selectedImageIndex + 1) % product.media.length].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      ) : (
                        <ImageWithFallback
                          src={product.media[(selectedImageIndex + 1) % product.media.length].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Right Navigation Area - Semi-transparent brown */}
                      <button 
                        onClick={handleNextImage}
                        className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-3 z-10"
                      >
                        <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Counter */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 text-white rounded-full text-xs">
                    {selectedImageIndex + 1} / {product.media.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Info (Narrower, Sticky) */}
            <div className="lg:w-[42%]">
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Title */}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{product.category}</div>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                </div>

                {/* Color Selection */}
                <div>
                  <div className="text-sm font-semibold mb-2">Color</div>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(index)}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          selectedColor === index ? 'border-black scale-110 shadow-md' : 'border-gray-300 hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Selected: {product.colors[selectedColor].name}</div>
                </div>

                {/* Size Selection */}
                <div>
                  <div className="text-sm font-semibold mb-2">Size</div>
                  <div className="grid grid-cols-3 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-center border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSize === size ? 'bg-black text-white border-black' : 'bg-white border-gray-300 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Options (Collapsible) */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setCustomizationExpanded(!customizationExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold">Customization Options</span>
                    {customizationExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {customizationExpanded && (
                    <div className="p-4 pt-0 space-y-4 max-h-96 overflow-y-auto">
                      {customizationOptions.map((option) => (
                        <div key={option.id} className="border-t pt-4 first:border-0 first:pt-0">
                          <div className="font-medium text-sm mb-1">{option.name}</div>
                          <div className="text-xs text-gray-500 mb-3">{option.description}</div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 block mb-1">Quantity</label>
                              <input
                                type="number"
                                min="0"
                                value={customizations[option.id].quantity}
                                onChange={(e) => handleCustomizationChange(option.id, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 block mb-1">Upload File</label>
                              <label className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload className="w-4 h-4" />
                                {customizations[option.id].file ? (
                                  <span className="text-xs truncate">{customizations[option.id].file?.name}</span>
                                ) : (
                                  <span className="text-xs">Choose</span>
                                )}
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(option.id, e)} accept="image/*,.pdf,.ai" />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inquiry Button */}
                <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Product Inquiry
                </button>

                {/* Product Description (Collapsible) */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold">Product Description</span>
                    {descriptionExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {descriptionExpanded && (
                    <div className="p-4 pt-0">
                      <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products (Smaller size) */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <div className="flex gap-2">
              <button onClick={() => scrollRecommended('left')} disabled={recommendedIndex === 0} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollRecommended('right')} disabled={recommendedIndex >= recommendedProducts.length - 4} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-3 transition-transform duration-300" style={{ transform: `translateX(-${recommendedIndex * 12.5}%)` }}>
              {recommendedProducts.map((item) => (
                <div key={item.id} onClick={() => handleProductClick(item.id)} className="flex-shrink-0 w-[12%] bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-[3/4] overflow-hidden">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] text-gray-500 uppercase mb-0.5">{item.category}</div>
                    <h3 className="font-semibold text-xs mb-0.5 truncate">{item.name}</h3>
                    <div className="text-[10px] text-gray-600">MOQ: {item.moq}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                  <span className="text-sm font-medium text-gray-600">{spec.label}:</span>
                  <span className="text-sm text-gray-900 font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Images */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.detailImages.map((image, index) => (
              <div key={index} className="aspect-[4/5] rounded-xl overflow-hidden">
                <ImageWithFallback src={image} alt={`${product.name} detail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}