
import config from "@/config/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAdapter: PrismaPg | undefined;
};

const adapter =
  globalForPrisma.prismaAdapter ??
  new PrismaPg({
    connectionString: config.POSTGRES_URL,
    max: config.POSTGRES_POOL_MAX,
    idleTimeoutMillis: config.POSTGRES_POOL_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: config.POSTGRES_POOL_CONNECTION_TIMEOUT_MS,
  });

const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (!globalForPrisma.prismaAdapter) {
  globalForPrisma.prismaAdapter = adapter;
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
