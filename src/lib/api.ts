import axios from 'axios';
import { SalesData } from '../components/AdminDashboard'; // Assuming SalesData is exported

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust if your backend runs on a different port/host

export const fetchSalesData = async (periodType: string): Promise<SalesData[]> => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/sales`, { params: { periodType } });
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
  const response = await axios.get(`${API_BASE_URL}/dashboard/category-trends`);
  return response.data;
}; 