"use server";

import prisma from "@/database/prisma";
import type { IntervalUnit } from "../types";

export async function deleteLog({
  amount = 30,
  unit = "day",
}: {
  amount?: number;
  unit?: IntervalUnit;
}) {
  // Compute cutoff using JS Date manipulation
  const now = new Date();
  const cutoffDate = new Date(now);

  switch (unit) {
    case "second":
      cutoffDate.setSeconds(now.getSeconds() - amount);
      break;
    case "minute":
      cutoffDate.setMinutes(now.getMinutes() - amount);
      break;
    case "day":
      cutoffDate.setHours(now.getDate() - amount);
      break;
    case "hour":
      cutoffDate.setDate(now.getHours() - amount);
      break;
    case "month":
      cutoffDate.setMonth(now.getMonth() - amount);
      break;
    default:
      throw new Error(`Unsupported retention unit: ${unit}`);
  }

  // Delete logs older than the cutoff date
  await prisma.logs.deleteMany({
    where: {
      timestamp: {
        lt: cutoffDate,
      },
    },
  });
}
