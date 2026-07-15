import { Router, Request, Response } from "express";
import { db } from "../db/connection";
import { shipments } from "../db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { asyncHandler } from "../middleware/auth";

const router = Router();

/**
 * GET /api/shipments
 * List all shipments for the organization.
 */
router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const results = db.select()
    .from(shipments)
    .where(eq(shipments.organizationId, orgId))
    .orderBy(desc(shipments.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  const total = db.select({ count: count() })
    .from(shipments)
    .where(eq(shipments.organizationId, orgId))
    .get();

  res.json({
    data: results,
    pagination: { page, limit, total: total?.count || 0 },
  });
}));

/**
 * GET /api/shipments/:id
 * Get a single shipment by ID, including its documents.
 */
router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { id } = req.params;

  const shipment = db.select()
    .from(shipments)
    .where(and(eq(shipments.id, id), eq(shipments.organizationId, orgId)))
    .get();

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  // Also fetch related documents
  const { documents: docsTable } = await import("../db/schema");
  const docs = db.select()
    .from(docsTable)
    .where(and(eq(docsTable.shipmentId, id), eq(docsTable.organizationId, orgId)))
    .all();

  res.json({ ...shipment, documents: docs });
}));

export default router;