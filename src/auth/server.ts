import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/database/prisma";
import { env } from "@/env/server";
import { logger as winstonLogger } from "@/lib/logger";

export const auth = betterAuth({
  appName: "E Shop",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 1 * 60 * 60,
    async sendResetPassword({ user, url, token }) {
      console.log({ user, url, token });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendOnSignUp: true,
    expiresIn: 1 * 60 * 60,
    async sendVerificationEmail({ user, url, token }) {
      console.log({ user, url, token });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 2,
    updateAge: 60 * 60 * 24,
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, url, token, newEmail }) {
        console.log({ user, url, token, newEmail });
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (_ctx) => {
      console.log("createAuthMiddleware", _ctx.path);
      return;
    }),
  },
  logger: {
    disabled: false,
    disableColors: false,
    level: "info",
    log(level, message, ...args) {
      const levels: (typeof level)[] = ["error", "warn"];

      console[level](message, ...args);

      if (levels.includes(level)) {
        message = `[Better Auth]: ${message}`;
        winstonLogger.log(level, message, ...args);
      }
    },
  },
});
