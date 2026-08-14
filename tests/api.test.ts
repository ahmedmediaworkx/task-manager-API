import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/db';

beforeEach(async () => { await prisma.task.deleteMany(); await prisma.project.deleteMany(); await prisma.user.deleteMany(); });
afterAll(async () => prisma.$disconnect());

async function register(email = 'one@example.com') {
  const response = await request(app).post('/api/v1/auth/register').send({ email, password: 'Password123!', name: 'Test User' });
  expect(response.status).toBe(201);
  return response.body.token as string;
}

describe('authentication', () => {
  it('registers, logs in, and returns the current user', async () => {
    const token = await register();
    const login = await request(app).post('/api/v1/auth/login').send({ email: 'one@example.com', password: 'Password123!' });
    expect(login.status).toBe(200);
    expect(login.body.user).not.toHaveProperty('passwordHash');
    const me = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.body.user.email).toBe('one@example.com');
  });

  it('rejects duplicate emails and invalid credentials', async () => {
    await register();
    expect((await request(app).post('/api/v1/auth/register').send({ email: 'one@example.com', password: 'Password123!', name: 'Other' })).status).toBe(409);
    expect((await request(app).post('/api/v1/auth/login').send({ email: 'one@example.com', password: 'wrong' })).status).toBe(401);
  });
});

describe('projects and tasks', () => {
  it('creates, filters, updates, and deletes resources', async () => {
    const token = await register();
    const created = await request(app).post('/api/v1/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Launch' });
    expect(created.status).toBe(201);
    const projectId = created.body.project.id;
    const task = await request(app).post(`/api/v1/projects/${projectId}/tasks`).set('Authorization', `Bearer ${token}`).send({ title: 'Ship API', priority: 'HIGH' });
    expect(task.status).toBe(201);
    const listed = await request(app).get(`/api/v1/projects/${projectId}/tasks?priority=HIGH&search=ship`).set('Authorization', `Bearer ${token}`);
    expect(listed.body.pagination.total).toBe(1);
    const updated = await request(app).patch(`/api/v1/tasks/${task.body.task.id}`).set('Authorization', `Bearer ${token}`).send({ status: 'DONE' });
    expect(updated.body.task.status).toBe('DONE');
    expect((await request(app).delete(`/api/v1/projects/${projectId}`).set('Authorization', `Bearer ${token}`)).status).toBe(204);
    expect(await prisma.task.count()).toBe(0);
  });

  it('does not expose another user resource', async () => {
    const owner = await register('owner@example.com');
    const outsider = await register('outsider@example.com');
    const project = await request(app).post('/api/v1/projects').set('Authorization', `Bearer ${owner}`).send({ name: 'Private' });
    const task = await request(app).post(`/api/v1/projects/${project.body.project.id}/tasks`).set('Authorization', `Bearer ${owner}`).send({ title: 'Secret' });
    expect((await request(app).get(`/api/v1/projects/${project.body.project.id}`).set('Authorization', `Bearer ${outsider}`)).status).toBe(404);
    expect((await request(app).get(`/api/v1/tasks/${task.body.task.id}`).set('Authorization', `Bearer ${outsider}`)).status).toBe(404);
  });
});
