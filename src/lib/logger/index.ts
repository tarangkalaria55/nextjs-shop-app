import winston from "winston";
import { createLog } from "./actions/create-log.action";
import { deleteLog } from "./actions/delete-log.action";
import { DatabaseTransport } from "./transports/database-transport";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json(),
  ),
  transports: [
    ...(process.env.NODE_ENV !== "production"
      ? [
          new winston.transports.Console({
            format: combine(colorize({ all: true }), logFormat),
          }),
        ]
      : []),
    new DatabaseTransport({
      level: "info",
      create: async (info) => {
        await createLog(info);
      },
      delete: async () => {
        await deleteLog({ amount: 30, unit: "day" });
      },
    }),
  ],
});
