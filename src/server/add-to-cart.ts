"use server";

import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { getGuestId } from "@/lib/guest";

export const addToCart = async (productId: string) => {
  const existingProduct = await prisma.product.findFirst({
    where: { id: productId },
  });

  if (existingProduct !== null) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (session?.user) {
      const userId = session.user.id;

      let existingCart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      if (!existingCart) {
        existingCart = await prisma.cart.create({
          data: {
            userId,
          },
        });
      }

      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: existingCart.id,
            productId: productId,
          },
        },
        create: {
          cartId: existingCart.id,
          productId: productId,
          quantity: 1,
        },
        update: {
          quantity: {
            increment: 0,
          },
        },
      });
    } else {
      const guestId = await getGuestId();

      let existingGuestCart = await prisma.guestCart.findFirst({
        where: {
          guestId,
        },
      });

      if (!existingGuestCart) {
        existingGuestCart = await prisma.guestCart.create({
          data: {
            guestId,
          },
        });
      }

      await prisma.guestCartItem.upsert({
        where: {
          guestCartId_productId: {
            guestCartId: existingGuestCart.id,
            productId: productId,
          },
        },
        create: {
          guestCartId: existingGuestCart.id,
          productId: productId,
          quantity: 1,
        },
        update: {
          quantity: {
            increment: 0,
          },
        },
      });
    }
  }
};
