import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";
import multer from "multer";
import { db } from "../db/connection";
import { documents, documentTypes, processingStatuses } from "../db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { asyncHandler } from "../middleware/auth";
import { AgentPipeline } from "../services/pipeline";

const router = Router();

// ─── File Upload Configuration ─────────────────────────────────────────────
const UPLOAD_DIR = path.resolve(import.meta.dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuid()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "text/plain",
      "text/csv",
      "application/json",
      "text/xml",
      "application/xml",
      "image/png",
      "image/jpeg",
      "image/tiff",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

/**
 * POST /api/documents/upload
 * Upload a document file for processing.
 * Uses multipart/form-data with fields: file (required), documentType, shipmentId
 */
router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    const orgId = (req as any).organizationId;
    const { documentType, shipmentId } = req.body;

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded. Use multipart/form-data with a 'file' field." });
      return;
    }

    const docType = documentType || "other";
    if (!Object.values(documentTypes).includes(docType)) {
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
      documentType: docType,
      filename: req.file.originalname,
      originalPath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: processingStatuses.PENDING,
      createdAt: now,
      updatedAt: now,
    }).run();

    res.status(201).json({
      id: docId,
      filename: req.file.originalname,
      documentType: docType,
      fileSize: req.file.size,
      status: "pending",
      message: "Document uploaded successfully. Use POST /api/documents/:id/process to start processing.",
    });
  })
);

// ─── Document Routes ───────────────────────────────────────────────────────

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
 * Trigger AI processing pipeline for a document.
 * Runs the full pipeline: extract text → AI extraction → validation → store results.
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

  // Don't re-process already completed/processing documents
  if (doc.status === "processing") {
    res.status(409).json({ error: "Document is already being processed." });
    return;
  }

  if (doc.status === "completed") {
    res.status(409).json({ error: "Document has already been processed. Upload again to re-process." });
    return;
  }

  // Update status to processing
  db.update(documents)
    .set({ status: processingStatuses.PROCESSING, updatedAt: new Date().toISOString() })
    .where(eq(documents.id, id))
    .run();

  // Launch pipeline asynchronously (don't block the response)
  const pipeline = new AgentPipeline({
    uploadDir: UPLOAD_DIR,
  });

  // Run pipeline in background
  pipeline.processDocument(id).then((result) => {
    console.log(`Pipeline result for ${id}:`, result.status);
  }).catch((err) => {
    console.error(`Pipeline error for ${id}:`, err);
  });

  res.json({
    id: doc.id,
    status: "processing",
    message: "Document processing has been queued. The AI pipeline will extract, validate, and store results.",
  });
}));

/**
 * GET /api/documents/:id/status
 * Get the current processing status and summary of a document.
 */
router.get("/:id/status", asyncHandler(async (req: Request, res: Response) => {
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

  // Get extraction count
  const { extractions: extTable } = await import("../db/schema");
  const extCount = db.select({ count: count() })
    .from(extTable)
    .where(eq(extTable.documentId, id))
    .get();

  // Get validation count
  const { validationResults: valTable } = await import("../db/schema");
  const valCount = db.select({ count: count() })
    .from(valTable)
    .where(eq(valTable.documentId, id))
    .get();

  // Get unresolved issues
  const unresolvedIssues = db.select({ count: count() })
    .from(valTable)
    .where(and(eq(valTable.documentId, id), eq(valTable.isResolved, false as any)))
    .get();

  res.json({
    id: doc.id,
    filename: doc.filename,
    documentType: doc.documentType,
    status: doc.status,
    processedAt: doc.processedAt,
    errorMessage: doc.errorMessage,
    stats: {
      extractionCount: extCount?.count || 0,
      validationCount: valCount?.count || 0,
      unresolvedIssues: unresolvedIssues?.count || 0,
    },
  });
}));

export default router;