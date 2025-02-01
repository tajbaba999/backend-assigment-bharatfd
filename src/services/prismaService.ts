import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log('✅ PostgreSQL connection established'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err));

export { prisma };
