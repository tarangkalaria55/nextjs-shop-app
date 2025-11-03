import { cacheLife, cacheTag } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { getGuestId } from "@/lib/guest";

export const getCart = async () => {
  "use cache: private";

  cacheTag("get-cart");
  cacheLife("max");

  const guestId = await getGuestId();
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    const userId = session.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
      include: {
        items: {
          include: { product: true },
          // select: { id: true, cartId: true, quantity: true },
        },
      },
    });

    if (cart) {
      return {
        ...cart,
        isGuestCart: false,
        cartItemsCount: cart.items.length,
        cartQtyCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        cartTotalPrice: cart.items.reduce(
          (acc, item) => acc + item.quantity * item.product.price,
          0,
        ),
      };
    }
  } else {
    const cart = await prisma.guestCart.findFirst({
      where: { guestId },
      include: {
        items: {
          include: { product: true },
          // select: { id: true, guestCartId: true, quantity: true },
        },
      },
    });

    if (cart) {
      return {
        ...cart,
        isGuestCart: false,
        cartItemsCount: cart.items.length,
        cartQtyCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        cartTotalPrice: cart.items.reduce(
          (acc, item) => acc + item.quantity * item.product.price,
          0,
        ),
      };
    }
  }

  return null;
};
