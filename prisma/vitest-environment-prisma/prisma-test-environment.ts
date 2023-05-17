import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { Environment } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL enviroment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);

    process.env.DATABASE_URL = databaseURL;

    execSync('npx prisma migrate deploy'); // Aqui faço o deploy pois não quero que o prisma veja se tem coisa nova no banco

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await prisma.$disconnect();
      }, // O teardown é o que quero executar depois de cada teste

    };
  }
};