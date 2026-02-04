/**
 * Mock Data for Development
 * Used when backend server is not running
 */

import { Product } from './api';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'elegant-evening-dress',
    title: 'Elegant Evening Dress',
    category: 'Dresses',
    subcategory: 'Evening Dresses',
    mainImage: 'https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZWxlZ2FudCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZWxlZ2FudCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwY2FzdWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Sophisticated evening dress perfect for formal occasions. Features elegant draping and premium fabric construction.',
    moq: '50 pcs/style/color',
    sampleLeadTime: '7-10 days',
    bulkLeadTime: '25-35 days',
    material: '95% Polyester, 5% Spandex',
    process: 'Cut and sew with bias binding finish',
    capacity: '50,000 pcs/month',
    packaging: 'Individual polybag with hanger',
    customOptions: ['Custom colors', 'Private label', 'Custom packaging', 'Size grading'],
    tags: ['Evening Wear', 'Formal', 'Elegant'],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    slug: 'casual-work-dress',
    title: 'Casual Work Dress',
    category: 'Dresses',
    subcategory: 'Work Dresses',
    mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwY2FzdWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwY2FzdWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Versatile work dress suitable for office and business casual settings. Comfortable all-day wear.',
    moq: '100 pcs/style/color',
    sampleLeadTime: '7-12 days',
    bulkLeadTime: '20-30 days',
    material: '100% Cotton',
    process: 'Garment dyed with enzyme wash',
    capacity: '80,000 pcs/month',
    packaging: 'Folded in polybag',
    customOptions: ['Custom colors', 'Embroidery options', 'Private label'],
    tags: ['Business Casual', 'Office Wear', 'Versatile'],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    slug: 'professional-blazer-set',
    title: 'Professional Blazer Set',
    category: 'Women Sets',
    subcategory: 'Formal Sets',
    mainImage: 'https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VpdCUyMGJsYXplciUyMHdvbWVufGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VpdCUyMGJsYXplciUyMHdvbWVufGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvb3JkJTIwc2V0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Two-piece coordinated set with blazer and matching pants. Perfect for professional environments.',
    moq: '50 pcs/style/color',
    sampleLeadTime: '10-14 days',
    bulkLeadTime: '30-40 days',
    material: '70% Polyester, 30% Wool',
    process: 'Fully lined with shoulder pads',
    capacity: '30,000 pcs/month',
    packaging: 'Individual polybag with suit hanger',
    customOptions: ['Custom lining', 'Monogramming', 'Private label', 'Custom buttons'],
    tags: ['Professional', 'Formal', 'Two-Piece'],
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    slug: 'midi-skirt-collection',
    title: 'Midi Skirt Collection',
    category: 'Skirts',
    subcategory: 'Midi Skirts',
    mainImage: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwbWlkaXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwbWlkaXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1592423777039-7be9f340582b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwb3V0Zml0fGVufDF8fHx8MTc3MDEwMTg3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Versatile midi-length skirt with elastic waistband. Comfortable and stylish for any occasion.',
    moq: '100 pcs/style/color',
    sampleLeadTime: '5-7 days',
    bulkLeadTime: '15-25 days',
    material: '100% Viscose',
    process: 'Reactive dyed with bias binding',
    capacity: '100,000 pcs/month',
    packaging: 'Folded in polybag',
    customOptions: ['Custom prints', 'Length adjustment', 'Private label'],
    tags: ['Midi Length', 'Casual', 'Comfortable'],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    slug: 'oversized-streetwear-hoodie',
    title: 'Oversized Streetwear Hoodie',
    category: 'Hoodies',
    subcategory: 'Oversized Hoodies',
    mainImage: 'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNyb3BwZWQlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Premium heavyweight hoodie with oversized fit. Perfect for streetwear brands and casual collections.',
    moq: '50 pcs/style/color',
    sampleLeadTime: '7-10 days',
    bulkLeadTime: '20-30 days',
    material: '80% Cotton, 20% Polyester fleece',
    process: 'Pre-shrunk with brushed interior',
    capacity: '60,000 pcs/month',
    packaging: 'Individual polybag',
    customOptions: ['Screen printing', 'Embroidery', 'Custom labels', 'Tie-dye options'],
    tags: ['Streetwear', 'Oversized', 'Casual'],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    slug: 'basic-cotton-tee',
    title: 'Basic Cotton T-Shirt',
    category: 'T-Shirts',
    subcategory: 'Basic Tees',
    mainImage: 'https://images.unsplash.com/photo-1511550521256-8526928a8af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1511550521256-8526928a8af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjB0c2hpcnR8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Essential basic tee in soft cotton. Perfect for printing and branding. Available in multiple colors.',
    moq: '200 pcs/style/color',
    sampleLeadTime: '3-5 days',
    bulkLeadTime: '10-20 days',
    material: '100% Combed Cotton',
    process: 'Tubular knit construction',
    capacity: '200,000 pcs/month',
    packaging: 'Bulk packed or individual polybag',
    customOptions: ['Screen printing', 'DTG printing', 'Embroidery', 'Private label'],
    tags: ['Basic', 'Cotton', 'Printable'],
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    slug: 'high-waist-jeans',
    title: 'High Waist Jeans',
    category: 'Denim & Bottoms',
    subcategory: 'Jeans',
    mainImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN0cmFpZ2h0JTIwamVhbnN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Classic high-waisted denim with premium construction. Multiple wash options available.',
    moq: '100 pcs/style/color',
    sampleLeadTime: '10-15 days',
    bulkLeadTime: '30-45 days',
    material: '98% Cotton, 2% Elastane denim',
    process: 'Stone wash with hand sanding',
    capacity: '40,000 pcs/month',
    packaging: 'Folded in polybag',
    customOptions: ['Custom washes', 'Distressing', 'Embroidery', 'Custom hardware'],
    tags: ['Denim', 'High Waist', 'Classic'],
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    slug: 'casual-coord-set',
    title: 'Casual Coord Set',
    category: 'Women Sets',
    subcategory: 'Casual Sets',
    mainImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvb3JkJTIwc2V0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvb3JkJTIwc2V0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Comfortable matching set for leisure and casual wear. Soft fabrication with relaxed fit.',
    moq: '50 pcs/style/color',
    sampleLeadTime: '7-10 days',
    bulkLeadTime: '20-30 days',
    material: '95% Modal, 5% Spandex',
    process: 'Garment dyed for soft hand feel',
    capacity: '70,000 pcs/month',
    packaging: 'Set packed in polybag',
    customOptions: ['Custom colors', 'Print options', 'Private label'],
    tags: ['Casual', 'Comfortable', 'Matching Set'],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getMockProducts(params?: { category?: string; featured?: boolean }): Product[] {
  let filtered = MOCK_PRODUCTS;

  if (params?.category) {
    filtered = filtered.filter(p => p.category === params.category);
  }

  if (params?.featured) {
    filtered = filtered.filter(p => p.featured);
  }

  return filtered;
}

export function getMockProduct(identifier: string | number): Product | null {
  const product = MOCK_PRODUCTS.find(p => 
    p.slug === identifier || p.id === Number(identifier)
  );
  
  return product || null;
}
