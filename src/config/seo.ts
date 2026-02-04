/**
 * SEO配置文件
 * 集中管理所有页面的SEO元信息
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

// 网站基础信息
export const SITE_INFO = {
  name: 'Dongguan Xikaixi Garment Co.,Ltd.',
  nameShort: 'Xikaixi Garment',
  domain: 'xikaixi.com', // 替换为实际域名
  email: 'sales@xikaixi.com',
  defaultOgImage: '/images/og-default.jpg', // 默认分享图片
} as const;

// 默认SEO配置
export const DEFAULT_SEO: SEOConfig = {
  title: `${SITE_INFO.nameShort} - Professional Women's Apparel OEM/ODM Manufacturer`,
  description: 'Leading B2B women\'s clothing manufacturer in China. Specialized in dresses, hoodies, t-shirts, and custom apparel. MOQ 50pcs, 7-10 days sampling, ISO certified quality.',
  keywords: 'women clothing manufacturer, OEM ODM apparel, custom dress manufacturer, wholesale clothing supplier, garment factory China, B2B fashion manufacturer',
  ogTitle: `${SITE_INFO.nameShort} - Professional Women's Apparel Manufacturer`,
  ogDescription: 'Your trusted B2B partner for custom women\'s clothing. Quality manufacturing, low MOQ, fast sampling.',
  ogImage: SITE_INFO.defaultOgImage,
};

// 各页面SEO配置
export const PAGE_SEO: Record<string, SEOConfig> = {
  home: {
    title: `${SITE_INFO.nameShort} - Women's Clothing OEM/ODM Manufacturer | MOQ 50pcs`,
    description: 'Professional women\'s apparel manufacturer in Dongguan, China. Specialized in OEM/ODM services for dresses, hoodies, t-shirts. MOQ 50pcs, 7-10 days sampling, ISO quality control.',
    keywords: 'women clothing manufacturer, OEM ODM apparel, dress manufacturer, hoodie manufacturer, t-shirt manufacturer, China garment factory, wholesale clothing supplier',
    ogTitle: `${SITE_INFO.nameShort} - Your Trusted B2B Apparel Manufacturing Partner`,
    ogDescription: 'MOQ 50pcs | 7-10 Days Sampling | ISO Certified | 15+ Years Experience',
  },

  collections: {
    title: `Product Collections - ${SITE_INFO.nameShort}`,
    description: 'Browse our complete collection of women\'s apparel: dresses, hoodies, t-shirts, skirts, pants, and custom sets. All products available for OEM/ODM customization.',
    keywords: 'women dresses wholesale, hoodies manufacturer, t-shirts bulk order, skirts supplier, pants manufacturer, custom apparel',
    ogTitle: 'Women\'s Clothing Collections - Wholesale & Custom Manufacturing',
    ogDescription: 'Explore our full range of customizable women\'s apparel products.',
  },

  'collections-dresses': {
    title: `Women's Dresses Manufacturer - Custom OEM/ODM | ${SITE_INFO.nameShort}`,
    description: 'Custom women\'s dress manufacturing: casual, formal, knit, and elegant styles. MOQ 50pcs per style, flexible customization, quality fabric selection.',
    keywords: 'dress manufacturer, custom dress maker, wholesale dresses, OEM dress factory, women dress supplier China',
    ogTitle: 'Custom Women\'s Dresses - OEM/ODM Manufacturing',
    ogDescription: 'Professional dress manufacturing with flexible MOQ and full customization support.',
  },

  'collections-hoodies': {
    title: `Hoodie Manufacturer - Custom Sweatshirts OEM/ODM | ${SITE_INFO.nameShort}`,
    description: 'Custom hoodie and sweatshirt manufacturer. Streetwear, cropped, zip-up, and graphic hoodies. Quality fabric, custom printing, embroidery services available.',
    keywords: 'hoodie manufacturer, sweatshirt factory, custom hoodies, wholesale streetwear, OEM hoodie supplier',
    ogTitle: 'Custom Hoodie Manufacturing - Quality Sweatshirts OEM/ODM',
    ogDescription: 'Design your custom hoodies with full printing and embroidery support.',
  },

  'collections-tshirts': {
    title: `T-Shirt Manufacturer - Custom Printing & Wholesale | ${SITE_INFO.nameShort}`,
    description: 'Bulk t-shirt manufacturing with custom printing, embroidery, and design. Basic tees, graphic tees, tank tops, and long sleeve shirts. MOQ 100pcs per design.',
    keywords: 't-shirt manufacturer, custom t-shirts bulk, wholesale tees, OEM t-shirt factory, printed t-shirts supplier',
    ogTitle: 'Custom T-Shirt Manufacturing - Bulk Orders & Printing',
    ogDescription: 'Quality t-shirt production with custom printing and embroidery services.',
  },

  'collections-skirts': {
    title: `Skirt Manufacturer - Custom Women's Skirts OEM/ODM | ${SITE_INFO.nameShort}`,
    description: 'Custom skirt manufacturing: midi, pencil, maxi, and A-line skirts. Quality fabrics, various styles, flexible customization options.',
    keywords: 'skirt manufacturer, custom skirts wholesale, women skirt supplier, OEM skirt factory',
    ogTitle: 'Women\'s Skirt Manufacturing - Custom Styles & Fabrics',
    ogDescription: 'Professional skirt production with full style and fabric customization.',
  },

  'collections-denim': {
    title: `Denim & Pants Manufacturer - Custom Jeans & Bottoms | ${SITE_INFO.nameShort}`,
    description: 'Custom jeans, pants, and bottoms manufacturing. Wide leg, cargo, straight fit jeans. Quality denim fabric, custom washes and finishes.',
    keywords: 'jeans manufacturer, denim factory, custom pants, wholesale jeans, OEM denim supplier',
    ogTitle: 'Custom Denim & Pants Manufacturing - Quality Jeans OEM/ODM',
    ogDescription: 'Professional jeans and pants production with custom washes and styles.',
  },

  'collections-womensets': {
    title: `Women's Sets Manufacturer - Coord Sets & Two-Piece OEM | ${SITE_INFO.nameShort}`,
    description: 'Custom women\'s coord sets and two-piece manufacturing. Blazer sets, loungewear, and matching outfits. Complete customization available.',
    keywords: 'coord set manufacturer, two-piece clothing supplier, matching sets wholesale, women sets OEM',
    ogTitle: 'Women\'s Coord Sets Manufacturing - Custom Two-Piece Outfits',
    ogDescription: 'Quality coord set and matching outfit production services.',
  },

  factory: {
    title: `Our Factory - Manufacturing Facility Tour | ${SITE_INFO.nameShort}`,
    description: 'Visit our ISO-certified garment factory in Dongguan. 5000㎡ facility, 8 production lines, 200+ skilled workers, advanced equipment, strict quality control.',
    keywords: 'garment factory China, clothing manufacturer facility, ISO certified factory, Dongguan apparel factory',
    ogTitle: 'Factory Tour - Modern Garment Manufacturing Facility',
    ogDescription: '5000㎡ facility with 8 production lines and ISO quality certification.',
  },

  'oem-odm': {
    title: `OEM/ODM Services - Custom Apparel Manufacturing | ${SITE_INFO.nameShort}`,
    description: 'Comprehensive OEM/ODM services: design development, sampling, mass production, quality control, packaging, and logistics. Full support from concept to delivery.',
    keywords: 'OEM ODM services, custom apparel manufacturing, private label clothing, design development, sampling services',
    ogTitle: 'OEM/ODM Services - Full Custom Manufacturing Support',
    ogDescription: 'From design to delivery - complete OEM/ODM manufacturing solutions.',
  },

  about: {
    title: `About Us - Company Profile | ${SITE_INFO.nameShort}`,
    description: '15+ years women\'s apparel manufacturing experience. ISO certified, exporting to 30+ countries, serving 200+ brands worldwide. Located in Dongguan, China.',
    keywords: 'clothing manufacturer about, garment company profile, apparel factory China, manufacturing experience',
    ogTitle: 'About Us - 15+ Years Professional Manufacturing Experience',
    ogDescription: 'ISO certified manufacturer serving 200+ brands in 30+ countries.',
  },

  cases: {
    title: `Success Cases - Client Projects | ${SITE_INFO.nameShort}`,
    description: 'View our successful manufacturing projects and client collaborations. Real cases showcasing our OEM/ODM capabilities across different product categories.',
    keywords: 'manufacturing case studies, client projects, OEM success stories, apparel portfolio',
    ogTitle: 'Success Cases - Our Client Projects & Collaborations',
    ogDescription: 'Real project examples showcasing our manufacturing capabilities.',
  },

  contact: {
    title: `Contact Us - Get a Quote | ${SITE_INFO.nameShort}`,
    description: 'Get in touch for quotation, tech pack evaluation, and manufacturing inquiries. Email, WhatsApp, or submit online form. Response within 24 hours.',
    keywords: 'contact clothing manufacturer, get apparel quote, manufacturing inquiry, tech pack evaluation',
    ogTitle: 'Contact Us - Request Quote & Manufacturing Inquiry',
    ogDescription: 'Get your quote within 24 hours. Email or WhatsApp available.',
  },
};

// 动态生成产品详情页SEO
export function getProductSEO(productName: string, category: string): SEOConfig {
  return {
    title: `${productName} - ${category} | ${SITE_INFO.nameShort}`,
    description: `Custom ${productName.toLowerCase()} manufacturing. View details, specifications, MOQ, lead time, and customization options. Get quote now.`,
    keywords: `${productName.toLowerCase()}, ${category.toLowerCase()} manufacturer, custom ${productName.toLowerCase()}, wholesale ${productName.toLowerCase()}`,
    ogTitle: `${productName} - Custom Manufacturing`,
    ogDescription: `Professional ${productName.toLowerCase()} production with full customization support.`,
  };
}

// 根据路径获取SEO配置
export function getSEOForPath(path: string, params?: Record<string, string>): SEOConfig {
  // 移除开头的斜杠
  const cleanPath = path.replace(/^\//, '');

  // 产品详情页
  if (cleanPath.startsWith('collections/product/')) {
    const productName = params?.name || 'Product';
    const category = params?.category || 'Apparel';
    return getProductSEO(productName, category);
  }

  // Collections页面（带分类）
  if (cleanPath.startsWith('collections/') && params?.category) {
    const categoryKey = `collections-${params.category.toLowerCase().replace(/\s+/g, '')}`;
    return PAGE_SEO[categoryKey] || PAGE_SEO.collections;
  }

  // 其他页面
  const pageKey = cleanPath || 'home';
  return PAGE_SEO[pageKey] || DEFAULT_SEO;
}
