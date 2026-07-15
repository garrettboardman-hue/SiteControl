import { Router, Request, Response } from "express";
import { db } from "../db/connection";
import { extractions } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { asyncHandler } from "../middleware/auth";

const router = Router();

/**
 * GET /api/documents/:documentId/extractions
 * Get all extractions for a given document.
 */
router.get("/documents/:documentId/extractions", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { documentId } = req.params;

  // Verify document belongs to org
  const { documents: docsTable } = await import("../db/schema");
  const doc = db.select()
    .from(docsTable)
    .where(and(eq(docsTable.id, documentId), eq(docsTable.organizationId, orgId)))
    .get();

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  const results = db.select()
    .from(extractions)
    .where(eq(extractions.documentId, documentId))
    .all();

  res.json({ data: results });
}));

/**
 * PATCH /api/extractions/:id/verify
 * Verify (approve) an extracted field value.
 */
router.patch("/extractions/:id/verify", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { verifiedBy } = req.body;

  const extraction = db.select()
    .from(extractions)
    .where(eq(extractions.id, id))
    .get();

  if (!extraction) {
    res.status(404).json({ error: "Extraction not found" });
    return;
  }

  db.update(extractions)
    .set({
      isVerified: true,
      verifiedBy: verifiedBy || null,
      verifiedAt: new Date().toISOString(),
    })
    .where(eq(extractions.id, id))
    .run();

  res.json({ id, status: "verified" });
}));

export default router;