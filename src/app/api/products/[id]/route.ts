import type { NextRequest } from "next/server";
import prisma from "@/database/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      description: true,
      stock: true,
    },
  });
  if (!product) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(product), { status: 200 });
}
