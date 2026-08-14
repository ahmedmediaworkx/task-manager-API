import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { config } from './config';
import { AuthRequest } from './types';

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { sub?: string };
    if (!payload.sub) throw new Error('Invalid subject');
    req.userId = payload.sub;
    next();
  } catch { return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } }); }
}

export function errors(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details: error.flatten() } });
  console.error(error);
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
}

export function requireUser(req: AuthRequest): string {
  if (!req.userId) throw new Error('Authentication middleware did not set user');
  return req.userId;
}
