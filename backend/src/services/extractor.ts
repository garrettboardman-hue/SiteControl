import fs from "fs";
import path from "path";
import { logProcessingEvent } from "./logger";

/**
 * Result of text extraction from a document.
 */
export interface ExtractionResult {
  text: string;
  pageCount: number;
  method: "pdf" | "text" | "unknown";
}

/**
 * Extract text content from a document file.
 * Supports PDF (via pdf-parse) and plain text files.
 * For unsupported formats, returns a descriptive message.
 */
export async function extractTextFromFile(
  filePath: string,
  documentId: string,
  mimeType: string,
  filename: string
): Promise<ExtractionResult> {
  logProcessingEvent(documentId, "extraction_started", "info", {
    mimeType,
    filename,
    filePath,
  });

  try {
    // Check file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const ext = path.extname(filename).toLowerCase();

    // PDF extraction
    if (ext === ".pdf" || mimeType === "application/pdf") {
      return await extractFromPdf(filePath, documentId);
    }

    // Plain text files
    if (
      ext === ".txt" ||
      ext === ".csv" ||
      ext === ".json" ||
      ext === ".xml" ||
      mimeType.startsWith("text/")
    ) {
      return await extractFromTextFile(filePath, documentId);
    }

    // Image files (basic OCR placeholder - real OCR would go here)
    if (
      ext === ".png" ||
      ext === ".jpg" ||
      ext === ".jpeg" ||
      ext === ".tiff" ||
      ext === ".tif" ||
      mimeType.startsWith("image/")
    ) {
      logProcessingEvent(documentId, "extraction_image_unsupported", "warn", {
        message: "Image OCR not yet implemented. PDF/text files supported.",
        ext,
      });
      return {
        text: "[Image file - OCR processing not yet available. Please upload a PDF or text version.]",
        pageCount: 1,
        method: "unknown",
      };
    }

    // Unknown format
    logProcessingEvent(documentId, "extraction_unsupported_format", "warn", {
      ext,
      mimeType,
    });
    return {
      text: `[Unsupported file format: ${ext || mimeType}. Please upload a PDF or text document.]`,
      pageCount: 0,
      method: "unknown",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logProcessingEvent(documentId, "extraction_failed", "error", {
      error: message,
    });
    throw error;
  }
}

async function extractFromPdf(
  filePath: string,
  documentId: string
): Promise<ExtractionResult> {
  const pdfParse = (await import("pdf-parse")).default;
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  logProcessingEvent(documentId, "extraction_pdf_complete", "info", {
    pageCount: data.numpages,
    textLength: data.text.length,
  });

  return {
    text: data.text,
    pageCount: data.numpages,
    method: "pdf",
  };
}

async function extractFromTextFile(
  filePath: string,
  documentId: string
): Promise<ExtractionResult> {
  const content = fs.readFileSync(filePath, "utf-8");

  logProcessingEvent(documentId, "extraction_text_complete", "info", {
    textLength: content.length,
  });

  return {
    text: content,
    pageCount: 1,
    method: "text",
  };
}