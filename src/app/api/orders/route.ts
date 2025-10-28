import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } }, address: true },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(orders), { status: 200 });
}
