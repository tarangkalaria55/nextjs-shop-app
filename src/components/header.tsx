import { UserButton } from "@daveyplate/better-auth-ui";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { env } from "@/env/server";
import CartItemCount from "./cart-item-count";
import { ModeToggle } from "./mode-toggle";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 h-12 md:h-14 flex justify-between gap-40 border-b bg-background/60 backdrop-blur-md px-safe-or-4 md:px-safe-or-6">
      <Link href="/" className="h-full flex gap-2 items-center">
        <svg
          className="size-5"
          fill="none"
          height="45"
          viewBox="0 0 60 45"
          width="60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-black dark:fill-white"
            clipRule="evenodd"
            d="M0 0H15V45H0V0ZM45 0H60V45H45V0ZM20 0H40V15H20V0ZM20 30H40V45H20V30Z"
            fillRule="evenodd"
          />
        </svg>
        {env.SITE_NAME}
      </Link>

      <div className="h-full flex gap-2 items-center grow">
        <Link href="/products">Products</Link>
      </div>

      <div className="h-full flex gap-2 items-center">
        <Link
          href="/cart"
          passHref
          className="size-8 rounded-full relative inline-flex items-center justify-center border bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none p-1"
        >
          <ShoppingCartIcon className="h-4 w-4" />

          <Suspense fallback={null}>
            <CartItemCount
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs rounded-full"
            />
          </Suspense>
        </Link>

        <ModeToggle />

        <UserButton size="icon" className="border" />
      </div>
    </header>
  );
}
