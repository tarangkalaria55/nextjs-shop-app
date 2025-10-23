import type { createEnv } from "@t3-oss/env-nextjs";

type BaseConfig = Pick<
  Parameters<typeof createEnv>[0],
  "onValidationError" | "onInvalidAccess" | "emptyStringAsUndefined"
>;

export const baseEnv = {
  emptyStringAsUndefined: false,
  onValidationError: (issues) => {
    console.error("❌ Invalid environment variables:", issues);
    throw new Error("Invalid environment variables");
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: () => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client",
    );
  },
} satisfies BaseConfig;
