import type { NextRequest } from "next/server";
import prisma from "@/database/prisma";
import { getGuestId } from "@/lib/guest";

export async function GET(_request: NextRequest) {
  const guestId = await getGuestId();
  const cart = await prisma.guestCart.findUnique({
    where: { guestId },
    include: { items: { include: { product: true } } },
  });
  const formattedCart =
    cart?.items.map((item) => ({
      id: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    })) || [];
  return new Response(JSON.stringify(formattedCart), { status: 200 });
}
