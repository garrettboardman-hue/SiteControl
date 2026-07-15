import { v4 as uuid } from "uuid";
import { db } from "../db/connection";
import { validationResults, validationSeverity } from "../db/schema";
import { logProcessingEvent } from "./logger";

/**
 * A single validation rule.
 */
export interface ValidationRule {
  name: string;
  severity: "error" | "warning" | "info";
  validate: (
    fields: Record<string, { value: string; confidence: number }>,
    documentType: string
  ) => ValidationIssue | null;
}

/**
 * A validation issue found during processing.
 */
export interface ValidationIssue {
  fieldName: string;
  ruleName: string;
  severity: "error" | "warning" | "info";
  message: string;
  expectedValue?: string;
  actualValue?: string;
}

/**
 * Validation rules engine for checking extracted data.
 */
export class ValidationEngine {
  private rules: ValidationRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  /**
   * Register a custom validation rule.
   */
  registerRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  /**
   * Run all validation rules against extracted fields.
   * Returns the list of issues found and persists them to the database.
   */
  validate(
    fields: Record<string, { value: string; confidence: number }>,
    documentType: string,
    documentId: string
  ): ValidationIssue[] {
    logProcessingEvent(documentId, "validation_started", "info", {
      ruleCount: this.rules.length,
      fieldCount: Object.keys(fields).length,
    });

    const issues: ValidationIssue[] = [];

    for (const rule of this.rules) {
      try {
        const issue = rule.validate(fields, documentType);
        if (issue) {
          issues.push(issue);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logProcessingEvent(documentId, `validation_rule_error`, "error", {
          rule: rule.name,
          error: message,
        });
      }
    }

    // Persist issues to database
    for (const issue of issues) {
      db.insert(validationResults)
        .values({
          id: uuid(),
          documentId,
          fieldName: issue.fieldName,
          severity: issue.severity,
          ruleName: issue.ruleName,
          message: issue.message,
          expectedValue: issue.expectedValue || null,
          actualValue: issue.actualValue || null,
        })
        .run();
    }

    logProcessingEvent(documentId, "validation_complete", "info", {
      issuesFound: issues.length,
      errors: issues.filter((i) => i.severity === "error").length,
      warnings: issues.filter((i) => i.severity === "warning").length,
    });

    return issues;
  }

  /**
   * Register the default set of validation rules.
   */
  private registerDefaultRules(): void {
    // ─── Required fields check ──────────────────────────────────────────
    this.registerRule({
      name: "required_fields",
      severity: "warning",
      validate: (fields, documentType) => {
        const requiredFields = getRequiredFieldsForType(documentType);
        const missing = requiredFields.filter((f) => !fields[f]);

        if (missing.length > 0) {
          // Return first missing field as an issue
          return {
            fieldName: missing[0],
            ruleName: "required_fields",
            severity: "warning",
            message: `Required field "${missing[0]}" is missing from the document.`,
            expectedValue: "present",
            actualValue: "missing",
          };
        }
        return null;
      },
    });

    // ─── HS code format validation ──────────────────────────────────────
    this.registerRule({
      name: "hs_code_format",
      severity: "error",
      validate: (fields) => {
        const hsField = fields["hs_code"];
        if (!hsField) return null;

        // HS codes are typically 4-10 digits, possibly with dots
        // Valid formats: 8471, 8471.30, 8471.30.01, 847130
        const hsPattern = /^\d{4}(?:\.\d{2,4})?$/;
        const cleaned = hsField.value.replace(/\s/g, "");

        if (!hsPattern.test(cleaned)) {
          return {
            fieldName: "hs_code",
            ruleName: "hs_code_format",
            severity: "error",
            message: `HS code "${hsField.value}" has an invalid format. Expected format: 4 digits with optional sub-headings (e.g., 8471.30).`,
            expectedValue: "4-10 digit HS code (e.g., 8471.30)",
            actualValue: hsField.value,
          };
        }
        return null;
      },
    });

    // ─── Container number format validation ─────────────────────────────
    this.registerRule({
      name: "container_number_format",
      severity: "error",
      validate: (fields) => {
        const containerField = fields["container_number"];
        if (!containerField) return null;

        // Container numbers are 4 letters + 7 digits
        const containerPattern = /^[A-Z]{4}\d{7}$/;
        const cleaned = containerField.value.replace(/\s/g, "").toUpperCase();

        if (!containerPattern.test(cleaned)) {
          return {
            fieldName: "container_number",
            ruleName: "container_number_format",
            severity: "error",
            message: `Container number "${containerField.value}" has an invalid format. Expected format: 4 letters + 7 digits (e.g., MAEU1234567).`,
            expectedValue: "4 letters + 7 digits",
            actualValue: containerField.value,
          };
        }
        return null;
      },
    });

    // ─── Date format validation ─────────────────────────────────────────
    this.registerRule({
      name: "date_format",
      severity: "warning",
      validate: (fields) => {
        const dateFields = ["date_of_issue", "declaration_date", "invoice_date", "date"];
        for (const fieldName of dateFields) {
          const field = fields[fieldName];
          if (!field) continue;

          // Try to parse common date formats
          const value = field.value.trim();
          const datePatterns = [
            /^\d{4}-\d{2}-\d{2}$/, // ISO: 2024-01-15
            /^\d{2}\/\d{2}\/\d{4}$/, // US: 01/15/2024
            /^\d{2}-\d{2}-\d{4}$/, // US: 01-15-2024
            /^\d{1,2}\s[A-Z][a-z]+\s\d{4}$/, // 15 Jan 2024
            /^[A-Z][a-z]+\s\d{1,2},?\s\d{4}$/, // January 15, 2024
          ];

          const isValid = datePatterns.some((p) => p.test(value));
          if (!isValid) {
            return {
              fieldName,
              ruleName: "date_format",
              severity: "warning",
              message: `Date "${value}" in field "${fieldName}" doesn't match a standard date format.`,
              expectedValue: "Valid date (ISO, US, or text format)",
              actualValue: value,
            };
          }
        }
        return null;
      },
    });

    // ─── Low confidence flag ────────────────────────────────────────────
    this.registerRule({
      name: "low_confidence",
      severity: "warning",
      validate: (fields) => {
        const lowConfidenceFields = Object.entries(fields)
          .filter(([, v]) => v.confidence < 0.6)
          .map(([k]) => k);

        if (lowConfidenceFields.length > 0) {
          return {
            fieldName: lowConfidenceFields[0],
            ruleName: "low_confidence",
            severity: "warning",
            message: `Extraction confidence for "${lowConfidenceFields[0]}" is low (${(fields[lowConfidenceFields[0]].confidence * 100).toFixed(0)}%). Manual review recommended.`,
            expectedValue: "Confidence >= 60%",
            actualValue: `${(fields[lowConfidenceFields[0]].confidence * 100).toFixed(0)}%`,
          };
        }
        return null;
      },
    });

    // ─── Cross-field consistency: weight unit ───────────────────────────
    this.registerRule({
      name: "weight_consistency",
      severity: "warning",
      validate: (fields) => {
        const grossWeight = fields["gross_weight"];
        const netWeight = fields["net_weight"];
        if (!grossWeight || !netWeight) return null;

        // Check if gross weight is less than net weight (shouldn't happen)
        const grossNum = parseFloat(grossWeight.value.replace(/[^0-9.]/g, ""));
        const netNum = parseFloat(netWeight.value.replace(/[^0-9.]/g, ""));

        if (!isNaN(grossNum) && !isNaN(netNum) && grossNum < netNum) {
          return {
            fieldName: "gross_weight",
            ruleName: "weight_consistency",
            severity: "warning",
            message: `Gross weight (${grossWeight.value}) is less than net weight (${netWeight.value}). This is unusual.`,
            expectedValue: "Gross weight >= net weight",
            actualValue: `${grossWeight.value} < ${netWeight.value}`,
          };
        }
        return null;
      },
    });

    // ─── Currency format check ──────────────────────────────────────────
    this.registerRule({
      name: "currency_format",
      severity: "info",
      validate: (fields) => {
        const valueFields = ["total_value", "total_amount", "sum_insured", "customs_value"];
        for (const fieldName of valueFields) {
          const field = fields[fieldName];
          if (!field) continue;

          const value = field.value.trim();
          // Check if it has a currency code (USD, EUR, GBP, etc.)
          const hasCurrency = /^[A-Z]{3}\s/.test(value);
          if (!hasCurrency && /\d/.test(value)) {
            return {
              fieldName,
              ruleName: "currency_format",
              severity: "info",
              message: `Value "${value}" in "${fieldName}" doesn't include a currency code (e.g., USD, EUR).`,
              expectedValue: "Currency code + amount (e.g., USD 1,250.00)",
              actualValue: value,
            };
          }
        }
        return null;
      },
    });
  }
}

/**
 * Get the required fields for a specific document type.
 */
function getRequiredFieldsForType(documentType: string): string[] {
  switch (documentType) {
    case "bill_of_lading":
      return ["shipper", "consignee", "vessel", "port_of_loading", "port_of_discharge"];
    case "customs_declaration":
      return ["declarant_name", "country_of_origin", "hs_code", "customs_value"];
    case "commercial_invoice":
      return ["seller_name", "buyer_name", "invoice_number", "invoice_date", "total_amount", "currency"];
    case "certificate_of_origin":
      return ["exporter_name", "consignee_name", "country_of_origin", "certificate_number"];
    case "packing_list":
      return ["package_count", "gross_weight", "description_of_goods"];
    default:
      return [];
  }
}