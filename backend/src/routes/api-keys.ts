import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { db } from "../db/connection";
import { apiKeys } from "../db/schema";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../middleware/auth";

const router = Router();

/**
 * POST /api/keys
 * Create a new API key.
 */
router.post("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Missing required field: name" });
    return;
  }

  const id = uuid();
  const rawKey = `df_${crypto.randomBytes(32).toString("hex")}`;
  const prefix = rawKey.substring(0, 8);

  db.insert(apiKeys).values({
    id,
    organizationId: orgId,
    name,
    key: rawKey,
    prefix,
    isActive: true,
  }).run();

  res.status(201).json({
    id,
    name,
    key: rawKey, // only returned on creation
    prefix,
    message: "Keep this key secure — it will not be shown again.",
  });
}));

/**
 * GET /api/keys
 * List all API keys (without the full key).
 */
router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;

  const results = db.select({
    id: apiKeys.id,
    name: apiKeys.name,
    prefix: apiKeys.prefix,
    isActive: apiKeys.isActive,
    lastUsedAt: apiKeys.lastUsedAt,
    createdAt: apiKeys.createdAt,
  })
    .from(apiKeys)
    .where(eq(apiKeys.organizationId, orgId))
    .all();

  res.json({ data: results });
}));

/**
 * DELETE /api/keys/:id
 * Revoke an API key.
 */
router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { id } = req.params;

  const key = db.select()
    .from(apiKeys)
    .where(eq(apiKeys.id, id))
    .get();

  if (!key || key.organizationId !== orgId) {
    res.status(404).json({ error: "API key not found" });
    return;
  }

  db.update(apiKeys)
    .set({ isActive: false })
    .where(eq(apiKeys.id, id))
    .run();

  res.json({ id, status: "revoked" });
}));

export default router;