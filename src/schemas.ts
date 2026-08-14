import { z } from 'zod';
export const id = z.object({ projectId: z.string().uuid() });
export const taskId = z.object({ taskId: z.string().uuid() });
export const register = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(8).max(72), name: z.string().trim().min(1).max(100) });
export const login = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(1).max(72) });
export const projectBody = z.object({ name: z.string().trim().min(1).max(150), description: z.string().trim().max(2000).nullable().optional() });
export const taskBody = z.object({ title: z.string().trim().min(1).max(200), description: z.string().trim().max(5000).nullable().optional(), status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(), priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(), dueDate: z.coerce.date().nullable().optional() });
export const taskQuery = z.object({ status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(), priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(), search: z.string().trim().max(200).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20), sort: z.enum(['createdAt', 'dueDate', 'priority', 'title']).default('createdAt'), order: z.enum(['asc', 'desc']).default('desc') });
