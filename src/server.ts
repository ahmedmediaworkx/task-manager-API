import { app } from './app';
import { config } from './config';
import { prisma } from './db';

const server = app.listen(config.PORT, () => console.log(`Task Manager API listening on http://localhost:${config.PORT}`));
async function shutdown() { server.close(async () => { await prisma.$disconnect(); process.exit(0); }); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
