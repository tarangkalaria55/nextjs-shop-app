import Transport from "winston-transport";
import type { LogInfo } from "../types";

interface DatabaseTransportOptions extends Transport.TransportStreamOptions {
  create?: (info: LogInfo) => Promise<void>;
  delete?: () => Promise<void>;
}

export class DatabaseTransport extends Transport {
  create?: (info: LogInfo) => Promise<void> = async () => {};
  delete?: () => Promise<void> = async () => {};

  constructor(opts: DatabaseTransportOptions) {
    super(opts);

    this.create = opts.create;
    this.delete = opts.delete;

    this.create?.bind(this);
    this.delete?.bind(this);
  }

  async log(info: LogInfo, callback: () => void): Promise<void> {
    try {
      if (this.create) {
        await this.create(info);
      }

      this.emit("logged", info);

      try {
        if (this.delete) {
          await this.delete();
        }
      } catch (cleanupErr) {
        console.error("DatabaseTransport log cleanup failed:", cleanupErr);
      }
    } catch (err) {
      this.emit("error", err);
    } finally {
      callback();
    }
  }
}
