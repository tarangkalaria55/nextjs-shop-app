"use server";

import prisma from "@/database/prisma";
import type { LogInfo, NewLog } from "../types";

export async function createLog(data: LogInfo) {
  const { level, message, timestamp: _timestamp, ...meta } = data;

  const logEntry: NewLog = {
    level: level,
    message: message,
    meta: JSON.stringify(meta || {}),
  };
  await prisma.logs.create({
    data: logEntry,
  });
}
