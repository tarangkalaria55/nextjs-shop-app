/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { authClient } from "@/auth/client";
import { OAUTH_PROVIDER } from "@/auth/types";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NuqsAdapter>
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
            router.refresh();
          }}
          Link={Link as any}
          avatar
          nameRequired
          changeEmail
          social={{ providers: [...OAUTH_PROVIDER] }}
          account={true}
          credentials={{
            rememberMe: true,
            confirmPassword: true,
            forgotPassword: true,
          }}
          emailVerification={true}
          optimistic={true}
        >
          {children}

          <Toaster />
        </AuthUIProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
