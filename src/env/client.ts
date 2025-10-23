import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { baseEnv } from "./base";

export const env = createEnv({
  extends: [],
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  ...baseEnv,
});
