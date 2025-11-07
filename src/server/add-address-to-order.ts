"use server";

import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import type { AddressInput } from "@/types/address-input";

export const addAddressToOrder = async (
  orderId: string,
  address: AddressInput,
) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  // Add address
  await prisma.orderAddress.upsert({
    where: { orderId: orderId },
    update: {
      ...address,
    },
    create: {
      ...address,
      orderId: orderId,
    },
  });
};
