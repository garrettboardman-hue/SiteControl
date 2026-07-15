import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { db } from "../db/connection";
import { webhooks } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { asyncHandler } from "../middleware/auth";

const router = Router();

/**
 * POST /api/webhooks
 * Register a new webhook endpoint.
 */
router.post("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { url, events } = req.body;

  if (!url || !events || !Array.isArray(events) || events.length === 0) {
    res.status(400).json({ error: "Missing required fields: url, events (non-empty array)" });
    return;
  }

  const id = uuid();
  const secret = crypto.randomBytes(32).toString("hex");

  db.insert(webhooks).values({
    id,
    organizationId: orgId,
    url,
    secret,
    events: JSON.stringify(events),
    isActive: true,
  }).run();

  res.status(201).json({
    id,
    url,
    events,
    secret, // only returned on creation
    message: "Webhook registered. Keep the secret for verifying payload signatures.",
  });
}));

/**
 * GET /api/webhooks
 * List all registered webhooks.
 */
router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;

  const results = db.select({
    id: webhooks.id,
    url: webhooks.url,
    events: webhooks.events,
    isActive: webhooks.isActive,
    lastTriggeredAt: webhooks.lastTriggeredAt,
    createdAt: webhooks.createdAt,
  })
    .from(webhooks)
    .where(eq(webhooks.organizationId, orgId))
    .all();

  res.json({ data: results });
}));

/**
 * DELETE /api/webhooks/:id
 * Remove a webhook.
 */
router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { id } = req.params;

  const wh = db.select()
    .from(webhooks)
    .where(and(eq(webhooks.id, id), eq(webhooks.organizationId, orgId)))
    .get();

  if (!wh) {
    res.status(404).json({ error: "Webhook not found" });
    return;
  }

  db.delete(webhooks).where(eq(webhooks.id, id)).run();
  res.json({ id, status: "deleted" });
}));

export default router;