import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { baseEnv } from "./base";

export const env = createEnv({
  extends: [],
  client: {
    NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(2).optional().or(z.literal("")),
  },
  runtimeEnv: {
    NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  },
  ...baseEnv,
});
