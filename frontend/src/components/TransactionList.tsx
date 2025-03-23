import { useState, useEffect } from 'react';
import { getTransactions } from '../api/transactions';
import { Transaction } from '../types/transaction';
import { TransactionFilters } from './TransactionFilters';
import { CreateTransaction } from './CreateTransaction';

interface FilterState {
  type?: 'credit' | 'debit';
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
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

export const TransactionList = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginatedResponse | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    type: undefined,
    startDate: undefined,
    endDate: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getTransactions({
        page,
        limit: 10,
        ...filters,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && page > 1) {
      setPage(page - 1);
    } else if (e.key === 'ArrowRight' && data?.pagination && page < data.pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const formatAmount = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(numAmount) ? numAmount.toFixed(2) : '0.00';
  };

  const handleSort = (column: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (filters.sortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return filters.sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-gray-700 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-gray-700 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const TableSkeleton = () => {
    const rowCount = data?.data.length || 3;
    
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  <div className="w-4 h-4 ml-1 bg-gray-300 rounded"></div>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  <div className="w-4 h-4 ml-1 bg-gray-300 rounded"></div>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="w-4 h-4 ml-1 bg-gray-300 rounded"></div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(rowCount)].map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-200 w-16 h-6"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
        </div>

        <TransactionFilters filters={filters} onFilterChange={setFilters} />
        
        <TableSkeleton />

        <div className="flex justify-between items-center mt-4">
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="text-4xl font-bold text-gray-800">Transactions</h1>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TransactionFilters filters={filters} onFilterChange={setFilters} />
          <div className="flex items-center rounded-lg gap-2">
            <button
              onClick={fetchTransactions}
              className="p-2.5 text-black bg-white rounded-l-lg transition-colors border-r border-gray-300"
              title="Refresh transactions"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2.5 text-black bg-white rounded-r-lg border-r border-gray-300 transition-colors"
              title="Create new transaction"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Create Transaction</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CreateTransaction
                onTransactionCreated={(newTransaction) => {
                  // Optimistic update
                  if (data) {
                    setData({
                      ...data,
                      data: [newTransaction, ...data.data].slice(0, data.pagination.limit),
                      pagination: {
                        ...data.pagination,
                        totalItems: data.pagination.totalItems + 1,
                        totalPages: Math.ceil((data.pagination.totalItems + 1) / data.pagination.limit)
                      }
                    });
                  }
                  setShowCreateModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center">
                  Type
                  <SortIcon column="type" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon column="timestamp" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data.map((transaction: Transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    ${formatAmount(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg
            ${page === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <span className="text-sm text-gray-700">
          Page {page} of {data?.pagination.totalPages || 1}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={!data?.pagination || page >= data.pagination.totalPages}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg
            ${!data?.pagination || page >= data.pagination.totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
        >
          Next
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 