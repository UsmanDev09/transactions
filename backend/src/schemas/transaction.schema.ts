import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['credit', 'debit'], {
    errorMap: () => ({ message: 'Type must be either credit or debit' }),
  }),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
});

export const transactionParamsSchema = z.object({
  id: z.string().uuid('Invalid transaction ID'),
});

export const transactionQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  sortBy: z.enum(['amount', 'type', 'timestamp']).default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  type: z.enum(['credit', 'debit']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.string().transform(Number).optional(),
  maxAmount: z.string().transform(Number).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type TransactionParams = z.infer<typeof transactionParamsSchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>; 