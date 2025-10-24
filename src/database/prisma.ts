import { withAccelerate } from "@prisma/extension-accelerate";
import type { PrismaClient as NodePrismaClient } from "@/generated/prisma";
import type { PrismaClient as EdgePrismaClient } from "@/generated/prisma/edge";

// Detect runtime: Next.js automatically sets NEXT_RUNTIME='edge' for Edge routes
const isEdge =
  typeof process !== "undefined" && process.env.NEXT_RUNTIME === "edge";

export type DbType = NodePrismaClient | EdgePrismaClient;

// Choose constructor dynamically but keep type safety
const PrismaClientConstructor: {
  new (options?: ConstructorParameters<typeof NodePrismaClient>[0]): DbType;
} = isEdge
  ? require("@/generated/prisma/edge").PrismaClient
  : require("@/generated/prisma").PrismaClient;

const globalForPrisma = global as unknown as {
  prisma: DbType;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClientConstructor({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
