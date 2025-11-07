"use server";

import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { OrderStatus } from "@/generated/prisma";

export const createOrder = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Authentication required");
  }
  const user = session.user;

  // Fetch cart with product data
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate total
  const total = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  // Create Order With Items
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      status: OrderStatus.CHECKOUT_PENDING,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  cart.items.forEach(async (item) => {
    await prisma.product.update({
      data: { stock: { decrement: item.quantity } },
      where: { id: item.productId },
    });
  });

  // Clear Cart
  await prisma.cart.delete({ where: { id: cart.id } });

  return { ...order };
};
