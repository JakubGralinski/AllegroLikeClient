import axios from "axios";
import authService from "./auth.service";
import { BASE_API_URL } from "./constants";
import { Order, Result } from "./types";
import { handleApiResponseError } from "./utils";

const API_URL = `${BASE_API_URL}orders`;

export type CreateShippingAddressPayload = {
  city: string;
  country: string;
  street: string;
  houseNumber: string;
} | null;

class OrderService {
  async getAllOrders(): Promise<Result<Order[]>> {
    const token = authService.getCurrentUser();

    try {
      const response = await axios.get(API_URL, {
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

  async createOrderFromUserCart(
    userId: number,
    createShippingAddressPayload: CreateShippingAddressPayload,
  ): Promise<Result<Order>> {
    const token = authService.getCurrentUser();
    const url = `${API_URL}/users/${userId}`;

    try {
      const response = await axios.post(url, createShippingAddressPayload, {
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

  async getAllOrdersByUserId(userId: number): Promise<Result<Order[]>> {
    const token = authService.getCurrentUser();
    const url = `${API_URL}/users/${userId}`;

    try {
      const response = await axios.get(url, {
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

  async addProductToOrder(
    orderId: number,
    productId: number,
    quantity: number | null,
  ): Promise<Result<Order>> {
    const token = authService.getCurrentUser();
    let url = `${API_URL}/${orderId}/products/${productId}`;
    if (quantity) {
      url += `?quantity=${quantity}`;
    }

    try {
      const response = await axios.put(url, null, {
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
}

export default new OrderService();
