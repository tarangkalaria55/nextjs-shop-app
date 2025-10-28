// components/AddToCartButton.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number; // Optional: Default to 1
}

export function AddToCartButton({
  product,
  quantity = 1,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/guest/add", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Added to Cart", {
          description: `${product.name} has been added to your cart.`,
        });
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not add item to cart. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleAdd} disabled={loading} variant="default" size="sm">
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
