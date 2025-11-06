"use server";

import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { stripeServer } from "@/lib/stripe-server";

export const createPaymentIntent = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Authentication required");
  }
  const user = session.user;

  const currentUser = await prisma.user.findFirst({
    where: { id: user.id },
  });

  if (currentUser && !currentUser.stripeCustomerId) {
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

  // Fetch cart with product data
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate total
  const total = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  // Create Stripe PaymentIntent
  const paymentIntent = await stripeServer.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "usd",
    payment_method_types: ["card"],
    metadata: { userId: user.id },
    customer: user.stripeCustomerId ?? "",
    receipt_email: user.email,
  });

  return {
    paymentIntent: {
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    },
  };
};
