/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

import type { Prisma } from "@/generated/prisma";

export type NewLog = Prisma.logsCreateInput;

export type LogInfo = {
  level: string;
  message: string;
  timestamp?: string;
  [key: string]: any;
};

export type IntervalUnit = "second" | "minute" | "hour" | "day" | "month";
