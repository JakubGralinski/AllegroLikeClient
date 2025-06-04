import axios from "axios";
import authService from "./auth.service";
import { BASE_API_URL } from "./constants";
import { Category, Result } from "./types";
import { handleApiResponseError } from "./utils";

const API_URL = `${BASE_API_URL}categories`;

export interface CreateCategoryPayload {
  name: string;
  parentCategoryId: number | null;
}

class CategoryService {
  async getAllCategories(): Promise<Result<Category[]>> {
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

  async createCategory(
    createCategoryPayload: CreateCategoryPayload,
  ): Promise<Result<Category>> {
    const token = authService.getCurrentUser();

    try {
      const response = await axios.post(API_URL, createCategoryPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

export default new CategoryService();
