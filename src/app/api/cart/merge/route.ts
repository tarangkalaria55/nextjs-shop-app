import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { getGuestId } from "@/lib/guest";

export async function POST(_request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const guestId = await getGuestId();
  const userId = session.user.id;

  // Fetch guest cart
  const guestCart = await prisma.guestCart.findUnique({
    where: { guestId },
    include: { items: true },
  });
  if (!guestCart) return new Response("No guest cart", { status: 200 });

  // Get or create user cart
  let userCart = await prisma.cart.findUnique({ where: { userId } });
  if (!userCart) {
    userCart = await prisma.cart.create({ data: { userId } });
  }

  // Merge items
  for (const item of guestCart.items) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: userCart.id, productId: item.productId },
      },
      update: { quantity: { increment: item.quantity } },
      create: {
        cartId: userCart.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    });
  }

  // Delete guest cart
  await prisma.guestCart.delete({ where: { guestId } });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
