"use server";

import { headers } from "next/headers";
import type Stripe from "stripe";
import { auth } from "@/auth/server";
import prisma from "@/database/prisma";
import { stripeServer } from "@/lib/stripe-server";

export const createCheckoutSession = async (orderId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Authentication required");
  }
  const user = session.user;

  if (!user.stripeCustomerId) {
    throw new Error("Stripe customer does not exist");
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    throw new Error("Order not found");
  }

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

  return { ...checkoutSession };
};
