import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:8080/api/products';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  seller: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export interface ProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class ProductService {
  async getAllProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    const token = authService.getCurrentUser();
    const response = await axios.get(API_URL, {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const token = authService.getCurrentUser();
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'seller'>): Promise<Product> {
    const token = authService.getCurrentUser();
    const response = await axios.post(API_URL, product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const token = authService.getCurrentUser();
    const response = await axios.put(`${API_URL}/${id}`, product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    const token = authService.getCurrentUser();
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new ProductService(); 