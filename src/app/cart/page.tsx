"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const cartItems: CartItem[] = [
  { id: "1", name: "TV", price: 12, quantity: 1 },
  { id: "2", name: "Mobile", price: 12, quantity: 5 },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setItems((prev) => {
        const index = prev.findIndex((x) => x.id === id);
        if (index !== -1) {
          prev[index].quantity = qty;
        }
        return prev;
      });
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <main className="px-6 py-10">
      <h1 className="text-2xl mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <Card>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b"
            >
              <span>{item.name}</span>
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
                className="w-16"
              />
              <span>₹{item.price * item.quantity}</span>
              <Button
                variant="destructive"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button className="mt-4" onClick={clearCart}>
            Clear Cart
          </Button>
        </Card>
      )}
    </main>
  );
}
