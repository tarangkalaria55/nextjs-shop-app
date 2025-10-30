"use server";

import { unstable_cache } from "next/cache";
import prisma from "@/database/prisma";
import type { Prisma } from "@/generated/prisma";

export const getProducts = unstable_cache(
  async (search: string, pageSize: number, page: number) => {
    const offset = (page - 1) * pageSize;

    const filter: Prisma.ProductWhereInput = !search.trim()
      ? {}
      : {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        };

    const products = await prisma.product.findMany({
      skip: offset,
      take: pageSize,
      where: filter,
    });

    const totalCount = await prisma.product.count({ where: filter });

    return { products, totalCount };
  },
  ["products"] as const,
  {
    revalidate: 60,
    tags: ["products"],
  },
);
