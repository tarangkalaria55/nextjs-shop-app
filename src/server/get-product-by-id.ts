"use server";

import prisma from "@/database/prisma";

export async function getProductById(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  return product;
}
