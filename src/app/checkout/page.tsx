"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CartItem } from "@/types/cart";

export default function CheckoutPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    // Fetch cart and addresses
    fetch("/api/cart")
      .then((res) => res.json())
      .then(setCart);
    fetch("/api/addresses")
      .then((res) => res.json())
      .then(setAddresses);
  }, [session]);

  const placeOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({ addressId: selectedAddress }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      toast.success("Order Placed!", {
        description: "Your order has been submitted.",
      });
      router.push("/orders"); // Redirect to orders page
    } else {
      toast.error("Error", {
        description: "Failed to place order.",
      });
    }
  };

  if (!session) return <div>Redirecting to login...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cart Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.map((item) => (
            <p key={item.id}>
              {item.name} x {item.quantity} - ${item.price * item.quantity}
            </p>
          ))}
          <p className="font-bold">
            Total: $
            {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </p>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Select Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedAddress}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an address" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr: any) => (
                <SelectItem key={addr.id} value={addr.id}>
                  {addr.street}, {addr.city}, {addr.state} {addr.zip}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={placeOrder}
            className="mt-4"
            disabled={!selectedAddress}
          >
            Place Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
