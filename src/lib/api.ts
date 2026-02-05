/**
 * API Client
 * 统一封装所有后端API调用
 */

import { getMockProducts, getMockProduct } from './mockData';
import { API_BASE_URL } from '../config/api';

// Use mock data as fallback when API fails
const ENABLE_MOCK_FALLBACK = true;

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
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.featured) query.append('featured', 'true');

      const queryString = query.toString();
      const products = await this.request<Product[]>(
        `/products${queryString ? `?${queryString}` : ''}`
      );

      // If API returns empty array and fallback is enabled, use mock data
      if (products.length === 0 && ENABLE_MOCK_FALLBACK) {
        console.log('No products in database, using mock data');
        return getMockProducts(params);
      }

      return products;
    } catch (error) {
      // Fallback to mock data on any error
      if (ENABLE_MOCK_FALLBACK) {
        console.log('API error, falling back to mock data:', error);
        return getMockProducts(params);
      }
      throw error;
    }
  }

  async getProduct(identifier: string | number) {
    try {
      return await this.request<Product>(`/products/${identifier}`);
    } catch (error) {
      // Fallback to mock data on any error
      if (ENABLE_MOCK_FALLBACK) {
        console.log('API error, falling back to mock data:', error);
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

  // ========== ADMIN API ==========
  // 需要传入 token 的请求
  private async authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Admin - Products
  async adminGetProducts(token: string, params?: { category?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    
    const queryString = query.toString();
    return this.authenticatedRequest<Product[]>(
      `/admin/products${queryString ? `?${queryString}` : ''}`,
      token
    );
  }

  async adminGetProduct(token: string, id: number) {
    return this.authenticatedRequest<Product>(`/admin/products/${id}`, token);
  }

  async adminCreateProduct(token: string, data: Partial<Product>) {
    return this.authenticatedRequest<Product>('/admin/products', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateProduct(token: string, id: number, data: Partial<Product>) {
    return this.authenticatedRequest<Product>(`/admin/products/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async adminDeleteProduct(token: string, id: number) {
    return this.authenticatedRequest<{ message: string }>(`/admin/products/${id}`, token, {
      method: 'DELETE',
    });
  }

  // Admin - Content
  async adminGetContent(token: string) {
    return this.authenticatedRequest<ContentItem[]>('/admin/content', token);
  }

  async adminGetContentByKey(token: string, key: string) {
    return this.authenticatedRequest<ContentItem>(`/admin/content/${key}`, token);
  }

  async adminUpdateContent(token: string, key: string, value: any) {
    return this.authenticatedRequest<ContentItem>(`/admin/content/${key}`, token, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async adminDeleteContent(token: string, key: string) {
    return this.authenticatedRequest<{ message: string; key: string }>(`/admin/content/${key}`, token, {
      method: 'DELETE',
    });
  }

  // Admin - Leads
  async adminGetLeads(token: string, params?: { status?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    
    const queryString = query.toString();
    return this.authenticatedRequest<Lead[]>(
      `/admin/leads${queryString ? `?${queryString}` : ''}`,
      token
    );
  }

  async adminGetLead(token: string, id: number) {
    return this.authenticatedRequest<Lead>(`/admin/leads/${id}`, token);
  }

  async adminUpdateLead(token: string, id: number, status: string) {
    return this.authenticatedRequest<Lead>(`/admin/leads/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
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

export interface ContentItem {
  id: number;
  key: string;
  value: any;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  files: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);