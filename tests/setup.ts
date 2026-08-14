process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/task_manager_test?schema=public';
process.env.JWT_SECRET ??= 'test-secret-that-is-at-least-thirty-two-characters';
process.env.NODE_ENV = 'test';
