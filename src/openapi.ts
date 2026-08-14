export const openapi = {
  openapi: '3.0.3',
  info: { title: 'Task Manager API', version: '1.0.0', description: 'Private projects and tasks REST API' },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Error: { type: 'object', properties: { error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } } } },
      ProjectInput: { type: 'object', required: ['name'], properties: { name: { type: 'string', maxLength: 150 }, description: { type: 'string', nullable: true } } },
      TaskInput: { type: 'object', required: ['title'], properties: { title: { type: 'string', maxLength: 200 }, description: { type: 'string', nullable: true }, status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] }, priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] }, dueDate: { type: 'string', format: 'date-time', nullable: true } } },
    },
  },
  paths: {
    '/auth/register': { post: { summary: 'Register', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password', 'name'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 }, name: { type: 'string' } } } } } }, responses: { '201': { description: 'Registered' }, '409': { description: 'Email exists' } } } },
    '/auth/login': { post: { summary: 'Log in', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } } } }, responses: { '200': { description: 'Authenticated' }, '401': { description: 'Invalid credentials' } } } },
    '/auth/me': { get: { summary: 'Current user', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Current user' } } } },
    '/projects': { get: { summary: 'List projects', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Projects' } } }, post: { summary: 'Create project', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectInput' } } } }, responses: { '201': { description: 'Created' } } } },
    '/projects/{projectId}': { parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], get: { summary: 'Get project', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Project' }, '404': { description: 'Not found' } } }, patch: { summary: 'Update project', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Updated' } } }, delete: { summary: 'Delete project', security: [{ bearerAuth: [] }], responses: { '204': { description: 'Deleted' } } } },
    '/projects/{projectId}/tasks': { parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], get: { summary: 'List and filter tasks', security: [{ bearerAuth: [] }], parameters: ['status', 'priority', 'search', 'page', 'limit', 'sort', 'order'].map((name) => ({ name, in: 'query', schema: { type: name === 'page' || name === 'limit' ? 'integer' : 'string' } })), responses: { '200': { description: 'Paginated tasks' } } }, post: { summary: 'Create task', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } }, responses: { '201': { description: 'Created' } } } },
    '/tasks/{taskId}': { parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], get: { summary: 'Get task', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Task' } } }, patch: { summary: 'Update task', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Updated' } } }, delete: { summary: 'Delete task', security: [{ bearerAuth: [] }], responses: { '204': { description: 'Deleted' } } } },
  },
};
