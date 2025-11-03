import { Suspense } from "react";
import { CartItem } from "@/components/cart-item";
import { getCart } from "@/server/get-cart";

export default async function CartPage() {
  return (
    <main className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="font-bold text-2xl">Cart</h1>
      <Suspense fallback={<p>Loading cart...</p>}>
        <CartList />
      </Suspense>
    </main>
  );
}

const CartList = async () => {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return cart.items.map((cartItem) => (
    <CartItem
      key={cartItem.id}
      isGuestCart={cart.isGuestCart}
      cartItem={cartItem}
    />
  ));
};
