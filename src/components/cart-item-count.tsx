import { getCart } from "@/server/get-cart";
import { Badge } from "./ui/badge";

export default async function CartItemCount(
  props: Omit<React.ComponentProps<typeof Badge>, "children">,
) {
  const cart = await getCart();

  if (!cart || cart.cartQtyCount <= 0) {
    return null;
  }
  return <Badge {...props}>{cart.cartQtyCount}</Badge>;
}
