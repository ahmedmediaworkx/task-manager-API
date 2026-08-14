import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({ where: { email: 'demo@example.com' }, update: {}, create: { email: 'demo@example.com', name: 'Demo User', passwordHash: await bcrypt.hash('DemoPass123!', 12) } });
  const existing = await prisma.project.findFirst({ where: { ownerId: user.id, name: 'Product Launch' } });
  if (!existing) await prisma.project.create({ data: { ownerId: user.id, name: 'Product Launch', description: 'Demo project created by the seed script', tasks: { create: [{ title: 'Draft launch checklist', priority: 'HIGH' }, { title: 'Review release notes', status: 'IN_PROGRESS', priority: 'MEDIUM' }, { title: 'Archive old assets', status: 'DONE', priority: 'LOW' }] } } });
}
main().finally(() => prisma.$disconnect());
