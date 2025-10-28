import type { NextRequest } from "next/server";
import prisma from "@/database/prisma";
import { getGuestId } from "@/lib/guest";

export async function POST(request: NextRequest) {
  const { productId, quantity = 1 } = await request.json();
  const guestId = await getGuestId();

  // Get or create guest cart
  let cart = await prisma.guestCart.findUnique({ where: { guestId } });
  if (!cart) {
    cart = await prisma.guestCart.create({ data: { guestId } });
  }

  // Add/update item
  await prisma.guestCartItem.upsert({
    where: { guestCartId_productId: { guestCartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { guestCartId: cart.id, productId, quantity },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
