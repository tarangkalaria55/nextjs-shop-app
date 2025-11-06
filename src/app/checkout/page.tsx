"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env/client";
import { createPaymentIntent } from "@/server/create-payment-intent";
import { placeOrder } from "@/server/place-order";
import { type AddressInput, addressSchema } from "@/types/address-input";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const { data: session } = authClient.useSession();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: "",
      state: "",
      street: "",
      zip: "",
      phone: "",
      country: "US",
    },
  });

  async function onSubmit(addressData: AddressInput) {
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded");
      setLoading(false);
      return;
    }

    try {
      // Confirm the payment on client with Payment Element
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              email: session?.user.email,
              name: session?.user.name,
              phone: addressData.phone,
              address: {
                line1: addressData.street,
                city: addressData.city,
                country: addressData.country,
                postal_code: addressData.zip,
                state: addressData.state,
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        setError(error.message || "Payment confirmation failed");
        setLoading(false);
        return;
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        setError("Payment was not successful");
        setLoading(false);
        return;
      }

      //   const request = new Request(window.location.href);
      const orderId = await placeOrder(addressData, paymentIntent.id);

      router.push(`/order/confirmation/${orderId}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-6"
    >
      <Input {...register("street")} placeholder="Street" />
      {errors.street && <p className="text-red-600">{errors.street.message}</p>}

      <Input {...register("city")} placeholder="City" />
      {errors.city && <p className="text-red-600">{errors.city.message}</p>}

      <Input {...register("state")} placeholder="State" />
      {errors.state && <p className="text-red-600">{errors.state.message}</p>}

      <Input {...register("zip")} placeholder="Zip" />
      {errors.zip && <p className="text-red-600">{errors.zip.message}</p>}

      <Input {...register("country")} placeholder="Country" />
      {errors.country && (
        <p className="text-red-600">{errors.country.message}</p>
      )}

      <Input {...register("phone")} placeholder="Phone" />
      {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}

      {/* Optional checkbox if you implement isDefault in schema */}
      {/* <Checkbox {...register("isDefault")} id="isDefault" />
      <label htmlFor="isDefault">Set as default address</label> */}

      <PaymentElement
        options={{
          fields: { billingDetails: "never" },
        }}
      />

      {error && <p className="text-red-600">{error}</p>}

      <Button disabled={!stripe || loading}>
        {loading ? "Placing order..." : "Place Order"}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const { isPending, data: session } = authClient.useSession();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createPaymentIntentFn = useEffectEvent(async () => {
    const { paymentIntent } = await createPaymentIntent();
    setClientSecret(paymentIntent.client_secret);
  });

  useEffect(() => {
    createPaymentIntentFn();
  }, []);

  if (isPending) return <p>Loading user info...</p>;
  if (!session?.user) return <p>Please login to checkout</p>;

  if (!clientSecret) return <p>Loading ...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}
