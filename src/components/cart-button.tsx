/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

type CartButtonProps = {
  href: string;
  noOfItems?: number;
};

export function CartButton({ href, noOfItems = 0 }: CartButtonProps) {
  return (
    <Link
      href={href as any}
      passHref
      className="size-8 rounded-full relative inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none p-1"
    >
      <ShoppingCartIcon className="h-4 w-4" />

      {noOfItems > 0 ? (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs rounded-full"
        >
          {noOfItems}
        </Badge>
      ) : null}
    </Link>
  );
}
