import "./env-loader";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schemas",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
