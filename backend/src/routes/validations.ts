import { Router, Request, Response } from "express";
import { db } from "../db/connection";
import { validationResults } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { asyncHandler } from "../middleware/auth";

const router = Router();

/**
 * GET /api/validations
 * List validation results, optionally filtered by document.
 */
router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { documentId } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  let query = db.select()
    .from(validationResults)
    .orderBy(desc(validationResults.createdAt));

  if (documentId) {
    // Verify document belongs to org
    const { documents: docsTable } = await import("../db/schema");
    const doc = db.select()
      .from(docsTable)
      .where(and(eq(docsTable.id, documentId as string), eq(docsTable.organizationId, orgId)))
      .get();

    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    query = query.where(eq(validationResults.documentId, documentId as string));
  }

  const results = query.limit(limit).offset(offset).all();
  res.json({ data: results });
}));

/**
 * PATCH /api/validations/:id/resolve
 * Mark a validation issue as resolved.
 */
router.patch("/:id/resolve", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { resolvedBy } = req.body;

  const validation = db.select()
    .from(validationResults)
    .where(eq(validationResults.id, id))
    .get();

  if (!validation) {
    res.status(404).json({ error: "Validation result not found" });
    return;
  }

  db.update(validationResults)
    .set({
      isResolved: true,
      resolvedBy: resolvedBy || null,
      resolvedAt: new Date().toISOString(),
    })
    .where(eq(validationResults.id, id))
    .run();

  res.json({ id, status: "resolved" });
}));

export default router;