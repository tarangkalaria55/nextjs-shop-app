"use server";

import { headers } from "next/headers";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { stripeServer } from "@/lib/stripe-server";
import type { AddressInput } from "@/types/address-input";

export async function placeOrder(
  address: AddressInput,
  paymentIntentId: string,
) {
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

  // Upsert address
  const savedAddress = await prisma.address.upsert({
    where: { id: address.id || "" },
    update: {
      ...address,
      userId: user.id,
    },
    create: {
      ...address,
      userId: user.id,
    },
  });

  // Create Order With Items
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      addressId: savedAddress.id,
      total,
      paymentIntentId: paymentIntentId,
      status: "payment_pending",
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  cart.items.forEach(async (item) => {
    await prisma.product.update({
      data: { stock: { decrement: item.quantity } },
      where: { id: item.productId },
    });
  });

  // Clear Cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  // Update Stripe PaymentIntent
  await stripeServer.paymentIntents.update(paymentIntentId, {
    metadata: { userId: user.id, orderId: order.id },
  });

  return order.id;
}
