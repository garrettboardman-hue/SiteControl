import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";
import { documents, documentTypes, processingStatuses } from "../db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { asyncHandler } from "../middleware/auth";

const router = Router();

/**
 * POST /api/documents/upload
 * Upload a new document for processing.
 * Body: { documentType, filename, mimeType, content (base64), shipmentId? }
 */
router.post("/upload", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { documentType, filename, mimeType, shipmentId } = req.body;

  if (!documentType || !filename || !mimeType) {
    res.status(400).json({ error: "Missing required fields: documentType, filename, mimeType" });
    return;
  }

  if (!Object.values(documentTypes).includes(documentType)) {
    res.status(400).json({
      error: `Invalid documentType. Must be one of: ${Object.values(documentTypes).join(", ")}`,
    });
    return;
  }

  const docId = uuid();
  const now = new Date().toISOString();

  db.insert(documents).values({
    id: docId,
    organizationId: orgId,
    shipmentId: shipmentId || null,
    documentType,
    filename,
    originalPath: `/data/uploads/${docId}-${filename}`,
    fileSize: 0, // will be updated when file is stored
    mimeType,
    status: processingStatuses.PENDING,
    createdAt: now,
    updatedAt: now,
  }).run();

  res.status(201).json({
    id: docId,
    status: "pending",
    message: "Document uploaded. Processing will begin shortly.",
  });
}));

/**
 * GET /api/documents
 * List all documents for the organization.
 */
router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const results = db.select()
    .from(documents)
    .where(eq(documents.organizationId, orgId))
    .orderBy(desc(documents.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  const total = db.select({ count: count() })
    .from(documents)
    .where(eq(documents.organizationId, orgId))
    .get();

  res.json({
    data: results,
    pagination: {
      page,
      limit,
      total: total?.count || 0,
    },
  });
}));

/**
 * GET /api/documents/:id
 * Get a single document by ID.
 */
router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { id } = req.params;

  const doc = db.select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.organizationId, orgId)))
    .get();

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  res.json(doc);
}));

/**
 * POST /api/documents/:id/process
 * Trigger processing (extraction + validation) for a document.
 */
router.post("/:id/process", asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).organizationId;
  const { id } = req.params;

  const doc = db.select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.organizationId, orgId)))
    .get();

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  // Update status to processing
  db.update(documents)
    .set({ status: processingStatuses.PROCESSING, updatedAt: new Date().toISOString() })
    .where(eq(documents.id, id))
    .run();

  // In a real app, this would enqueue a job to the AI agent pipeline.
  // For now, we simulate processing completing.
  setTimeout(() => {
    db.update(documents)
      .set({
        status: processingStatuses.COMPLETED,
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(documents.id, id))
      .run();
  }, 100);

  res.json({
    id: doc.id,
    status: "processing",
    message: "Document processing has been queued.",
  });
}));

export default router;