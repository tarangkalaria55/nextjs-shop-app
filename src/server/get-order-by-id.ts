"use server";

import prisma from "@/database/prisma";

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { address: true, items: true },
  });

  return order;
};
