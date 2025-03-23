import axios from 'axios';
import { Transaction, ApiResponse } from '../types/transaction';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

interface TransactionFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  type?: 'credit' | 'debit';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface PaginatedResponse {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getTransactions = async (filters: TransactionFilters = {}): Promise<PaginatedResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });

  const response = await api.get<ApiResponse<Transaction[]>>(`/transactions?${params.toString()}`);
  return response.data as unknown as PaginatedResponse;
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
  if (!response.data.data) {
    throw new Error('Transaction not found');
  }
  return response.data.data;
};

export const createTransaction = async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const response = await api.post<ApiResponse<Transaction>>('/transactions', data);
  if (!response.data.data) {
    throw new Error('Failed to create transaction');
  }
  return response.data.data;
}; 