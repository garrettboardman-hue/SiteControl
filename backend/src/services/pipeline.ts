import { v4 as uuid } from "uuid";
import { db } from "../db/connection";
import { documents, extractions, processingStatuses } from "../db/schema";
import { eq } from "drizzle-orm";
import { extractTextFromFile } from "./extractor";
import { AIClient } from "./ai-client";
import { ValidationEngine } from "./validator";
import { logProcessingEvent } from "./logger";
import { notifyWebhooks } from "./webhook-notifier";
import type { DocumentType } from "./prompts";

/**
 * Configuration for the AgentPipeline.
 */
export interface PipelineConfig {
  /** Upload directory path */
  uploadDir: string;
  /** AI client configuration */
  aiClient?: AIClient;
}

/**
 * Result of a pipeline run.
 */
export interface PipelineResult {
  documentId: string;
  status: "completed" | "failed" | "flagged";
  extractionCount: number;
  validationCount: number;
  error?: string;
}

/**
 * AgentPipeline orchestrates the document processing flow:
 * 1. Extract text from document
 * 2. AI extraction of structured fields
 * 3. Validation of extracted data
 * 4. Persist results
 * 5. Webhook notification
 */
export class AgentPipeline {
  private aiClient: AIClient;
  private validator: ValidationEngine;
  private uploadDir: string;

  constructor(config: PipelineConfig) {
    this.aiClient = config.aiClient || new AIClient();
    this.validator = new ValidationEngine();
    this.uploadDir = config.uploadDir;
  }

  /**
   * Run the full processing pipeline for a document.
   */
  async processDocument(documentId: string): Promise<PipelineResult> {
    logProcessingEvent(documentId, "pipeline_started", "info", {});

    try {
      // 1. Fetch document record
      const doc = db
        .select()
        .from(documents)
        .where(eq(documents.id, documentId))
        .get();

      if (!doc) {
        const error = "Document not found";
        logProcessingEvent(documentId, "pipeline_failed", "error", { error });
        return { documentId, status: "failed", extractionCount: 0, validationCount: 0, error };
      }

      // Update status to processing
      db.update(documents)
        .set({ status: processingStatuses.PROCESSING, updatedAt: new Date().toISOString() })
        .where(eq(documents.id, documentId))
        .run();

      // 2. Extract text from document
      const filePath = doc.originalPath;
      const extraction = await extractTextFromFile(
        filePath,
        documentId,
        doc.mimeType,
        doc.filename
      );

      // 3. AI extraction of structured fields
      const docType = (doc.documentType || "other") as DocumentType;
      const aiResult = await this.aiClient.extract(
        docType,
        extraction.text,
        documentId
      );

      if (!aiResult.success) {
        // Mark as failed but store what we have
        await this.finalizeDocument(documentId, "failed", aiResult.fields, []);
        return {
          documentId,
          status: "failed",
          extractionCount: 0,
          validationCount: 0,
          error: "AI extraction returned no fields",
        };
      }

      // 4. Persist extracted fields
      const extractionCount = await this.persistExtractions(
        documentId,
        aiResult.fields
      );

      // 5. Run validation
      const issues = this.validator.validate(
        aiResult.fields,
        docType,
        documentId
      );

      // 6. Determine final status
      const hasErrors = issues.some((i) => i.severity === "error");
      const hasWarnings = issues.some((i) => i.severity === "warning");
      const finalStatus = hasErrors
        ? "flagged"
        : hasWarnings && extractionCount < 3
          ? "flagged"
          : "completed";

      // 7. Update document status
      await this.finalizeDocument(documentId, finalStatus, aiResult.fields, issues);

      // 8. Notify webhooks
      const webhookEvent =
        finalStatus === "completed"
          ? "document.processed"
          : finalStatus === "flagged"
            ? "document.flagged"
            : "document.failed";

      await notifyWebhooks(doc.organizationId, webhookEvent, {
        documentId,
        documentType: doc.documentType,
        filename: doc.filename,
        extractionCount,
        validationCount: issues.length,
        hasErrors,
        hasWarnings,
      });

      logProcessingEvent(documentId, "pipeline_complete", "info", {
        status: finalStatus,
        extractionCount,
        validationCount: issues.length,
      });

      return {
        documentId,
        status: finalStatus,
        extractionCount,
        validationCount: issues.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logProcessingEvent(documentId, "pipeline_failed", "error", {
        error: message,
      });

      // Mark document as failed
      db.update(documents)
        .set({
          status: processingStatuses.FAILED,
          errorMessage: message,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(documents.id, documentId))
        .run();

      return {
        documentId,
        status: "failed",
        extractionCount: 0,
        validationCount: 0,
        error: message,
      };
    }
  }

  /**
   * Persist extracted fields to the database.
   */
  private async persistExtractions(
    documentId: string,
    fields: Record<string, { value: string; confidence: number }>
  ): Promise<number> {
    let count = 0;

    for (const [fieldName, fieldData] of Object.entries(fields)) {
      db.insert(extractions)
        .values({
          id: uuid(),
          documentId,
          fieldName,
          fieldValue: fieldData.value,
          confidence: Math.round(fieldData.confidence * 100) / 100, // round to 2 decimals
          isVerified: false,
        })
        .run();
      count++;
    }

    return count;
  }

  /**
   * Finalize document processing status.
   */
  private async finalizeDocument(
    documentId: string,
    status: string,
    fields: Record<string, { value: string; confidence: number }>,
    issues: any[]
  ): Promise<void> {
    const now = new Date().toISOString();

    db.update(documents)
      .set({
        status,
        processedAt: now,
        updatedAt: now,
        errorMessage:
          status === "failed"
            ? "Processing failed. See processing logs for details."
            : null,
      })
      .where(eq(documents.id, documentId))
      .run();
  }
}