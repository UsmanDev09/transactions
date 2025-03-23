import { Router } from 'express';
import { createTransaction, getAllTransactions, getTransactionById } from '../controllers/transaction.controller';
import { validateRequest } from '../middleware/validateRequest';
import { createTransactionSchema, transactionParamsSchema } from '../schemas/transaction.schema';

const router = Router();

router.post(
  '/',
  validateRequest(createTransactionSchema),
  createTransaction
);

router.get('/', getAllTransactions);

router.get(
  '/:id',
  validateRequest(transactionParamsSchema),
  getTransactionById
);

export default router; 