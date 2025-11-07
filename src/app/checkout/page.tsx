"use client";

import { Button } from "@/components/ui/button";
import { createOrderCheckoutSession } from "@/server/create-order-checkout-session";

export default function CheckoutPage() {
  const handleCheckout = async () => {
    const { order, checkoutSession } = await createOrderCheckoutSession();
    if (checkoutSession.url) {
      window.location.href = checkoutSession.url;
    }
  };

  return <Button onClick={handleCheckout}>Place Order</Button>;
}
