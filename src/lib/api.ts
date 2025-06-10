import axios from 'axios';
import Cookies from 'js-cookie';
import { SalesData } from '../components/AdminDashboard'; // Assuming SalesData is exported
import { JWT_TOKEN_COOKIE_NAME } from './constants';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust if your backend runs on a different port/host

const getAuthHeaders = () => {
  const token = Cookies.get(JWT_TOKEN_COOKIE_NAME);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchSalesData = async (periodType: string): Promise<SalesData[]> => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/sales`, {
    params: { periodType },
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Define interfaces for Ridgeline Chart data to match frontend expectations
export interface RidgelinePoint {
    x: number;
    y: number;
}

export interface RidgelineCategoryData {
    category: string;
    values: RidgelinePoint[];
}

export const fetchCategoryTrendData = async (): Promise<RidgelineCategoryData[]> => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/category-trends`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}; 