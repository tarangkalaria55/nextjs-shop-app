import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { addressId } = await req.json();
  const order = await prisma.order.update({
    where: { id: params.id, userId: session.user.id }, // Ensure user owns order
    data: { addressId },
    include: { address: true },
  });
  return new Response(JSON.stringify(order), { status: 200 });
}
