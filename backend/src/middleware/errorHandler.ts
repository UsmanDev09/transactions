import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { PostgrestError } from '@supabase/supabase-js';

// Custom error types
export class AppError extends Error {
  constructor(public statusCode: number, message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(503, message, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(400, message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// Error response interface
interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  details?: any;
  stack?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details
  console.error('Error Details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  const errorResponse: ErrorResponse = {
    status: 'error',
    message: 'Internal server error',
  };

  // Handle different types of errors
  if (err instanceof ZodError) {
    errorResponse.message = 'Validation error';
    errorResponse.code = 'VALIDATION_ERROR';
    errorResponse.details = err.errors;
    return res.status(400).json(errorResponse);
  }

  if (err instanceof AppError) {
    errorResponse.message = err.message;
    errorResponse.code = err.code;
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle Supabase errors
  if (err instanceof PostgrestError) {
    errorResponse.message = 'Database operation failed';
    errorResponse.code = 'DATABASE_ERROR';
    errorResponse.details = err.message;
    return res.status(503).json(errorResponse);
  }

  // Handle rate limit errors
  if (err.name === 'RateLimitError') {
    errorResponse.message = 'Too many requests';
    errorResponse.code = 'RATE_LIMIT_EXCEEDED';
    return res.status(429).json(errorResponse);
  }

  // Add stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Return generic error for unhandled cases
  return res.status(500).json(errorResponse);
}; 