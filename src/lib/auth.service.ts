import axios from "axios";
import Cookies from "js-cookie";

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
  type: string;
  username: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 1 });
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
      console.log("Sending registration data:", data);
      const response = await axios.post(`${API_URL}/registerUser`, data);
      console.log("Registration response:", response.data);
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 1 });
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
    Cookies.remove("token");
  }

  getCurrentUser(): string | undefined {
    return Cookies.get("token");
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
        type: "Bearer",
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
