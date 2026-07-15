import { Request, Response, NextFunction } from "express";
import { db } from "../db/connection";
import { apiKeys } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * API key authentication middleware.
 * Expects header: X-API-Key
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    res.status(401).json({ error: "Missing API key. Provide it via X-API-Key header." });
    return;
  }

  const key = db.select().from(apiKeys).where(eq(apiKeys.key, apiKey)).get();

  if (!key || !key.isActive) {
    res.status(401).json({ error: "Invalid or inactive API key." });
    return;
  }

  // Update last used timestamp
  db.update(apiKeys)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKeys.id, key.id))
    .run();

  // Attach org context to request
  (req as any).organizationId = key.organizationId;
  (req as any).apiKeyId = key.id;

  next();
}

/**
 * Simple error handler for async route handlers.
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}