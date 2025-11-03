"use client";

import { ShoppingCartIcon } from "lucide-react";
import type { DbProducts } from "@/database/queries/products";
import { addToCart } from "@/server/add-to-cart";
import { refetchCachedCart } from "@/server/refetch-cached-cart";
import { refetchCachedProducts } from "@/server/refetch-cached-products";
import { Button } from "./ui/button";

interface AddToCartButtonProps {
  product: DbProducts.PaginatedProductType;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const handleAddToCart = async () => {
    await addToCart(product.id);
    await refetchCachedProducts();
    await refetchCachedCart();
  };

  return (
    <Button
      className="flex items-center gap-2"
      disabled={product.stockAvailable === 0}
      onClick={handleAddToCart}
    >
      <ShoppingCartIcon className="size-4" />
      Add to Cart
    </Button>
  );
}
