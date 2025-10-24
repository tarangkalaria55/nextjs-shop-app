import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(_request: NextRequest) {
  logger.error("Error Ocurred", { data: 1, url: "localhost" });
  return NextResponse.json({ message: "Sucess" }, { status: 200 });
}
