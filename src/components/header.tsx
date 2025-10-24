import { UserButton } from "@daveyplate/better-auth-ui";
import { headers } from "next/headers";
import Link from "next/link";
import { authClient } from "@/auth/client";
import { auth } from "@/auth/server";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export async function Header() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="sticky top-0 z-50 flex h-12 justify-between border-b bg-background/60 px-safe-or-4 backdrop-blur md:h-14 md:px-safe-or-6">
      <Link href="/" className="flex items-center gap-2">
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
        E-Shop
      </Link>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserButton
          size="icon"
          trigger={
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage
                src={sessionData?.user.image ?? ""}
                alt={sessionData?.user.name ?? "User"}
              />
              <AvatarFallback>
                {sessionData?.user.name?.trim()?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          }
        />
      </div>
    </header>
  );
}
