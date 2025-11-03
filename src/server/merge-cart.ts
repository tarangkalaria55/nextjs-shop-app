"use server";

import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { getGuestId } from "@/lib/guest";

export const mergeCart = async () => {
  const guestId = await getGuestId();
  const session = await auth.api.getSession({ headers: await headers() });

  console.log("Merging carts...", guestId, session?.user.id);

  if (session?.user) {
    const userId = session.user.id;

    const guestCart = await prisma.guestCart.findFirst({
      where: { guestId },
      include: { items: true },
    });

    if (guestCart) {
      if (guestCart.items.length !== 0) {
        let userCart = await prisma.cart.findFirst({
          where: { userId },
        });

        if (!userCart) {
          userCart = await prisma.cart.create({
            data: { userId },
          });
        }

        for (const item of guestCart.items) {
          await prisma.cartItem.upsert({
            where: {
              cartId_productId: {
                cartId: userCart.id,
                productId: item.productId,
              },
            },
            create: {
              cartId: userCart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
            update: { quantity: { increment: item.quantity } },
          });
        }
      }

      await prisma.guestCart.delete({
        where: { id: guestCart.id },
      });
    }
  }
};
