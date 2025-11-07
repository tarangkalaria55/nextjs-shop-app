"use server";

import { headers } from "next/headers";
import type Stripe from "stripe";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { OrderStatus } from "@/generated/prisma";
import { stripeServer } from "@/lib/stripe-server";

export const createOrderCheckoutSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Authentication required");
  }
  const user = session.user;

  if (!user.stripeCustomerId) {
    throw new Error("Stripe customer does not exist");
  }

  var result = await prisma.$transaction(async (prisma) => {
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

    // Create Order With Items
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: OrderStatus.CHECKOUT_PENDING,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    cart.items.forEach(async (item) => {
      await prisma.product.update({
        data: { stock: { decrement: item.quantity } },
        where: { id: item.productId },
      });
    });

    // Clear Cart
    await prisma.cart.delete({ where: { id: cart.id } });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.items.map(
        (item) =>
          ({
            price_data: {
              product_data: {
                name: item.product.name,
                description: item.product.description,
                metadata: { productId: item.product.id },
              },
              currency: "usd",
              unit_amount: Math.floor(item.product.price * 100),
            },
            quantity: item.quantity,
          }) as Stripe.Checkout.SessionCreateParams.LineItem,
      );

    const checkoutSession = await stripeServer.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: user.stripeCustomerId ?? "",
      customer_creation: undefined,
      currency: "usd",
      line_items: line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: { orderId: order.id },
      // ui_mode: "hosted",
      billing_address_collection: "required",
      // custom_fields: [{}],
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return { order: { ...order }, checkoutSession: { ...checkoutSession } };
  });

  return result;
};
