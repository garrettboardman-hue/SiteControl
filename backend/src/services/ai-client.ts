import { logProcessingEvent } from "./logger";
import { buildSystemPrompt, buildUserPrompt, buildGenericPrompt } from "./prompts";
import type { DocumentType } from "./prompts";

/**
 * Configuration for the AI extraction client.
 */
export interface AIClientConfig {
  /** Anthropic API key (defaults to ANTHROPIC_API_KEY env var) */
  apiKey?: string;
  /** Claude model to use */
  model?: string;
  /** Max tokens for response */
  maxTokens?: number;
}

/**
 * Result from AI extraction.
 */
export interface AIExtractionResult {
  /** Parsed JSON fields extracted from the document */
  fields: Record<string, { value: string; confidence: number }>;
  /** Raw response text from the LLM */
  rawResponse: string;
  /** Whether the extraction was successful */
  success: boolean;
  /** Error message if extraction failed */
  error?: string;
  /** Model used */
  model: string;
}

/**
 * AI Client for extracting structured data from logistics documents.
 * Uses Anthropic Claude by default, with a fallback to a simulated extraction
 * when no API key is configured (for development/testing).
 */
export class AIClient {
  private apiKey: string;
  private model: string;
  private maxTokens: number;

  constructor(config: AIClientConfig = {}) {
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || "";
    this.model = config.model || "claude-3-haiku-20240307";
    this.maxTokens = config.maxTokens || 4096;
  }

