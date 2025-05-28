import { Result, User } from "./types.ts";
import authService from "./auth.service.ts";
import { BASE_API_URL } from "./constants.ts";
import axios from "axios";
import { handleApiResponseError } from "./utils.ts";

export interface CreateCurrentUserAddressProps {
  city: string;
  country: string;
  street: string;
  houseNumber: number;
}

export interface UpdateCurrentUserProps {
  username: string;
  email: string;
}

class UserService {
  async updateCurrentUserAddress(
    addressId: number,
    userId: number,
  ): Promise<Result<User>> {
    const jwtToken = authService.getCurrentUser();
    const url = `${BASE_API_URL}users/${userId}/address/${addressId}`;

    try {
      const response = await axios.put(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return {
        success: true,
        content: response.data,
      };
    } catch (err: any) {
      if (err.response.status === 404) {
        return {
          success: false,
          errMessage:
            "Current user was not found in the database, please relogin",
        };
      }
      return handleApiResponseError(err);
    }
  }

  async createCurrentUserAddress(
    createUserAddressProps: CreateCurrentUserAddressProps,
    userId: number,
  ): Promise<Result<User>> {
    const jwtToken = authService.getCurrentUser();
    const url = `${BASE_API_URL}users/${userId}/address`;

    try {
      const response = await axios.post(url, createUserAddressProps, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        content: response.data,
      };
    } catch (err: any) {
      if (err.response.status === 404) {
        return {
          success: false,
          errMessage:
            "Current user was not found in the database, please relogin",
        };
      }
      return handleApiResponseError(err);
    }
  }

  async updateCurrentUser(
    updateCurrentUserProps: UpdateCurrentUserProps,
    userId: number,
  ): Promise<Result<User>> {
    const jwtToken = authService.getCurrentUser();
    const url = `${BASE_API_URL}users/${userId}`;

    try {
      const response = await axios.patch(url, updateCurrentUserProps, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (err: any) {
      if (err.response.status === 404) {
        return {
          success: false,
          errMessage:
            "Current user was not found in the database, please relogin",
        };
      }
      return handleApiResponseError(err);
    }
  }
}

export default new UserService();
