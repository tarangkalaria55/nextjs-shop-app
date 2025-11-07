import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import Stripe from "stripe";
import prisma from "@/database/prisma";
import { getStripeCustomerIdForUser } from "@/database/queries/users";
import { env } from "@/env/server";
import { logger as winstonLogger } from "@/lib/logger";
import { stripeOrderEvent } from "@/lib/stripe-order-event";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export const auth = betterAuth({
  appName: env.SITE_NAME,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      onEvent: async (event) => {
        await stripeOrderEvent(event);
      },
    }),
    customSession(async ({ user, session }) => {
      const stripeCustomerId = await getStripeCustomerIdForUser(user.id);
      return {
        user: {
          ...user,
          stripeCustomerId,
        },
        session,
      };
    }),
  ],
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
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
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
