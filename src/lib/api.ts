import axios from 'axios';
import { BASE_API_URL } from './constants';
import authService from './auth.service';

const API_URL = `${BASE_API_URL}dashboard`;

export interface SalesData {
    date: string;
    amount: number;
}

export interface RidgelineCategoryData {
    category: string;
    values: { x: number; y: number }[];
}

export const fetchSalesData = async (periodType: string): Promise<SalesData[]> => {
    const token = authService.getCurrentUser();
    const response = await axios.get(`${API_URL}/sales`, {
        params: { periodType },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const fetchCategoryTrendData = async (): Promise<RidgelineCategoryData[]> => {
    const token = authService.getCurrentUser();
    const response = await axios.get(`${API_URL}/category-trends`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}; 