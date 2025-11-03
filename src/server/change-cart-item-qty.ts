"use server";

import prisma from "@/database/prisma";

export const ChangeCartItemQty = async (
  isGuest: boolean,
  cartItemId: string,
  newQty: number,
) => {
  if (isGuest) {
    await prisma.guestCartItem.update({
      data: { quantity: newQty },
      where: { id: cartItemId },
    });

    await prisma.guestCartItem.deleteMany({
      where: { quantity: { lte: 0 } },
    });

    await prisma.guestCart.deleteMany({ where: { items: { none: {} } } });
  } else {
    await prisma.cartItem.update({
      data: { quantity: newQty },
      where: { id: cartItemId },
    });

    await prisma.cartItem.deleteMany({
      where: { quantity: { lte: 0 } },
    });

    await prisma.cart.deleteMany({ where: { items: { none: {} } } });
  }
};
