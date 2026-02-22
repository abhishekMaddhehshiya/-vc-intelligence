import axios, { AxiosError } from 'axios';
import { EnrichmentData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for enrichment
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EnrichmentResponse {
  success: boolean;
  data?: EnrichmentData;
  error?: string;
}

export const enrichCompany = async (url: string): Promise<EnrichmentResponse> => {
  try {
    const response = await api.post<EnrichmentData>('/enrich', { url });
    return {
      success: true,
      data: {
        ...response.data,
        enrichedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    const errorMessage =
      axiosError.response?.data?.error ||
      axiosError.message ||
      'Failed to enrich company data';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export default api;
