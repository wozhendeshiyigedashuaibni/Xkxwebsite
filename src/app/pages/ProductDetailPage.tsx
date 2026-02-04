import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Check, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useTranslation } from '@/hooks/useTranslation';
import { useSEO } from '@/hooks/useSEO';
import { api, Product } from '@/lib/api';
import { CONTACT_CONFIG } from '@/config/contact';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // API State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // UI State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(100);
  const [customizationExpanded, setCustomizationExpanded] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);

  useSEO();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const data = await api.getProduct(productId);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (err instanceof Error && err.message.includes('404')) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Process images from product data
  const getMediaItems = (): MediaItem[] => {
    if (!product) return [];
    
    const mediaItems: MediaItem[] = [];
    
    // Add images array if exists
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach(url => {
        mediaItems.push({ type: 'image', url });
      });
    }
    
    // If no images, use mainImage as fallback
    if (mediaItems.length === 0 && product.mainImage) {
      mediaItems.push({ type: 'image', url: product.mainImage });
    }
    
    // If still no images, use placeholder
    if (mediaItems.length === 0) {
      mediaItems.push({ 
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZWxlZ2FudCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080'
      });
    }
    
    return mediaItems;
  };

  const mediaItems = getMediaItems();
  const currentMedia = mediaItems[selectedImageIndex] || mediaItems[0];

  // Mock color options (since API might not provide this)
  const colorOptions = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(50, prev + delta));
  };

  const handleContactWhatsApp = () => {
    if (product) {
      const message = `Hi, I'm interested in: ${product.title}\nMOQ: ${product.moq || '50 pcs'}\nQuantity: ${quantity} pcs\n\nCan you provide more details?`;
      const url = `${CONTACT_CONFIG.whatsapp.url}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const handleSendInquiry = () => {
    navigate('/contact', { 
      state: { 
        productId: product?.id,
        productTitle: product?.title,
        quantity 
      } 
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/collections')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-2">Error Loading Product</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/collections')}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No product data (shouldn't happen, but safe fallback)
  if (!product) {
    return null;
  }

  // Success State - Render Product Detail
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => navigate('/collections')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Collections</span>
        </button>
      </div>

      {/* Product Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group">
              {currentMedia.type === 'video' ? (
                <video
                  src={currentMedia.url}
                  poster={currentMedia.thumbnail}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageWithFallback
                  src={currentMedia.url}
                  alt={product.title || 'Product'}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Navigation Arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {mediaItems.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {mediaItems.slice(0, 4).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <ImageWithFallback
                      src={item.type === 'video' ? item.thumbnail || item.url : item.url}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
              <span className="hover:text-black cursor-pointer" onClick={() => navigate('/')}>
                Home
              </span>
              {' / '}
              <span className="hover:text-black cursor-pointer" onClick={() => navigate('/collections')}>
                Collections
              </span>
              {product.category && (
                <>
                  {' / '}
                  <span className="text-black">{product.category}</span>
                </>
              )}
            </div>

            {/* Product Title & Category */}
            <div>
              {product.category && (
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                  {product.category}
                </div>
              )}
              <h1 className="text-4xl font-bold mb-3">{product.title || 'Product'}</h1>
              {product.description && (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Manufacturing Info */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">MOQ</div>
                <div className="font-semibold">{product.moq || '50 pcs/style'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sample Time</div>
                <div className="font-semibold">{product.sampleLeadTime || '7-12 days'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bulk Time</div>
                <div className="font-semibold">{product.bulkLeadTime || '15-40 days'}</div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Color: <span className="text-gray-600">{colorOptions[selectedColor].name}</span>
              </label>
              <div className="flex gap-2">
                {colorOptions.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(index)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === index ? 'border-black scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === index && color.hex === '#FFFFFF' && (
                      <Check className="w-5 h-5 mx-auto text-black" />
                    )}
                    {selectedColor === index && color.hex !== '#FFFFFF' && (
                      <Check className="w-5 h-5 mx-auto text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Size: <span className="text-gray-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-3">Order Quantity (pcs)</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-50)}
                  className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:border-black"
                  min="50"
                  step="50"
                />
                <button
                  onClick={() => handleQuantityChange(50)}
                  className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum order: {product.moq || '50 pcs'}</p>
            </div>

            {/* Customization Options */}
            {product.customOptions && product.customOptions.length > 0 && (
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setCustomizationExpanded(!customizationExpanded)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold">Customization Options Available</span>
                  <ChevronLeft className={`w-5 h-5 transition-transform ${customizationExpanded ? 'rotate-90' : ''}`} />
                </button>
                {customizationExpanded && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <ul className="space-y-2 text-sm text-gray-600">
                      {product.customOptions.map((option, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Material & Process Info */}
            {(product.material || product.process) && (
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold">Technical Specifications</span>
                  <ChevronLeft className={`w-5 h-5 transition-transform ${descriptionExpanded ? 'rotate-90' : ''}`} />
                </button>
                {descriptionExpanded && (
                  <div className="p-4 pt-0 border-t border-gray-200 space-y-3">
                    {product.material && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">Material</div>
                        <div className="text-sm">{product.material}</div>
                      </div>
                    )}
                    {product.process && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">Process</div>
                        <div className="text-sm">{product.process}</div>
                      </div>
                    )}
                    {product.capacity && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">Monthly Capacity</div>
                        <div className="text-sm">{product.capacity}</div>
                      </div>
                    )}
                    {product.packaging && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">Packaging</div>
                        <div className="text-sm">{product.packaging}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleSendInquiry}
                className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Product Inquiry
              </button>
              <button
                onClick={handleContactWhatsApp}
                className="w-full py-4 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-semibold"
              >
                Contact via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
