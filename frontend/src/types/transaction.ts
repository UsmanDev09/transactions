export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  timestamp: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: any[];
} 