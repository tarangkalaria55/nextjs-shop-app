"use server";

import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { stripeServer } from "@/lib/stripe-server";

export const createStripeCustomer = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Authentication required");
  }
  const user = session.user;

  const currentUser = await prisma.user.findFirst({
    where: { id: user.id },
  });

  let createNewStripeCustomer = false;

  if (currentUser) {
    if (currentUser.stripeCustomerId) {
      try {
        const stripeCustomer = await await stripeServer.customers.retrieve(
          currentUser.stripeCustomerId,
        );
        createNewStripeCustomer = !stripeCustomer || !!stripeCustomer.deleted;
      } catch {
        createNewStripeCustomer = true;
      }

      if (createNewStripeCustomer) {
        const stripeCustomer = await stripeServer.customers.create({
          name: user.name,
          email: user.email,
        });

        await prisma.user.update({
          data: { stripeCustomerId: stripeCustomer.id },
          where: { id: user.id },
        });

        user.stripeCustomerId = stripeCustomer.id;
        currentUser.stripeCustomerId = stripeCustomer.id;
      }
    }
  }
};
