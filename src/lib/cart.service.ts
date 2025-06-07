import axios from "axios";
import authService from "./auth.service";
import { BASE_API_URL } from "./constants";
import { Cart, Result } from "./types";
import { handleApiResponseError } from "./utils";

const API_URL = `${BASE_API_URL}cart`;

class CartService {
  async getCart(): Promise<Result<Cart>> {
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

  async addItemToCart(
    productId: number,
    quantity: number,
  ): Promise<Result<Cart>> {
    const token = authService.getCurrentUser();
    const url = `${API_URL}/items?productId=${productId}&quantity=${quantity}`;

    try {
      const response = await axios.post(url, null, {
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

  async updateCartItem(
    cartItemId: number,
    quantity: number,
  ): Promise<Result<Cart>> {
    const token = authService.getCurrentUser();
    const url = `${API_URL}/items/${cartItemId}?quantity=${quantity}`;

    try {
      const response = await axios.patch(url, null, {
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

  async removeCartItem(cartItemId: number): Promise<Result<Cart>> {
    const token = authService.getCurrentUser();
    const url = `${API_URL}/items/${cartItemId}`;

    try {
      const response = await axios.delete(url, {
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

  async clearCart(): Promise<Result<Cart>> {
    const token = authService.getCurrentUser();
    const url = `${API_URL}/clear`;

    try {
      const response = await axios.post(url, null, {
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

export default new CartService();
