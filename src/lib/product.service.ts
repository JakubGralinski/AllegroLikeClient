import axios from "axios";
import authService from "./auth.service";
import { BASE_API_URL } from "./constants";
import { Product, Result } from "./types";
import { handleApiResponseError } from "./utils";

const API_URL = `${BASE_API_URL}products`;

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  sellerId: number;
  categoryId: number;
}

class ProductService {
  async getAllProducts(
    filters: ProductFilters = {},
  ): Promise<Result<Product[]>> {
    const token = authService.getCurrentUser();
    try {
      const response = await axios.get(API_URL, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        isSuccess: true,
        content: response.data,
      };
    } catch (err: any) {
      return handleApiResponseError(err);
    }
  }

  async getProductById(id: number): Promise<Result<Product>> {
    const token = authService.getCurrentUser();

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        isSuccess: true,
        content: response.data,
      };
    } catch (err: any) {
      return handleApiResponseError(err);
    }
  }

  async createProduct(
    product: CreateProductRequest,
    productImage: File,
  ): Promise<Result<Product>> {
    const token = authService.getCurrentUser();
    const formDataPayload = new FormData();
    const productDataBlob = new Blob([JSON.stringify(product)], {
      type: "application/json",
    });

    formDataPayload.append("productData", productDataBlob);
    formDataPayload.append("productImage", productImage);

    try {
      const response = await axios.post(API_URL, formDataPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        isSuccess: true,
        content: response.data,
      };
    } catch (err: any) {
      return handleApiResponseError(err);
    }
  }

  async updateProduct(
    id: number,
    product: Partial<Product>,
  ): Promise<Result<Product>> {
    const token = authService.getCurrentUser();

    try {
      const response = await axios.put(`${API_URL}/${id}`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        isSuccess: true,
        content: response.data,
      };
    } catch (err: any) {
      return handleApiResponseError(err);
    }
  }

  async deleteProduct(id: number): Promise<Result<void>> {
    const token = authService.getCurrentUser();

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        isSuccess: true,
        content: undefined,
      };
    } catch (err: any) {
      return handleApiResponseError(err);
    }
  }
}

export default new ProductService();
