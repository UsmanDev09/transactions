import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If it's a POST/PUT/PATCH request, validate the body directly
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        await schema.parseAsync(req.body);
      } else {
        // For other requests, validate query and params
        await schema.parseAsync({
          query: req.query,
          params: req.params,
        });
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.errors,
        });
      }
      return next(error);
    }
  };
}; 