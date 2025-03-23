import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import supabase from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { CreateTransactionInput, TransactionParams, TransactionQuery } from '../schemas/transaction.schema';

export const createTransaction = asyncHandler(async (req: Request<{}, {}, CreateTransactionInput>, res: Response) => {
  const { amount, type, timestamp } = req.body;
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({ amount, type, timestamp })
    .select()
    .single();

  if (error) throw new AppError(400, error.message);

  res.status(201).json({
    status: 'success',
    data,
  });
});

export const getAllTransactions = asyncHandler(async (req: Request<{}, {}, {}, TransactionQuery>, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'timestamp',
    sortOrder = 'desc',
    type,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  } = req.query;

  const offset = (page - 1) * limit;

  let query = supabase
    .from('transactions')
    .select('*', { count: 'exact' });

  // Apply filters
  if (type) {
    query = query.eq('type', type);
  }
  if (startDate) {
    query = query.gte('timestamp', startDate);
  }
  if (endDate) {
    query = query.lte('timestamp', endDate);
  }
  if (minAmount) {
    query = query.gte('amount', minAmount);
  }
  if (maxAmount) {
    query = query.lte('amount', maxAmount);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const { data, error, count } = await query
    .range(offset, offset + limit - 1);

  if (error) throw new AppError(400, error.message);

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  res.json({
    status: 'success',
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  });
});

export const getTransactionById = asyncHandler(async (req: Request<TransactionParams>, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new AppError(404, 'Transaction not found');

  res.json({
    status: 'success',
    data,
  });
}); 