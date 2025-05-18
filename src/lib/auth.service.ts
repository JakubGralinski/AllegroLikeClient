import axios from "axios";
import Cookies from "js-cookie";
import {JWT_TOKEN_COOKIE_NAME} from "./constants.ts";

const API_URL = "http://localhost:8080/api/auth";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      if (response.data.token) {
        Cookies.set(JWT_TOKEN_COOKIE_NAME, response.data.token, { expires: 1 });
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data || "Login failed");
      }
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/registerUser`, data);
      if (response.data.token) {
        Cookies.set(JWT_TOKEN_COOKIE_NAME, response.data.token, { expires: 1 });
      }
      return response.data;
    } catch (error: any) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      if (error.response) {
        throw new Error(error.response.data || "Registration failed");
      }
      throw error;
    }
  }

  logout(): void {
    Cookies.remove(JWT_TOKEN_COOKIE_NAME);
  }

  getCurrentUser(): string | undefined {
    return Cookies.get(JWT_TOKEN_COOKIE_NAME);
  }

  async checkCurrentUserToken(token: string): Promise<AuthResponse | null> {
    try {
      const response = await axios.get(`${API_URL}/checkToken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data;
      return {
        token,
        role: user.role,
        username: user.username,
      };
    } catch (error) {
      console.error("Token check failed", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}

export default new AuthService();
