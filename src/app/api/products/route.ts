import type { NextRequest } from "next/server";
import prisma from "@/database/prisma";

export async function GET(req: NextRequest) {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      description: true,
      stock: true, // Optional: Show availability
    },
  });
  return new Response(JSON.stringify(products), { status: 200 });
}
