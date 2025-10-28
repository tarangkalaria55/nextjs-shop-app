import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
  });
  return new Response(JSON.stringify(addresses), { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });
  const { street, city, state, zip, country, isDefault } = await req.json();
  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      street,
      city,
      state,
      zip,
      country,
      isDefault: isDefault || false,
    },
  });
  return new Response(JSON.stringify(address), { status: 201 });
}
