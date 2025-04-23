import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8080/api/auth';

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
  id: number;
  username: string;
  email: string;
  roles: string[];
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/signin`, data);
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 1 });
    }
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  }

  logout(): void {
    Cookies.remove('token');
  }

  getCurrentUser(): string | undefined {
    return Cookies.get('token');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}

export default new AuthService(); 