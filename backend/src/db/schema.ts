import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ─── Organizations (tenants) ───────────────────────────────────────────────
export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Users ─────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("member"), // 'admin' | 'member' | 'viewer'
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Document Types ────────────────────────────────────────────────────────
export const documentTypes = {
  BILL_OF_LADING: "bill_of_lading",
  CUSTOMS_DECLARATION: "customs_declaration",
  COMMERCIAL_INVOICE: "commercial_invoice",
  CERTIFICATE_OF_ORIGIN: "certificate_of_origin",
  PACKING_LIST: "packing_list",
  INSURANCE_CERTIFICATE: "insurance_certificate",
  OTHER: "other",
} as const;

export const processingStatuses = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  FLAGGED: "flagged", // needs human review
} as const;

// ─── Documents ─────────────────────────────────────────────────────────────
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  shipmentId: text("shipment_id").references(() => shipments.id),
  documentType: text("document_type").notNull(), // from documentTypes
  filename: text("filename").notNull(),
  originalPath: text("original_path").notNull(), // storage path
  fileSize: integer("file_size").notNull(), // bytes
  mimeType: text("mime_type").notNull(),
  status: text("status").notNull().default("pending"), // from processingStatuses
  errorMessage: text("error_message"),
  processedAt: text("processed_at"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Shipments ─────────────────────────────────────────────────────────────
export const shipments = sqliteTable("shipments", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  reference: text("reference"), // customer's shipment reference
  origin: text("origin"),
  destination: text("destination"),
  carrier: text("carrier"),
  vessel: text("vessel"),
  voyage: text("voyage"),
  containerNumber: text("container_number"),
  sealNumber: text("seal_number"),
  weight: real("weight"),
  weightUnit: text("weight_unit"), // kg / lbs
  volume: real("volume"),
  volumeUnit: text("volume_unit"), // cbm / cft
  status: text("status").notNull().default("active"), // active | completed | cancelled
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Extractions (structured data from documents) ──────────────────────────
export const extractions = sqliteTable("extractions", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id),
  fieldName: text("field_name").notNull(), // e.g., "consignee", "hs_code", "total_value"
  fieldValue: text("field_value").notNull(),
  confidence: real("confidence").notNull().default(0), // 0.0 - 1.0
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  verifiedBy: text("verified_by").references(() => users.id),
  verifiedAt: text("verified_at"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Validation Results ────────────────────────────────────────────────────
export const validationSeverity = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export const validationResults = sqliteTable("validation_results", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id),
  fieldName: text("field_name").notNull(),
  severity: text("severity").notNull().default("warning"), // from validationSeverity
  ruleName: text("rule_name").notNull(), // e.g., "hs_code_format", "required_field"
  message: text("message").notNull(),
  expectedValue: text("expected_value"),
  actualValue: text("actual_value"),
  isResolved: integer("is_resolved", { mode: "boolean" }).notNull().default(false),
  resolvedBy: text("resolved_by").references(() => users.id),
  resolvedAt: text("resolved_at"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Webhooks ──────────────────────────────────────────────────────────────
export const webhooks = sqliteTable("webhooks", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  url: text("url").notNull(),
  secret: text("secret").notNull(), // for HMAC signing
  events: text("events").notNull(), // JSON array of event types
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastTriggeredAt: text("last_triggered_at"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// ─── API Keys ──────────────────────────────────────────────────────────────
export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  prefix: text("prefix").notNull(), // first 8 chars for identification
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastUsedAt: text("last_used_at"),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Processing Logs ───────────────────────────────────────────────────────
export const processingLogs = sqliteTable("processing_logs", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id),
  event: text("event").notNull(), // e.g., "extraction_started", "validation_completed"
  details: text("details"), // JSON blob
  level: text("level").notNull().default("info"), // info | warn | error
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});