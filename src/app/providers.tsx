/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { authClient } from "@/auth/client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthUIProvider
        authClient={authClient}
        navigate={router.push as any}
        replace={router.replace as any}
        onSessionChange={() => {
          // Clear router cache (protected routes)
          router.refresh();
        }}
        Link={Link as any}
      >
        {children}

        <Toaster />
      </AuthUIProvider>
    </ThemeProvider>
  );
}
