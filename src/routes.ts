import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db';
import { config } from './config';
import { auth, requireUser } from './middleware';
import { id, login, projectBody, register, taskBody, taskId, taskQuery } from './schemas';
import { AuthRequest } from './types';

const router = Router();
const parse = <T>(schema: { parse: (value: unknown) => T }, value: unknown) => schema.parse(value);
const tokenFor = (id: string) => jwt.sign({}, config.JWT_SECRET, { subject: id, expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions);
const publicUser = (user: { id: string; email: string; name: string; createdAt: Date }) => ({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });

router.post('/auth/register', async (req, res) => {
  const input = parse(register, req.body);
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email is already registered' } });
  const user = await prisma.user.create({ data: { email: input.email, name: input.name, passwordHash: await bcrypt.hash(input.password, 12) }, select: { id: true, email: true, name: true, createdAt: true } });
  return res.status(201).json({ user: publicUser(user), token: tokenFor(user.id) });
});

router.post('/auth/login', async (req, res) => {
  const input = parse(login, req.body);
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  return res.json({ user: publicUser(user), token: tokenFor(user.id) });
});

router.get('/auth/me', auth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: requireUser(req) }, select: { id: true, email: true, name: true, createdAt: true } });
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  return res.json({ user: publicUser(user) });
});

router.use(auth);
router.get('/projects', async (req: AuthRequest, res) => res.json({ projects: await prisma.project.findMany({ where: { ownerId: requireUser(req) }, orderBy: { createdAt: 'desc' }, include: { _count: { select: { tasks: true } } } }) }));
router.post('/projects', async (req: AuthRequest, res) => { const project = await prisma.project.create({ data: { ...parse(projectBody, req.body), ownerId: requireUser(req) } }); return res.status(201).json({ project }); });
router.get('/projects/:projectId', async (req: AuthRequest, res) => { const project = await prisma.project.findFirst({ where: { id: parse(id, req.params).projectId, ownerId: requireUser(req) }, include: { _count: { select: { tasks: true } } } }); if (!project) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }); return res.json({ project }); });
router.patch('/projects/:projectId', async (req: AuthRequest, res) => { const params = parse(id, req.params); const ownerId = requireUser(req); const found = await prisma.project.findFirst({ where: { id: params.projectId, ownerId } }); if (!found) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }); return res.json({ project: await prisma.project.update({ where: { id: found.id }, data: parse(projectBody.partial(), req.body) }) }); });
router.delete('/projects/:projectId', async (req: AuthRequest, res) => { const found = await prisma.project.findFirst({ where: { id: parse(id, req.params).projectId, ownerId: requireUser(req) } }); if (!found) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }); await prisma.project.delete({ where: { id: found.id } }); return res.status(204).send(); });

router.get('/projects/:projectId/tasks', async (req: AuthRequest, res) => { const { projectId } = parse(id, req.params); const ownerId = requireUser(req); const query = parse(taskQuery, req.query); const project = await prisma.project.findFirst({ where: { id: projectId, ownerId } }); if (!project) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }); const where = { projectId, ...(query.status && { status: query.status }), ...(query.priority && { priority: query.priority }), ...(query.search && { OR: [{ title: { contains: query.search, mode: 'insensitive' as const } }, { description: { contains: query.search, mode: 'insensitive' as const } }] }) }; const [tasks, total] = await Promise.all([prisma.task.findMany({ where, orderBy: { [query.sort]: query.order }, skip: (query.page - 1) * query.limit, take: query.limit }), prisma.task.count({ where })]); return res.json({ tasks, pagination: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) } }); });
router.post('/projects/:projectId/tasks', async (req: AuthRequest, res) => { const { projectId } = parse(id, req.params); const project = await prisma.project.findFirst({ where: { id: projectId, ownerId: requireUser(req) } }); if (!project) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }); return res.status(201).json({ task: await prisma.task.create({ data: { ...parse(taskBody, req.body), projectId } }) }); });
router.get('/tasks/:taskId', async (req: AuthRequest, res) => { const task = await prisma.task.findFirst({ where: { id: parse(taskId, req.params).taskId, project: { ownerId: requireUser(req) } } }); if (!task) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } }); return res.json({ task }); });
router.patch('/tasks/:taskId', async (req: AuthRequest, res) => { const found = await prisma.task.findFirst({ where: { id: parse(taskId, req.params).taskId, project: { ownerId: requireUser(req) } } }); if (!found) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } }); return res.json({ task: await prisma.task.update({ where: { id: found.id }, data: parse(taskBody.partial(), req.body) }) }); });
router.delete('/tasks/:taskId', async (req: AuthRequest, res) => { const found = await prisma.task.findFirst({ where: { id: parse(taskId, req.params).taskId, project: { ownerId: requireUser(req) } } }); if (!found) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } }); await prisma.task.delete({ where: { id: found.id } }); return res.status(204).send(); });
export default router;