  get isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Extract structured fields from document text.
   */
  async extract(
    documentType: DocumentType,
    extractedText: string,
    documentId: string
  ): Promise<AIExtractionResult> {
    logProcessingEvent(documentId, "ai_extraction_started", "info", {
      documentType,
      textLength: extractedText.length,
      model: this.model,
    });

    if (!this.isConfigured) {
      logProcessingEvent(documentId, "ai_extraction_fallback", "warn", {
        message:
          "No ANTHROPIC_API_KEY configured. Using simulated extraction.",
      });
      return this.simulateExtraction(documentType, extractedText);
    }

    try {
      const result = await this.callAnthropicAPI(documentType, extractedText);
      logProcessingEvent(documentId, "ai_extraction_complete", "info", {
        model: this.model,
        fieldsCount: Object.keys(result.fields).length,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logProcessingEvent(documentId, "ai_extraction_failed", "error", {
        error: message,
      });

      // Fallback to simulated extraction on API failure
      logProcessingEvent(documentId, "ai_extraction_fallback_after_error", "warn", {
        message: "Falling back to simulated extraction after API error.",
      });
      return this.simulateExtraction(documentType, extractedText);
    }
  }

  private async callAnthropicAPI(
    documentType: DocumentType,
    extractedText: string
  ): Promise<AIExtractionResult> {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: this.apiKey });

    const systemPrompt = buildSystemPrompt();
    const userPrompt =
      documentType === "other"
        ? buildGenericPrompt(extractedText)
        : buildUserPrompt(documentType as DocumentType, extractedText);

    // Truncate text if too long (Claude has ~100k token context, but let's be safe)
    const maxTextLength = 80000;
    const truncatedText =
      extractedText.length > maxTextLength
        ? extractedText.slice(0, maxTextLength) +
          "\n\n[...TRUNCATED]"
        : extractedText;

    const userPromptFinal = userPrompt.replace(
      "---\n${extractedText}\n---",
      `---\n${truncatedText}\n---`
    );

    const response = await anthropic.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPromptFinal,
        },
      ],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return this.parseResponse(rawText, response.model);
  }

  private parseResponse(
    rawText: string,
    model: string
  ): AIExtractionResult {
    // Try to extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    let fields: Record<string, { value: string; confidence: number }> = {};

    if (jsonMatch) {
      try {
        fields = JSON.parse(jsonMatch[0]);
      } catch {
        // If JSON parsing fails, try to extract fields manually
        fields = this.extractFieldsFromText(rawText);
      }
    } else {
      fields = this.extractFieldsFromText(rawText);
    }

    return {
      fields,
      rawResponse: rawText,
      success: Object.keys(fields).length > 0,
      model,
    };
  }

  private extractFieldsFromText(
    text: string
  ): Record<string, { value: string; confidence: number }> {
    const fields: Record<string, { value: string; confidence: number }> = {};
    const lines = text.split("\n");

    for (const line of lines) {
      // Match patterns like: "field_name: value" or "field_name: value (confidence: 0.95)"
      const match = line.match(
        /^["']?([a-zA-Z_]+)["']?\s*[:=]\s*["']?(.+?)["']?(?:\s*\(.*?confidence:\s*([\d.]+).*?\))?$/
      );
      if (match) {
        const [, key, value, confidenceStr] = match;
        fields[key.trim()] = {
          value: value.trim(),
          confidence: confidenceStr ? parseFloat(confidenceStr) : 0.5,
        };
      }
    }

    return fields;
  }

  /**
   * Simulated extraction for development/testing when no API key is available.
   * Extracts basic patterns from the text using regex.
   */
  private simulateExtraction(
    documentType: DocumentType,
    extractedText: string
  ): AIExtractionResult {
    const fields: Record<string, { value: string; confidence: number }> = {};

    // Common patterns to extract via regex
    const patterns: Array<{
      field: string;
      regex: RegExp;
      confidence: number;
    }> = [
      { field: "container_number", regex: /[A-Z]{4}\d{7}/g, confidence: 0.95 },
      { field: "seal_number", regex: /(?:seal|seal\s*no|seal\s*#)\s*[:\s]*([A-Z0-9]+)/gi, confidence: 0.85 },
      { field: "vessel", regex: /(?:vessel|vessel\s*name|mv|m\/v)\s*[:\s]*([A-Za-z0-9\s]+?)(?:\n|,|\.)/gi, confidence: 0.8 },
      { field: "voyage", regex: /(?:voyage|voy\s*no|voyage\s*#)\s*[:\s]*([A-Za-z0-9]+)/gi, confidence: 0.85 },
      { field: "port_of_loading", regex: /(?:port\s*of\s*loading|loading\s*port|pol)\s*[:\s]*([A-Za-z\s,]+?)(?:\n|,|\.)/gi, confidence: 0.8 },
      { field: "port_of_discharge", regex: /(?:port\s*of\s*discharge|discharge\s*port|pod)\s*[:\s]*([A-Za-z\s,]+?)(?:\n|,|\.)/gi, confidence: 0.8 },
      { field: "bill_of_lading_number", regex: /(?:bill\s*of\s*lading\s*(?:no|#|number)?|B\/L\s*(?:no|#)?)\s*[:\s]*([A-Za-z0-9-]+)/gi, confidence: 0.9 },
      { field: "invoice_number", regex: /(?:invoice\s*(?:no|#|number)?|inv\s*(?:no|#)?)\s*[:\s]*([A-Za-z0-9-]+)/gi, confidence: 0.9 },
      { field: "hs_code", regex: /\b\d{4}\.\d{2}(?:\.\d{2,4})?\b/g, confidence: 0.85 },
      { field: "gross_weight", regex: /(?:gross\s*weight|gross\s*wt|gw)\s*[:\s]*([\d,]+(?:\.\d+)?\s*(?:kg|lbs|kgs|pounds|lb))/gi, confidence: 0.85 },
      { field: "net_weight", regex: /(?:net\s*weight|net\s*wt|nw)\s*[:\s]*([\d,]+(?:\.\d+)?\s*(?:kg|lbs|kgs|pounds|lb))/gi, confidence: 0.85 },
      { field: "total_value", regex: /(?:total\s*value|total\s*amount|invoice\s*total)\s*[:\s]*([A-Z]{3}\s*[\d,]+(?:\.\d{2})?)/gi, confidence: 0.8 },
      { field: "number_of_packages", regex: /(?:number\s*of\s*packages|packages|total\s*packages)\s*[:\s]*(\d+)/gi, confidence: 0.85 },
      { field: "date_of_issue", regex: /(?:date\s*of\s*issue|issue\s*date|date)\s*[:\s]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/gi, confidence: 0.75 },
      { field: "carrier", regex: /(?:carrier|carrier\s*name)\s*[:\s]*([A-Za-z0-9\s]+?)(?:\n|,|\.)/gi, confidence: 0.8 },
    ];

    for (const { field, regex, confidence } of patterns) {
      regex.lastIndex = 0;
      const matches = [...extractedText.matchAll(regex)];
      if (matches.length > 0) {
        const value = matches[0][1] || matches[0][0];
        fields[field] = {
          value: value.trim(),
          confidence: confidence * (1 - Math.random() * 0.1), // slight variation
        };
      }
    }

    // Try to extract commodity description
    const descMatch = extractedText.match(
      /(?:description\s*of\s*goods|goods\s*description|commodity)\s*[:\s]*([A-Za-z0-9\s,/]+?)(?:\n[A-Z]|\n\n|\.)/i
    );
    if (descMatch) {
      fields.description_of_goods = {
        value: descMatch[1].trim(),
        confidence: 0.7,
      };
    }

    logProcessingEvent("simulated", "ai_extraction_simulated", "info", {
      fieldsFound: Object.keys(fields).length,
      documentType,
    });

    return {
      fields,
      rawResponse: JSON.stringify(fields, null, 2),
      success: Object.keys(fields).length > 0,
      model: "simulated",
    };
  }
}