/**
 * API Client
 * 统一封装所有后端API调用
 */

import { getMockProducts, getMockProduct } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Default to true if not explicitly set to 'false'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK !== 'false';

interface ApiError {
  error: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      // Check if response is HTML (backend not running)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        // Only show error if not in mock mode
        if (!USE_MOCK_DATA) {
          console.error('❌ Backend not running on port 3001');
          console.info('💡 Tip: Run `npm run server` in a separate terminal');
        }
        throw new Error('BACKEND_NOT_RUNNING');
      }

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: 'Network error',
        }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Check if it's a backend not running error
      if (error instanceof Error && error.message === 'BACKEND_NOT_RUNNING') {
        throw error;
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async requestFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: 'Network error',
        }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ========== PRODUCTS ==========
  async getProducts(params?: { category?: string; featured?: boolean }) {
    // Use mock data if enabled or if backend fails
    if (USE_MOCK_DATA) {
      console.log('Using mock data (VITE_USE_MOCK=true)');
      return Promise.resolve(getMockProducts(params));
    }

    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.featured) query.append('featured', 'true');

      const queryString = query.toString();
      return await this.request<Product[]>(
        `/products${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'BACKEND_NOT_RUNNING') {
        console.log('Falling back to mock data');
        return getMockProducts(params);
      }
      throw error;
    }
  }

  async getProduct(identifier: string | number) {
    // Use mock data if enabled or if backend fails
    if (USE_MOCK_DATA) {
      console.log('Using mock data (VITE_USE_MOCK=true)');
      const product = getMockProduct(identifier);
      if (!product) {
        throw new Error('Product not found');
      }
      return Promise.resolve(product);
    }

    try {
      return await this.request<Product>(`/products/${identifier}`);
    } catch (error) {
      if (error instanceof Error && error.message === 'BACKEND_NOT_RUNNING') {
        console.log('Falling back to mock data');
        const product = getMockProduct(identifier);
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      }
      throw error;
    }
  }

  // ========== CONTENT ==========
  async getContent() {
    return this.request<Record<string, any>>('/content');
  }

  async getContentByKey(key: string) {
    return this.request<any>(`/content/${key}`);
  }

  // ========== LEADS ==========
  async submitLead(data: LeadSubmission) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    if (data.company) formData.append('company', data.company);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('message', data.message);

    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    return this.requestFormData<{ message: string; id: number }>(
      '/leads',
      formData
    );
  }
}

// ========== TYPES ==========
export interface Product {
  id: number;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  mainImage: string;
  images: string[];
  description: string;
  moq: string;
  sampleLeadTime: string;
  bulkLeadTime: string;
  material: string;
  process: string;
  capacity: string;
  packaging: string;
  customOptions: string[];
  tags: string[];
  price?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  files?: File[];
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);