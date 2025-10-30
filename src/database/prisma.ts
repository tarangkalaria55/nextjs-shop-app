import "server-only";

import { withAccelerate } from "@prisma/extension-accelerate";
import type { PrismaClient as NodePrismaClient } from "@/generated/prisma";
import type { PrismaClient as EdgePrismaClient } from "@/generated/prisma/edge";

const prismaClientSingleton = () => {
  // Detect runtime: Next.js automatically sets NEXT_RUNTIME='edge' for Edge routes
  const isEdge =
    typeof process !== "undefined" && process.env.NEXT_RUNTIME === "edge";

  const PrismaClientConstructor: {
    new (options?: ConstructorParameters<typeof NodePrismaClient>[0]): DbType;
  } = isEdge
    ? require("@/generated/prisma/edge").PrismaClient
    : require("@/generated/prisma").PrismaClient;

  const prisma = new PrismaClientConstructor({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
  return prisma;
};

const prisma = prismaClientSingleton();

export default prisma;

export type DbType = NodePrismaClient | EdgePrismaClient;
