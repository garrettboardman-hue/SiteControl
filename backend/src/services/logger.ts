import { v4 as uuid } from "uuid";
import { db } from "../db/connection";
import { processingLogs } from "../db/schema";

export type LogLevel = "info" | "warn" | "error";

/**
 * Log service for recording document processing events.
 */
export function logProcessingEvent(
  documentId: string,
  event: string,
  level: LogLevel = "info",
  details?: Record<string, unknown>
): void {
  try {
    db.insert(processingLogs)
      .values({
        id: uuid(),
        documentId,
        event,
        level,
        details: details ? JSON.stringify(details) : null,
      })
      .run();
  } catch (err) {
    console.error("Failed to write processing log:", err);
  }
}