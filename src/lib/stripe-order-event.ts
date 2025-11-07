import type Stripe from "stripe";
import prisma from "@/database/prisma";
import { OrderCheckoutStatus, OrderStatus } from "@/generated/prisma";

export const stripeOrderEvent = async (event: Stripe.Event) => {
  console.log(event.type);

  if (
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "checkout.session.async_payment_succeeded" ||
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.expired"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return;
    }

    if (event.type === "checkout.session.async_payment_failed") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          checkout_status: OrderCheckoutStatus.CHECKOUT_FAILED,
          status: OrderStatus.CHECKOUT_FAILED,
        },
      });
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          checkout_status: OrderCheckoutStatus.CHECKOUT_SUCCEDED,
          status: OrderStatus.CHECKOUT_SUCCEDED,
        },
      });
    } else if (event.type === "checkout.session.completed") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          checkout_status: OrderCheckoutStatus.CHECKOUT_SUCCEDED,
          status: OrderStatus.CHECKOUT_SUCCEDED,
        },
      });
    } else if (event.type === "checkout.session.expired") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          checkout_status: OrderCheckoutStatus.CHECKOUT_PENDING,
          status: OrderStatus.CHECKOUT_PENDING,
          stripeSessionId: null,
        },
      });
    }
  }
};
