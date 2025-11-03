"use client";

import { ChangeCartItemQty } from "@/server/change-cart-item-qty";
import type { getCart } from "@/server/get-cart";
import { refetchCachedCart } from "@/server/refetch-cached-cart";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type CartType = NonNullable<Awaited<ReturnType<typeof getCart>>>;

type CartItemType = CartType["items"][0];

type CartItemProps = {
  isGuestCart: CartType["isGuestCart"];
  cartItem: CartItemType;
};

export function CartItem({ isGuestCart, cartItem }: CartItemProps) {
  const handleQtyChange = async (newQty: number) => {
    await ChangeCartItemQty(isGuestCart, cartItem.id, newQty);
    await refetchCachedCart();
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          {cartItem.product.name}

          <CardDescription>
            Unit Price: ${cartItem.product.price.toFixed(2)} * Qty:{" "}
            {cartItem.quantity} = $
            {(cartItem.product.price * cartItem.quantity).toFixed(2)}
          </CardDescription>
          {/* <Badge variant="secondary">
            ${item.product.price * item.quantity}
          </Badge> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQtyChange(cartItem.quantity - 1)}
            >
              -
            </Button>
            <Badge>{cartItem.quantity}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQtyChange(cartItem.quantity + 1)}
            >
              +
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleQtyChange(0)}
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
