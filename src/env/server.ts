import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { baseEnv } from "./base";

export const env = createEnv({
  extends: [baseEnv],
  server: {
    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),

    // Database
    IS_NEON_DATABASE: z
      .string()
      .nullable()
      .optional()
      .transform((x) => {
        if (x === undefined || x === null || x === "") {
          return false;
        }
        const value = x.trim().trim();
        if (value === "1" || value === "true") {
          return true;
        }
        return false;
      })
      .pipe(z.boolean().nonoptional()),
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
