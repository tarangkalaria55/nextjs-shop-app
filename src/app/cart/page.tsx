"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CartItem } from "@/types/cart";

export default function CartPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const endpoint = session?.user ? "/api/cart" : "/api/cart/guest";
    const res = await fetch(endpoint);
    setCart(await res.json());
  };

  useEffect(() => {
    fetchCart().then(() => setLoading(false));
  }, [session]);

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(productId);
      return;
    }
    const endpoint = session?.user
      ? "/api/cart/update"
      : "/api/cart/guest/update";
    await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ productId, quantity: newQuantity }),
      headers: { "Content-Type": "application/json" },
    });
    fetchCart();
  };

  const removeItem = async (productId: string) => {
    const endpoint = session?.user
      ? "/api/cart/remove"
      : "/api/cart/guest/remove";
    await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: { "Content-Type": "application/json" },
    });
    fetchCart();

    toast.success("Removed", { description: "Item removed from cart." });
  };

  const clearCart = async () => {
    const endpoint = session?.user
      ? "/api/cart/clear"
      : "/api/cart/guest/clear";
    await fetch(endpoint, { method: "POST" });
    setCart([]);
    toast.success("Cleared", { description: "Cart has been cleared." });
  };

  const handleCheckout = () => {
    if (!session) {
      router.push("/auth/sign-in");
    } else {
      router.push("/checkout");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {item.name}
                  <Badge variant="secondary">${item.price}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <Badge>{item.quantity}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-between mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Clear Cart</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Clear Cart</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to clear your cart?</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary">Cancel</Button>
                  <Button onClick={clearCart}>Yes</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleCheckout}>
              {session ? "Checkout" : "Login to Checkout"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
