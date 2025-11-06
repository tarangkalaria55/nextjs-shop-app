import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { baseEnv } from "./base";

export const env = createEnv({
  extends: [baseEnv],
  server: {
    SITE_NAME: z.string().min(1),
    BASE_URL: z.string().min(1),

    // Better Auth
    BETTER_AUTH_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),

    // Database
    DATABASE_URL: z.string().min(1),

    // Google
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    // Github
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    // Email Config
    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.coerce.number(),
    EMAIL_FROM: z.string().min(1),

    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),

    // Settings
    PAGE_SIZE: z.coerce.number(),
    PAYMENT_METHODS: z
      .string()
      .transform((value) => value.split(",").map((role) => role.trim())),
    DEFAULT_PAYMENT_METHOD: z.string(),
    USER_ROLES: z
      .string()
      .transform((value) => value.split(",").map((role) => role.trim())),
  },
  experimental__runtimeEnv: process.env,
  ...baseEnv,
});
